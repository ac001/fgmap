<?php


$fetch = isset($_REQUEST['fetch']) ? $_REQUEST['fetch'] : null;


header('Content-type: text/plain');
$payload = array();
$payload['success'] = true; //* Extjs needs this to be true, else client side exception
$payload['fetch'] = $fetch;
//echo "fetch=$fetch";



switch($fetch){

	case 'pilots':
		$url = 'http://mpmap02.flightgear.org/fg_server_xml.cgi?mpserver02.flightgear.org:5001';
		$xml_string = file_get_contents($url);
		if(substr($xml_string, 0, 2) != '<?'){  // workround malform
			$xml_string = '<?xml version="1.0"?>'.$xml_string;
		}
		$fields = array('callsign', 'server_ip', 'model', 'lat', 'lng', 'alt', 'heading', 'pitch', 'roll');
		$pilots = array();
		$xml = new DOMDocument();
		$xml->loadXML($xml_string);
		foreach($xml->getElementsByTagName('marker') as $xml_marker_node){
			$pilot = array();
			foreach($fields as $field){
				$pilot[$field] = $xml_marker_node->getAttribute($field);
			}
			$pilots[$xml_marker_node->getAttribute('callsign')] = $pilot;
		}

		$payload['count'] = count($pilots);
		$payload['pilots'] = $pilots;
		break;

	case 'servers':
		// # id::longname::host::port::ip
		$servers = array();
		$block = null;
		$str = file_get_contents('../../fgmap.servers');
		$arr = explode("\n", $str);
		foreach($arr as $line){
			$l = trim($line);
			if($l == '' || substr($l, 0, 1) == '#'){
				//skip
			}elseif(substr($l, 0, 1) == '-'){
				$block = is_null($block) ? 'Live' : 'Devel';	
			}else{
				$sarr = explode('::', $l);
				$location = substr($sarr[1], strpos($sarr[1], '(') + 1, -1);
				$servers[] = array('type' => $block, 'id' => $sarr[0], 'longname' => $sarr[1],
									'host' => $sarr[2], 'port' => $sarr[3], 'ip' => $sarr[4],
									'location' => $location
								);
			}
		}
		$payload['servers'] = $servers;

		break;

	default: 
		$payload['error'] = 'Nothing to do';
		break;

}

echo json_encode($payload);
?>