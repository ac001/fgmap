/*
 * Pilots menu
 *
 * Pigeon <pigeon at pigeond dot net>
 *
 * GPLv2, see LICENSE file for details
 */

function FGMapMenuPilots(fgmap, tabdiv) {
    this.fgmap = fgmap;
    this.tabdiv = tabdiv;
    this.setup();

    /* A list of objects containing document elements for each pilot */
    this.pilots = new Object();
}


FGMapMenuPilots.prototype.filter_setup = function(div) {

    var FILTER_STR_HAVE = 'have';
    var FILTER_STR_DONTHAVE = 'don\'t have';
    var FILTER_FORM_MARGINLEFT = '24px';
    var FILTER_LINE_MARGINLEFT = '64px';

    var filter_div = this.filter_div = element_create(div, 'div');
    filter_div.style.width = "100%";
    filter_div.style.overflow = 'hidden';
    filter_div.style.margin = '0px';
    filter_div.style.padding = '0px';
    filter_div.style.textAlign = 'center';
    filter_div.style.lineHeight = '0px';

    var filter_box = this.filter_box = element_create(this.filter_div, 'div');
    filter_box.style.lineHeight = '100%';
    filter_box.style.textAlign = 'left';
    filter_box.style.borderBottom = '1px dotted #fff';
    filter_box.style.paddingBottom = '8px';
    element_hide(filter_box);

    var form = this.filter_form = element_create(this.filter_box, 'form');
    form.style.marginLeft = FILTER_FORM_MARGINLEFT;
    form.style.display = 'inline';
    form.action = '';
    form.method = '';

    attach_event(form, 'submit',
            this.filter_form_submit_cb.bind_event(this));
    form.onsubmit = this.filter_form_submit_cb.bind_event(this);

    element_text_append(form, 'Show pilots that');
    element_create(form, 'br');

    var but;
    var select;
    var option_have;
    var option_havent;
    var input;
    var filter;

    
    /* callsign filter */

    but = button_create(form, 'images/clear.gif', 'images/clear_pressed.gif',
            'Clear callsign filter',
            this.filter_callsign_clear_cb.bind_event(this), null);
    but.style.marginLeft = FILTER_LINE_MARGINLEFT;
    but.style.verticalAlign = 'bottom';

    element_text_append(form, '\u00a0');

    select = this.filter_callsign_select = element_create(form, 'select');
    select.className = 'fgmap_menu';
    select.style.marginTop = '4px';
    attach_event(select, 'change',
            this.filter_callsign_changed_cb.bind_event(this));

    option_have = element_create(select, 'option');
    option_have.text = FILTER_STR_HAVE;
    option_have.value = 1;

    option_havent = element_create(select, 'option');
    option_havent.text = FILTER_STR_DONTHAVE;
    option_havent.value = 0;

    element_text_append(form, '\u00a0');

    input = this.filter_callsign_input = element_create(form, 'input', 'text');
    input.size = 12;
    input.maxLength = 12;
    input.className = 'fgmap_menu';
    input.value = '';
    input.title = 'callsign keyword';
    input.style.verticalAlign = 'middle';
    attach_event(input, 'change',
            this.filter_callsign_changed_cb.bind_event(this));
    attach_event(input, 'keypress',
            this.filter_callsign_keypress_cb.bind_event(this));

    element_text_append(form, '\u00a0in the callsign');

    element_create(form, 'br');

    filter = this.fgmap.pilots_filter_get(FGMAP_PILOTS_FILTER_TYPE_CALLSIGN);
    if(filter) {
        input.value = filter.str || '';
        if(filter.cond) {
            option_have.selected = 1;
        } else {
            option_havent.selected = 1;
        }
    }


    /* aircraft filter */
    but = button_create(form, 'images/clear.gif', 'images/clear_pressed.gif',
            'Clear aircraft filter',
            this.filter_aircraft_clear_cb.bind_event(this), null);
    but.style.marginLeft = FILTER_LINE_MARGINLEFT;
    but.style.verticalAlign = 'bottom';

    element_text_append(form, '\u00a0');

    select = this.filter_aircraft_select = element_create(form, 'select');
    select.style.display = 'inline';
    select.className = 'fgmap_menu';
    attach_event(select, 'change',
            this.filter_aircraft_changed_cb.bind_event(this));

    option_have = element_create(select, 'option');
    option_have.text = FILTER_STR_HAVE;
    option_have.value = 1;

    option_havent = element_create(select, 'option');
    option_havent.text = FILTER_STR_DONTHAVE;
    option_havent.value = 0;

    element_text_append(form, '\u00a0');

    input = this.filter_aircraft_input = element_create(form, 'input', 'text');
    input.size = 12;
    input.maxLength = 12;
    input.className = 'fgmap_menu';
    input.value = '';
    input.title = 'aircraft model keyword';
    input.style.verticalAlign = 'middle';
    attach_event(input, 'change',
            this.filter_aircraft_changed_cb.bind_event(this));
    attach_event(input, 'keypress',
            this.filter_aircraft_keypress_cb.bind_event(this));

    element_text_append(form, '\u00a0in the aircraft model');

    filter = this.fgmap.pilots_filter_get(FGMAP_PILOTS_FILTER_TYPE_AIRCRAFT);
    if(filter) {
        input.value = filter.str || '';
        if(filter.cond) {
            option_have.selected = 1;
        } else {
            option_havent.selected = 1;
        }
    }

    /* TODO: server filter UI */
}


FGMapMenuPilots.prototype.setup = function() {

    var elem = this.div = element_create(null, 'div');
    elem.style.width = "100%";
    elem.style.height = "95%";
    //elem.style.overflow = "hidden";
    elem.style.overflow = "auto";
    elem.style.paddingTop = "4px";

    this.filter_setup(this.div);

    var list = this.list = element_create(this.div, "div");
    //list.style.position = 'absolute';
    list.style.position = 'relative';
    list.style.left = '0px';
    list.style.top = '0px';
    list.style.width = "100%";
    list.style.height = "100%";
    //list.style.overflow = "auto";
    list.style.margin = "0px auto";
    list.style.padding = "0px";
    element_hide(list);

    var ul = this.list_ul = element_create(this.list, "ul");

    // TODO
    if(USER_AGENT.is_ie) {
        ul.style.width = "94%";
    } else {
        ul.style.width = "98%";
    }

    ul.style.height = '100%';
    ul.style.listStyle = "none inside none";
    ul.style.margin = '0px';
    ul.style.padding = '0px 0px 0px 6px';

    var msg = this.msg = element_create(this.div, "div");
    msg.style.position = 'absolute';
    msg.style.left = '0px';
    msg.style.top = '0px';
    msg.className = "fgmap_pilot_tab_msg";
    msg.style.position = "relative";
    msg.style.textAlign = "center";
    msg.style.verticalAlign = "middle";
    msg.style.marginTop = "15px";
    msg.style.width = "100%";
    msg.style.height = "100%";

    /*
    var info = element_create(elem, "div");
    info.style.position = "absolute";
    info.style.width = "30%";
    info.style.height = "100%";
    info.style.left = "70%";
    info.style.top = "0px";
    info.style.borderLeft = "1px dotted #fff";
    info.style.padding = "12px 4px 0px 8px";
    info.style.lineHeight = "150%";
    info.style.overflow = "hidden";
    */


    this.tabdiv.tab_add("pilots", "pilots", this.div, this);

    this.server_changed_cb(FGMAP_EVENT_SERVER_CHANGED, null);
    this.fgmap.event_callback_add(FGMAP_EVENT_SERVER_CHANGED,
        this.server_changed_cb.bind_event(this), null);

    this.fgmap.event_callback_add(FGMAP_EVENT_PILOTS_POS_UPDATE,
        this.pilots_pos_update_cb.bind_event(this), null);

    this.fgmap.event_callback_add(FGMAP_EVENT_PILOT_JOIN,
        this.pilot_join_cb.bind_event(this), null);

    this.fgmap.event_callback_add(FGMAP_EVENT_PILOT_PART,
        this.pilot_part_cb.bind_event(this), null);

    this.fgmap.event_callback_add(FGMAP_EVENT_PILOT_PAN,
        this.pilot_pan_cb.bind_event(this), null);

    this.fgmap.event_callback_add(FGMAP_EVENT_PILOT_FOLLOW_ADD,
        this.pilot_follow_cb.bind_event(this), null);
    this.fgmap.event_callback_add(FGMAP_EVENT_PILOT_FOLLOW_REMOVE,
        this.pilot_follow_cb.bind_event(this), null);
    this.fgmap.event_callback_add(FGMAP_EVENT_PILOT_FOLLOWS_CLEAR,
        this.pilot_follow_cb.bind_event(this), null);

    /* The pilot filter toggle button */
    var filter_box_toggle_but = toggle_button_create(this.div,
            'images/filter.gif', 'images/filter_pressed.gif',
            'Show pilots filter', 'Hide pilots filter',
            this.filter_box_toggle.bind_event(this),
            this.filter_box_toggle.bind_event(this),
            null);
    filter_box_toggle_but.style.position = 'absolute';
    filter_box_toggle_but.style.top = '2px';

    /* Don't you hate making web sites... */
    if(USER_AGENT.is_gecko) {
        filter_box_toggle_but.style.right = '4px';
    } else {
        filter_box_toggle_but.style.left = '91%';
    }
};


FGMapMenuPilots.prototype.update = function() {

    var cnt = 0;

    var pilot;

    for(var callsign in this.fgmap.pilots) {

        cnt++;

        if((pilot = this.pilots[callsign]) == null) {
            // TODO: This should not happen(?)
            continue;
        }

        var p = this.fgmap.pilots[callsign];
        var lat = p.latlng.lat();
        var lng = p.latlng.lng();
        
        pilot.lat_span.innerHTML = lat.toFixed(4);
        pilot.lng_span.innerHTML = lng.toFixed(4);
    }
    
    if(cnt == 0) {
        element_hide(this.list);
        element_show(this.msg);
        this.msg.innerHTML = "No pilots";
    } else {
        element_show(this.list);
        element_hide(this.msg);
    }

};


FGMapMenuPilots.prototype.server_changed_cb = function(event, cb_data, name) {

    element_hide(this.list);

    // TODO: one way is more efficient, the other seems more clean(?). See, i
    // don't really know DOM :)
    /*
    this.list_ul.innerHTML = "";
    delete(this.pilots);
    this.pilots = new Object();
    */
    for(var p in this.pilots) {
        this.pilot_part_cb(FGMAP_EVENT_PILOT_PART, null, p);
    }

    element_show(this.msg);
    this.msg.innerHTML = "Loading pilots...";
};


FGMapMenuPilots.prototype.pilot_callsign_mouse_event_cb = function(e, callsign) {

    if(!callsign)
        return;

    if(!e) e = window.event;

    if(e.type == "click") {
        this.fgmap.pilot_pan(callsign);
    } else if(e.type == "mouseover") {
        target_get(e).className = "fgmap_pilot_callsign_highlight";
    } else if(e.type == "mouseout") {
        target_get(e).className = "fgmap_pilot_callsign";
    }
};


FGMapMenuPilots.prototype.pilot_follow_checkbox_cb = function(e, callsign) {
    if((target_get(e || window.event)).checked) {
        this.fgmap.pilot_follow_add(callsign);
    } else {
        this.fgmap.pilot_follow_remove(callsign);
    }
};


FGMapMenuPilots.prototype.pilots_pos_update_cb = function(event, cb_data) {
    this.update();
};


FGMapMenuPilots.prototype.pilot_follows_checkboxes_clear = function() {

    var elems = this.list.getElementsByTagName("input");

    for(var i = 0; i < elems.length; i++) {
        if(elems[i].type == "checkbox" && elems[i].name == "follow_checkbox") {
            elems[i].checked = false;
        }
    }

    this.fgmap.pilot_follows_clear();
};


FGMapMenuPilots.prototype.pilot_pan_cb = function(event, cb_data, callsign) {
    if(this.fgmap.follows.indexOf(callsign) == -1) {
        this.pilot_follows_checkboxes_clear();
    }
}


FGMapMenuPilots.prototype.pilot_follow_cb = function(event, cb_data, callsign) {

    if(event == FGMAP_EVENT_PILOT_FOLLOW_ADD) {

        this.pilots[callsign].checkbox.checked = true;

    } else if(event == FGMAP_EVENT_PILOT_FOLLOW_REMOVE) {

        this.pilots[callsign].checkbox.checked = false;

    } else if(event == FGMAP_EVENT_PILOT_FOLLOWS_CLEAR) {

        for(var p in this.pilots) {
            var pilot;
            if((pilot = this.pilots[p])) {
                pilot.checkbox.checked = false;
            }
        }
    }
}


FGMapMenuPilots.prototype.pilot_join_cb = function(event, cb_data, callsign) {

    if(this.pilots[callsign] != null) {
        // TODO
        return;
    }

    var p = this.fgmap.pilots[callsign];

    if(p == null)
        return;

    var pilot = new Object();

    var lat = p.latlng.lat();
    var lng = p.latlng.lng();

    var li = pilot.li = element_create(null, "li");
    li.style.width = "49%";
    li.style.cssFloat = "left";
    li.style.styleFloat = "left";
    li.style.verticalAlign = "middle";
    li.style.whiteSpace = "nowrap";
    li.style.paddingTop = "6px";
    li.style.paddingBottom = "6px";

    element_attach(li, this.list_ul);

    var table, tbody, tr, td;
    
    tr = element_create(element_create(element_create(li, 'table'), 'tbody'), 'tr');
    td = element_create(tr, 'td');
    td.style.verticalAlign = 'top';
    td.style.textAlign = 'left';

    var checkbox = pilot.checkbox = element_create(td, 'input', 'checkbox');
    //checkbox.className = "fgmap_menu";
    //checkbox.style.cssFloat = "left";
    //checkbox.style.styleFloat = "left";
    checkbox.title = "Tick to make this pilot always visible";
    checkbox.name = "follow_checkbox";
    attach_event(checkbox, "click",
        this.pilot_follow_checkbox_cb.bind_event(this, callsign));

    if(this.fgmap.follows.indexOf(callsign) != -1) {
        checkbox.checked = true;
        checkbox.defaultChecked = true;
    }

    td = element_create(tr, 'td');
    td.style.verticalAlign = 'top';
    td.style.textAlign = 'left';

    span = element_create(td, 'span');
    span.className = "fgmap_pilot_callsign";
    //span.style.cssFloat = "left";
    //span.style.styleFloat = "left";
    span.style.marginLeft = "4px";
    span.style.textDecoration = "underline";
    span.style.cursor = "pointer";
    span.title = "Click to pan to this pilot";
    element_text_create(span, callsign);
    attach_event(span, "click",
        this.pilot_callsign_mouse_event_cb.bind_event(this, callsign));
    attach_event(span, "mouseover",
        this.pilot_callsign_mouse_event_cb.bind_event(this, callsign));
    attach_event(span, "mouseout",
        this.pilot_callsign_mouse_event_cb.bind_event(this, callsign));

    element_create(td, 'br');

    element_text_append(td, "\u00a0");

    span = element_create(td, "span");
    span.className = "fgmap_pilot_tab_model";
    element_text_append(span, p.aircraft);

    element_text_append(td, "\u00a0");
    element_text_append(td, "\u00a0");
    element_text_append(td, "\u00a0");

    span = element_create(td, "span");
    span.className = "fgmap_pilot_tab_server";

    var fgserver;
    var n;

    fgserver = this.fgmap.server_get_by_ip(p.server_ip);

    if(fgserver == null) {
        span.innerHTML = p.server_ip;
    } else {
        span.innerHTML = fgserver.name.replace(/:[0-9]+/, '');
    }

    element_create(td, "br");

    element_text_append(td, "\u00a0");
    element_text_append(td, "(");

    span = pilot.lat_span = element_create(td, "span");
    span.className = "fgmap_pilot_tab_lat";
    span.innerHTML = lat.toFixed(4);

    element_text_append(td, " , ");

    span = pilot.lng_span = element_create(td, "span");
    span.className = "fgmap_pilot_tab_lng";
    span.innerHTML = lng.toFixed(4);

    element_text_append(td, ")");

    this.pilots[callsign] = pilot;
};


FGMapMenuPilots.prototype.pilot_part_cb = function(event, cb_data, callsign) {

    var pilot;

    if((pilot = this.pilots[callsign])) {
        this.pilots[callsign] = null;
        element_remove(pilot.li);
        /* Do we need all these? */
        pilot.li = null;
        pilot.checkbox = null;
        pilot.lat_span = null;
        pilot.lng_span = null;
        pilot = null;
        delete(pilot);
    }
};



/* Pilots filter functions */


FGMapMenuPilots.prototype.filter_box_toggle = function() {
    element_visible_toggle(this.filter_box);
}

FGMapMenuPilots.prototype.filter_box_toggle_img_click_cb = function(e) {
    this.filter_box_toggle();
};


FGMapMenuPilots.prototype.filter_form_submit_cb = function(e) {
    return false;
};


FGMapMenuPilots.prototype.filter_callsign_changed_cb = function(e) {
    this.fgmap.pilots_filter_set(FGMAP_PILOTS_FILTER_TYPE_CALLSIGN,
            this.filter_callsign_input.value,
            this.filter_callsign_select.value);
};

FGMapMenuPilots.prototype.filter_aircraft_changed_cb = function(e) {
    this.fgmap.pilots_filter_set(FGMAP_PILOTS_FILTER_TYPE_AIRCRAFT,
            this.filter_aircraft_input.value,
            this.filter_aircraft_select.value);
};

FGMapMenuPilots.prototype.filter_callsign_clear_cb = function(e) {
    this.filter_callsign_input.value = '';
    this.filter_callsign_select.value = 1;
    this.filter_callsign_changed_cb(null);
};

FGMapMenuPilots.prototype.filter_aircraft_clear_cb = function(e) {
    this.filter_aircraft_input.value = '';
    this.filter_aircraft_select.value = 1;
    this.filter_aircraft_changed_cb(null);
};

FGMapMenuPilots.prototype.filter_callsign_keypress_cb = function(e) {
    e = e || window.event;
    if(e.keyCode == 13) {
        this.filter_callsign_changed_cb(null);
    }
};

FGMapMenuPilots.prototype.filter_aircraft_keypress_cb = function(e) {
    e = e || window.event;
    if(e.keyCode == 13) {
        this.filter_aircraft_changed_cb(null);
    }
};

/* vim: set sw=4 sts=4 expandtab: */
