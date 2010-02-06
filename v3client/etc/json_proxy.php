<?php

$url = 'http://mpmap02.flightgear.org/fg_server_xml.cgi?mpserver02.flightgear.org:5001';

$is_xml = isset($_REQUEST["format"]) && $_REQUEST["format"] == 'xml' ? true : false;

$xml_string = file_get_contents($url);
if(substr(0,2) != '<?'){
	$xml_string = '<?xml version="1.0"?>'.$xml_string;
}

header('Content-type: text/plain');

//*******************************************************
//** Return XML
//*******************************************************
if($is_xml){
	echo $xml_string;
	die;
}

//*******************************************************
//** Return Json
//*******************************************************
$fields = array('callsign', 'server_ip', 'model', 'lat', 'lng', 'alt', 'heading', 'pitch', 'roll');
$pilots = array();
$xml = new DOMDocument();
$xml->loadXML($xml_string);
foreach($xml->getElementsByTagName('marker') as $xml_marker_node){
	$pilot = array();
	foreach($fields as $field){
		$pilot[$field] = $xml_marker_node->getAttribute($field);
	}
	$pilots[] = $pilot;
}

$payload = array();
$payload['success'] = true; //* Extjs needs this to be true, else client side exception
$payload['count'] = count($pilots);
$payload['pilots'] = $pilots;

echo json_encode($payload);

?>