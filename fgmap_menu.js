/*
 * FGMapMenu
 */


/*
 * @param id        the FGMap object
 */
function FGMapMenu(fgmap) {
    this.id = "FGMapMenu";
    this.fgmap = fgmap;
    this.div = fgmap.div;
    this.init();
}


FGMapMenu.prototype.init = function() {

    var html;
    var elem;

    // FIXME
    var menu_height = "160px";

    /* The whole menu container */
    elem = this.menu_container = element_create(this.div, "div");
    elem.style.position = "absolute";
    elem.style.bottom = "0px";
    elem.style.width = "50%";
    elem.style.color = "#fff";
    //elem.style.backgroundColor = "transparent";
    elem.style.overflow = "hidden";
    element_opacity_set(elem, 0.8);

    html = "";
    html += "<b class=\"mh\">";
    html += "<b class=\"m1\"></b>";
    html += "<b class=\"m2\"></b>";
    html += "<b class=\"m3\"></b>";
    html += "<b class=\"m4\"></b>";
    html += "<b class=\"m5\"></b>";
    html += "</b>";

    elem.innerHTML = html;


    /* menu title container */
    elem = this.menu_title_container =
        element_create(this.menu_container, "div");
    elem.className = "fgmap_menu_title";
    elem.style.textAlign = "center";
    elem.style.paddingTop = "2px";
    elem.style.paddingBottom = "4px";
    elem.style.overflow = "hidden";
    elem.style.fontWeight = "bold";

    var span = this.menu_title_span = element_create(elem, "span");
    span.className = "fgmap_menu_title";
    span.style.cursor = "pointer";
    span.style.padding = "0px";
    span.style.margin = "0px";
    span.title = "Click here to bring up menu";

    attach_event(span, "click", this.menu_visible_toggle.bind_event(this));

    /* Just because stupid IE doesn't support CSS properly... */
    attach_event(span, "mouseover",
                    this.menu_title_mouse_event_cb.bind_event(this));
    attach_event(span, "mouseout",
                    this.menu_title_mouse_event_cb.bind_event(this));


    elem = element_create(span, "span");
    elem.className = "fgmap_title_label";
    elem.innerHTML = "FGMap&nbsp;|&nbsp;";

    elem = this.menu_title_server =
        element_create(span, "span");
    elem.className = "fgmap_title_value";
    elem.innerHTML = "(none)";

    elem = element_create(span, "span");
    elem.className = "fgmap_v_separator";
    elem.innerHTML = "&nbsp;|&nbsp;";

    elem = element_create(span, "span");
    elem.className = "fgmap_title_label";
    elem.innerHTML = "pilots: ";

    elem = this.menu_title_pilots =
        element_create(span, "span");
    elem.className = "fgmap_title_value";
    elem.innerHTML = "-";


    var anchor = this.linktomap =
        element_create(this.menu_title_container, "a");
    anchor.style.position = "absolute";
    anchor.style.right = "0px";
    anchor.style.top = "0px";
    anchor.style.padding = "4px 8px 0px 0px";
    anchor.style.cursor = "pointer";
    anchor.title = "Link to this map";

    var elem = element_create(anchor, "img");
    elem.src = "images/link.png";
    elem.title = "Link to this map";
    elem.alt = "Link to this map";
    elem.style.border = "0px";
    img_ie_fix(elem);

    attach_event(elem, "mouseover", function(e) {
        var target = target_get(e || window.event);
        target.src = "images/link_active.png";
        img_ie_fix(target);
    });
    attach_event(elem, "mouseout", function(e) {
        var target = target_get(e || window.event);
        target.src = "images/link.png";
        img_ie_fix(target);
    });


    /* menu body part */
    elem = this.menu_body = element_create(this.menu_container, "div");
    elem.className = "fgmap_menu";
    elem.style.overflow = "hidden";
    elem.style.width = "100%";
    elem.style.height = menu_height;
    elem.style.maxHeight = menu_height;
    elem.style.display = "none";
    elem.style.paddingTop = "2px";
    elem.style.paddingBottom = "5px";
    elem.style.borderTop = "1px dotted #fff";


    /* menu body content part */
    elem = this.menu_content = element_create(this.menu_body, "div");
    elem.className = "fgmap_menu";
    elem.style.position = "relative";
    elem.style.overflow = "hidden";
    elem.style.width = "100%";
    elem.style.height = "90%";

    /* menu body tabs */
    elem = this.menu_tabs = element_create(this.menu_body, "div");
    elem.setAttribute("id", "fgmap_menu_tabs");
    elem.className = "fgmap_menu";
    elem.style.position = "relative";
    elem.style.height = "auto";
    elem.style.width = "100%";
    elem.style.textAlign = "left";
    elem.style.whiteSpace = "nowrap";
    elem.style.overflow = "hidden";
    elem.style.paddingTop = "1px";
    elem.style.paddingBottom = "6px";


    this.map_resize_cb();

    this.fgmap.event_callback_add(FGMAP_EVENT_MAP_RESIZE,
        this.map_resize_cb.bind_event(this), null);

    // TODO
    if(this.fgmap.fg_server_current != null) {
        this.server_changed_cb(FGMAP_EVENT_SERVER_CHANGED, null,
            this.fgmap.fg_server_current.name);
    }

    this.fgmap.event_callback_add(FGMAP_EVENT_SERVER_CHANGED,
        this.server_changed_cb.bind_event(this), null);

    this.fgmap.event_callback_add(FGMAP_EVENT_PILOTS_POS_UPDATE,
        this.pilots_pos_update_cb.bind_event(this), null);


    this.map_view_changed_cb(FGMAP_EVENT_MAP_VIEW_CHANGED, null);

    this.fgmap.event_callback_add(FGMAP_EVENT_MAP_VIEW_CHANGED,
        this.map_view_changed_cb.bind_event(this), null);

    this.default_menu_add();
};


FGMapMenu.prototype.default_menu_add = function() {

    this.about_tab_setup();
    this.help_tab_setup();

    if(typeof(FGMapMenuPilots) == "function") {
        new FGMapMenuPilots(this);
    }

    if(typeof(FGMapMenuServer) == "function") {
        new FGMapMenuServer(this);
    }

    if(typeof(FGMapMenuSettings) == "function") {
        new FGMapMenuSettings(this);
    }

}


FGMapMenu.prototype.fgmapmenu_sort_func = function(m1, m2) {
    if(m1.gravity < m2.gravity)
        return -1;
    else
        return 1;
};


/**
 * Add a tab to the FGMapMenu.
 *
 * @param id                the id for the tab, must be unique
 * @param title             the title for the tab, where it appears at the tab
 * @param child             the html element to be appended into this tab as
 *                          content
 * @param data              the user data attached to this tab
 * @param gravity           optional
 * @param noautofocus       optional
 */
FGMapMenu.prototype.tab_add = function(id, title, child, data,
                                        gravity, noautofocus) {

    if(!id || !title ||
        !this.menu_container || !this.menu_content || !this.menu_tabs) {
        return false;
    }

    if(this.menus && this.menus[id])
        return false;

    var elem;
    
    /* The actual content part of this tab */
    elem = element_create(this.menu_content, "div");
    elem.style.position = "relative";
    elem.style.left = "0px";
    elem.style.top = "0px";
    elem.style.width = "100%";
    elem.style.height = "100%";

    if(child) {
        elem.appendChild(child);
    }

    if(!this.menus) {
        this.menus = new Object();
    }
    

    if(this.menu_current == null && !noautofocus) {
        this.menu_current = id;
        element_show(elem);
    } else {
        element_hide(elem);
    }

    // callback functions for the tab
    var mouseover_func = function(e, id) {
        if(this.menu_current != id) {
            target_get(e).className = "hover";
        }
    };

    var mouseout_func = function(e, id) {
        if(this.menu_current != id) {
            target_get(e).className = "";
        }
    };

    var mouseclick_func = function(e, id) {
        this.tab_set(id);
    };

    gravity = (gravity || 0);

    // The tab part, where you click and switch
    var tab_span;
    var attached = false;

    // TODO: this is not very efficient, but this hopefully won't be called
    // that much.
    var tmp_arr = new Array();
    for(var i in this.menus) {
        tmp_arr.push(this.menus[i]);
    }
    tmp_arr = tmp_arr.sort(this.fgmapmenu_sort_func);

    tab_span = element_create(null, "span");

    for(var i = 0; i < tmp_arr.length; i++) {
        if(tmp_arr[i].gravity > gravity) {
            //alert("inserting " + title + " before " + tmp_arr[i].title);
            element_attach_before(tab_span, tmp_arr[i].tab_span,
                this.menu_tabs);
            attached = true;
            break;
        }
    }

    if(!attached) {
        //alert("inserting " + title + " at the end");
        element_attach(tab_span, this.menu_tabs);
    }

    tab_span.style.cursor = "pointer";
    tab_span.style.width = "1px";
    tab_span.innerHTML = title;

    this.menus[id] = new Object();
    this.menus[id].title = title;
    this.menus[id].data = data;
    this.menus[id].tab_content = elem;
    this.menus[id].tab_child = child;
    this.menus[id].tab_span = tab_span;
    this.menus[id].gravity = gravity;

    if(id == this.menu_current) {
        tab_span.className = "current";
    }

    attach_event(tab_span, "mouseover", mouseover_func.bind_event(this, id));
    attach_event(tab_span, "mouseout", mouseout_func.bind_event(this, id));
    attach_event(tab_span, "click", mouseclick_func.bind_event(this, id));

    // Yet another IE workaround because it sux
    if(USER_AGENT.is_ie) {
        var elems = elem.getElementsByTagName("input");
        for(var i = 0; i < elems.length; i++) {
            if(elems[i].type == "checkbox" && elems[i].mychecked) {
                elems[i].checked = true;
            }
        }
    }

    return true;
};


FGMapMenu.prototype.tab_remove = function(id) {

    if(!this.menus[id])
        return false;

    element_remove(this.menus[id].tab_span);
    element_remove(this.menus[id].tab_child);
    element_remove(this.menus[id].tab_content);
    delete(this.menus[id]);

    if(this.menu_current == id) {
        // TODO: How to get just the first key from the hash?
        for(var i in this.menus) {
            this.tab_set(this.menus[i]);
            break;
        }
    }
};


FGMapMenu.prototype.tab_data_get = function(id) {

    if(!this.menus[id])
        return null;

    return this.menus[id].data;
};


FGMapMenu.prototype.tab_set = function(id) {

    if(this.menu_current == id)
        return false;

    if(!this.menus[id])
        return false;

    element_hide(this.menus[this.menu_current].tab_content);
    this.menus[this.menu_current].tab_span.className = "";

    element_show(this.menus[id].tab_content);
    this.menus[id].tab_span.className = "current";

    this.menu_current = id;

    return true;
};


FGMapMenu.prototype.menu_visible_toggle = function() {

    if(!this.menu_body)
        return;

    if(this.menu_body.style.display == "block") {
        this.menu_visible_set(false);
    } else {
        this.menu_visible_set(true);
    }

};


FGMapMenu.prototype.menu_visible_set = function(visible) {

    if(!this.menu_body)
        return;

    if(visible) {
        element_show(this.menu_body);
        this.menu_title_span.title = "Click here to hide menu";
    } else {
        element_hide(this.menu_body);
        this.menu_title_span.title = "Click here to bring up menu";
    }

};



FGMapMenu.prototype.menu_title_mouse_event_cb = function(e) {

    if(!e) e = window.event;

    if(e.type == "mouseover") {
        this.menu_title_span.className = "fgmap_menu_title_highlight";
    } else if(e.type == "mouseout") {
        this.menu_title_span.className = "fgmap_menu_title";
    }
};


FGMapMenu.prototype.about_tab_setup = function() {

    var elem = element_create(null, "div");
    elem.style.textAlign = "center";
    elem.style.padding = "8px 8px 8px 8px";
    elem.style.margin = "0px 0px 0px 0px";
    elem.style.lineHeight = "180%";

    elem.innerHTML = "\
FGMap " + this.fgmap.version + " - <a href=\"http://www.flightgear.org/\">FlightGear</a> network server traffic map<br>\
Written by <a href=\"http://pigeond.net/\">Pigeon</a><br>\
Powered by <a href=\"http://maps.google.com/\">Google Map</a><br>\
<a href=\"http://www.o-schroeder.de/fg_server/\">FlightGear server</a> written by Oliver Schroeder\
";

    this.tab_add("about", "about", elem, null, 1000, true);
};


FGMapMenu.prototype.help_tab_setup = function() {

    var elem = element_create(null, "div");

    elem.className = "fgmap_help";
    elem.style.textAlign = "left";
    elem.style.overflow = "auto";
    elem.style.margin = "0px auto";
    elem.style.padding = "8px 16px 4px 16px";
    elem.style.height = "90%";

    elem.innerHTML = "\
\
<p style=\"text-align: center; font-weight: bold;\">\
General help\
</p>\
\
<ul style=\"margin: 0px 0px 0px 0px; padding: 0px 0px 0px 8px;\">\
    <li>You can minimize this menu dock by clicking on the title (where the \"FGMap - server name - pilots: n\" is). Click on it again to bring up this menu again.</li>\
    <li>The <img src=\"images/link.png\" alt=\"\" title=\"\" border=0 align=\"middle\"> icon at the top right hand corner of the menu box gives you a permanent link to current view of the map, which includes the current zoom level, map type, and pilots that map is following.</li>\
</ul>\
\
<p style=\"text-align: center; font-weight: bold;\">\
Pilots tab\
</p>\
\
<ul style=\"margin: 0px 0px 0px 0px; padding: 0px 0px 0px 8px;\">\
    <li>You can pan to a pilot by clicking on the callsign/name.</li>\
    <li>You can \"follow\" and track a pilot by ticking the checkbox of a pilot. This means that pilot will always be visible on the map. You can follow more than one pilot, and the map will pan and zoom automatically.</li>\
</ul>\
\
<p style=\"text-align: center; font-weight: bold;\">\
Server tab\
</p>\
\
<ul style=\"margin: 0px 0px 0px 0px; padding: 0px 0px 0px 8px;\">\
    <li>You can select which server the map will be showing from the server dropdown list.</li>\
    <li>You can toggle updating of the map using the checkbox provided.</li>\
    <li>You can change how often the map will update using the textbox provided.</li>\
</ul>\
\
<p style=\"text-align: center; font-weight: bold;\">\
Settings tab\
</p>\
\
<ul style=\"margin: 0px 0px 0px 0px; padding: 0px 0px 0px 8px;\">\
    <li>You can choose how the pilot label will be shown on the map. Currently there are 3 modes:<br>\
        <ul style=\"margin: 0px 0px 0px 0px; padding: 0px 0px 0px 16px;\">\
            <li style=\"line-height: 150%;\"><code>always</code> - labels will be shown for all pilots at any time.</li>\
            <li style=\"line-height: 150%;\"><code>follow always</code> - labels will only be shown for pilots which are selected for \"follow\" in the pilot tab.</li>\
            <li style=\"line-height: 150%;\"><code>mouse over only</code> - labels will only be shown when you move your mouse over the icon of a pilot.</li>\
        </ul>\
    <li>You can turn on or off the trails of pilots with the \"Pilot trails\" checkbox.</li>\
    <li>You can turn on or off photographic icon for pilots with the \"Model icon\" checkbox. Currently this only works for c172p, 737 and the ufo.</li>\
    <li>You can turn on or off the \"Zoom/Pan to all pilots\" mode with the corresponding checkbox. When this mode is enabled, all pilots will be \"followed\" automatically at all time. That also means any new pilots joining will be followed automatically too.</li>\
    <li>You can turn on debug mode of the map with the \"Debug\" checkbox. When it is turned on a debug tab will be added, showing debugging messages of the map.</li>\
</ul>\
\
<p style=\"text-align: center; font-weight: bold;\">Startup parameters</p>\
You can specify certain startup parameters for the map. Parameters are passed using standard URL query string. Key and value pairs are appended to the URL like:<br><br>\
<code>http://blah.net/fgmap.html?key1=value1&key2=value2</code><br><br>\
Currently valid keys and values are:<br>\
<ul style=\"margin: 0px 0px 0px 0px; padding: 0px 0px 0px 16px;\">\
    <li style=\"line-height: 150%;\">\
        <code>fg_server</code> - FG server to use at startup.<br>\
        value format: <i>server name,server host,admin port</i><br>\
        <ul style=\"margin: 0px 0px 0px 0px; padding: 0px 0px 0px 16px;\">\
            <li style=\"line-height: 150%;\"><i>server name</i>: the name of the server which would be shown in the server selection dropdown list.<br></li>\
            <li style=\"line-height: 150%;\"><i>server host</i>: the host of the server, this could be the host name or the IP address of the server.<br></li>\
            <li style=\"line-height: 150%;\"><i>admin port</i>: the admin port number of the server, this is usually the port you use for FlightGear --multiplay <b>plus one</b>.<br></li>\
        </ul>\
        example: <code>fg_server=os-devel,postrobot.de,5003</code>\
    </li>\
    <li style=\"line-height: 150%;\">\
    <code>ll</code> - Longitude and latitude (in that order) at startup.<br>\
    example: <code>ll=-122.357237,37.613545</code>\
    </li>\
    <li style=\"line-height: 150%;\">\
    <code>z</code> - map zoom level, range 0 - 17, being 0 is the highest zoom level.<br>\
    example: <code>z=0</code>\
    </li>\
    <li style=\"line-height: 150%;\">\
    <code>t</code> - map type, m for map, s for satellite, h for hybrid.<br>\
    example: <code>t=s</code>\
    </li>\
    <li style=\"line-height: 150%;\">\
    <code>follow</code> - Follow the pilot at startup given its callsign. Multiple follow is allowed.<br>\
    example: <code>follow=pigeon&follow=ampere</code>\
    </li>\
</ul>\
<br><br><br>\
";

    this.tab_add("help", "help", elem, null, 999, true);
};


/* FGMapMenu callbacks */
FGMapMenu.prototype.map_resize_cb = function(event, cb_data) {
    this.menu_container.style.left =
        ((this.div.clientWidth - this.menu_container.clientWidth) / 2) + "px";
};


FGMapMenu.prototype.server_changed_cb = function(event, cb_data, name) {
    this.menu_title_pilots.innerHTML = "-";
    this.menu_title_server.innerHTML = name;
};


FGMapMenu.prototype.pilots_pos_update_cb = function(event, cb_data) {
    this.menu_title_pilots.innerHTML = this.fgmap.pilots_cnt;
};


FGMapMenu.prototype.map_view_changed_cb = function(event, cb_data) {
    this.linktomap.href = this.fgmap.linktomap;
};


/* vim: set sw=4 sts=4:*/

