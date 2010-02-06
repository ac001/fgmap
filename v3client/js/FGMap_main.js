
Ext.onReady(function(){

//var pilotRecord = new Ext.data.Record.create([

//]);

var pilotsStore = new Ext.data.JsonStore({
	url: "etc/json_proxy.php",
	method: 'GET',
	baseParams: {},
	//id: "callsign",
	root: "pilots",
	fields: [ 	{name: "callsign", type: 'string'},
				{name: "server_ip", type: 'string'},
				{name: "model", type: 'string'},
				{name: "lat", type: 'string'},
				{name: "lng", type: 'string'},
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
pilotsStore.on("load", function(){
	console.log("loaded", pilotsStore.getTotalCount());
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
							autoScroll: true,
							autoWidth: true,
							tbar:[  //this.actionAdd, this.actionEdit, this.actionDelete, 
									'-',// this.actionLabSelectToolbarButton,
									'->',
									//Geo2.widgets.goto_www('Online', 'View rates on website', '/rates.php'),
									{text: 'Refresh', iconCls: 'icoRefresh', handler: function(){
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
										{header: 'Alt', dataIndex:'alt', sortable: true, align: 'right',
											renderer: function(v, meta, rec, rowIdx, colIdx, store){
												return "#" + v;
											}
										}
							],
							listeners: {},
							bbar: []
						}),
						{
						title: 'Navigation',
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
                activeTab: 0,     // first tab initially active
                items: [{
                    contentEl: 'map_canvas',
                    title: 'Map',
                    closable: true,
                    autoScroll: true
                }, {
                    contentEl: 'center2',
                    title: 'Server Status',
                    autoScroll: true
                }]
            })]
        });
        // get a reference to the HTML element with id "hideit" and add a click listener to it 
        //Ext.get("hideit").on('click', function(){
            // get a reference to the Panel that was created with id = 'west-panel' 
           // var w = Ext.getCmp('west-panel');
            // expand or collapse that Panel based on its collapsed property state
           // w.collapsed ? w.expand() : w.collapse();
        //});

		pilotsStore.load();
		map_initialize();
    });
