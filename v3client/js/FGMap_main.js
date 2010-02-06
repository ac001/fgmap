
Ext.onReady(function(){



var latLabel = new Ext.Toolbar.TextItem({text:'Lat: 80.23'});
var lngLabel = new Ext.Toolbar.TextItem({text:'Lng: -000.23'});

var pilotsSummaryCountLabel = new Ext.Toolbar.TextItem({text:'No pilots'});
var pilotsDataCountLabel = new Ext.Toolbar.TextItem({text:'No pilots'});


//* list of pilot markers (atmo there is no ID etc in api3)
var pilotMarkers = {};

//* Pilots Datastore
var pilotsStore = new Ext.data.JsonStore({
	url: "etc/json_proxy.php",
	baseParams: {fetch: 'pilots'},
	method: 'GET',
	//id: "callsign",
	root: "pilots",
	fields: [ 	{name: "callsign", type: 'string'},
				{name: "server_ip", type: 'string'},
				{name: "model", type: 'string'},
				{name: "lat", type: 'float'},
				{name: "lng", type: 'float'},
				{name: "alt", type: 'int'},
				{name: "heading", type: 'string'},
				{name: "pitch", type: 'string'},
				{name: "roll", type: 'string'}
	],
	sortInfo: {field: "callsign", direction: 'ASC'}
});
pilotsStore.on("exception", function(prx, typ, act){
	//TODO
	console.log("exception", prx, typ, act);
});

///*** Load event and pilot markers
pilotsStore.on("load", function(){
	//* update count labels
	var cnt = pilotsStore.getTotalCount();
	if(cnt == 0){
		pilotsSummaryCountLabel.setText("No Pilots Online")
		pilotsDataCountLabel.setText("No Pilots Online")
	}else{
		pilotsSummaryCountLabel.setText(cnt + " Pilots Online")
		pilotsDataCountLabel.setText(cnt + " Pilots Online")
	}
	//* iterate through pilots and add or update markets
	for(var idx=0; idx < pilotsStore.getTotalCount(); idx++){
		var rec = pilotsStore.getAt(idx);
		var callsign = rec.get('callsign');
		var latlng = new google.maps.LatLng(rec.get('lat'),rec.get('lng'));

		if(pilotMarkers[callsign]){ // marker exists so update
			pilotMarkers[callsign].setPosition(latlng);

		}else{ // create a new marker
			pilotMarkers[callsign] = new google.maps.Marker({
				position: latlng, 
				map: fgMap, 
				title: callsign
			}); 
		}
		//console.log(rec);
		//return;
	}
});
    
// NOTE: This is an example showing simple state management. During development,
// it is generally best to disable state management as dynamically-generated ids
// can change across page loads, leading to unpredictable results.  The developer
// should ensure that stable state ids are set for stateful components in real apps.
//TODO - sense LOCAL_DEV env
// uncommnet below for production 
//Ext.state.Manager.setProvider(new Ext.state.CookieProvider());

        
var viewport = new Ext.Viewport({
	layout: 'border',
	plain: true,
	items: [
		//** Left/West area
		{title: 'Flight Gear Map', region: 'west',
			split: true,
			width: 300,
			minSize: 175,
			maxSize: 400,
			collapsible: true,
			margins: '0 0 0 5',
			layout: {
				type: 'fit'
			},
			items: new Ext.TabPanel({
				activeTab: 0,
				items: [
					//**** Pilots Lookup Grid
					new Ext.grid.GridPanel({
						title: 'Pilots',
						iconCls: 'iconPilots',
						autoScroll: true,
						autoWidth: true,
						tbar:[  //this.actionAdd, this.actionEdit, this.actionDelete, 
								'-',// this.actionLabSelectToolbarButton,
								'->',
								//Geo2.widgets.goto_www('Online', 'View rates on website', '/rates.php'),
								{text: 'Refresh', iconCls: 'iconRefresh', handler: function(){
									pilotsStore.reload();
									}
								}    
						],
						viewConfig: {emptyText: 'No pilots online', forceFit: true}, 
						//sm: this.selModel,
						store: pilotsStore,
						loadMask: true,
						columns: [  //this.selModel,	
									{header: 'CallSign',  dataIndex:'callsign', sortable: true},
									{header: 'Aircraft',  dataIndex:'model', sortable: true}
						],
						listeners: {},
						bbar: [pilotsSummaryCountLabel]
					}),
					//**** Navigation Widget
					{
					title: 'Navigation',
					iconCls: 'iconNavigation',
					html: '<p>Some settings in here.</p>',
					border: false,
					iconCls: 'settings'
					}
				]
			   }) // end tabpanel
            },
            // in this instance the TabPanel is not wrapped by another panel
            // since no title is needed, this Panel is added directly
            // as a Container
            new Ext.TabPanel({
                region: 'center', // a center region is ALWAYS required for border layout
                deferredRender: false,
                activeTab: 0, 
                items: [
					new Ext.Panel(
					{
						contentEl: 'map_canvas',
						title: 'Map&nbsp;&nbsp;',
						iconCls: 'iconMap',
						tbar: [ '->', latLabel, lngLabel],
						autoScroll: true
					}),
					//***************************************************
					//**** Pilots Main Grid
					new Ext.grid.GridPanel({
						title: 'Pilots Data',
						iconCls: 'iconPilots',
						autoScroll: true,
						autoWidth: true,
						tbar:[  //this.actionAdd, this.actionEdit, this.actionDelete, 
								'-',// this.actionLabSelectToolbarButton,
								'->',
								//Geo2.widgets.goto_www('Online', 'View rates on website', '/rates.php'),
								{text: 'Refresh', iconCls: 'iconRefresh', handler: function(){
									pilotsStore.reload();
									}
								}    
						],
						viewConfig: {emptyText: 'No pilots online', forceFit: true}, 
						//sm: this.selModel,
						store: pilotsStore,
						loadMask: true,
						columns: [  //this.selModel,	
							{header: 'CallSign',  dataIndex:'callsign', sortable: true},
							{header: 'Aircraft',  dataIndex:'model', sortable: true},
							{header: 'Lat', dataIndex:'lat', sortable: true, align: 'right',
								renderer: function(v, meta, rec, rowIdx, colIdx, store){
									return v;
								}
							},
							{header: 'Lng', dataIndex:'lng', sortable: true, align: 'right',
								renderer: function(v, meta, rec, rowIdx, colIdx, store){
									return v;
								}
							},
							{header: 'Alt', dataIndex:'alt', sortable: true, align: 'right',
								renderer: function(v, meta, rec, rowIdx, colIdx, store){
									return v;
								}
							},
							{header: 'Heading', dataIndex:'heading', sortable: true, align: 'right',
								renderer: function(v, meta, rec, rowIdx, colIdx, store){
									return v;
								}
							},
							{header: 'Pitch', dataIndex:'pitch', sortable: true, align: 'right',
								renderer: function(v, meta, rec, rowIdx, colIdx, store){
									return v;
								}
							},
							{header: 'Roll', dataIndex:'roll', sortable: true, align: 'right',
								renderer: function(v, meta, rec, rowIdx, colIdx, store){
									return v;
								}
							},
							{header: 'Server', dataIndex:'server_ip', sortable: true, align: 'left',
								renderer: function(v, meta, rec, rowIdx, colIdx, store){
									return v;
								}
							},

						],
						listeners: {},
						bbar: [pilotsDataCountLabel]
					}),
				//** Server Status
				{
                    contentEl: 'center2',
                    title: 'Servers Status',
					iconCls: 'iconServerStatus',
                    autoScroll: true
                }
				]
            })]
        });

//pilotsStore.load();
map_initialize();

}); /* Ext.onready() */

