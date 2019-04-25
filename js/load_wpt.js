
var GPX_json;

function readGPXFile(event) {
    var fileList = event.target.files;

    for(var i=0; i < fileList.length; i++ ) {
        loadAsText(fileList[i]);
    }
}

var openFile = function(event) {
	var input = event.target;
	var text = "";
	var reader = new FileReader();
	var onload = function(event) {
		text = reader.result;
		parseFile(text);
	};
	reader.onload = onload;
    reader.readAsText(input.files[0]);
};

function loadAsText(theFile) {
    var reader = new FileReader();
    reader.onload = function(fileobj) {
        // result contains loaded file.
        var text = fileobj.target.result;
        console.log(text);
        //alert("loop " + text);

        parser = new DOMParser();
        xml = parser.parseFromString(text,"text/xml");
        var json = xmlToJson(xml);
        GPX_json = json;

        update_wpt_list();
    }
    reader.readAsText(theFile);
}

function update_wpt_list() {
    for (i in GPX_json.gpx.wpt) {
        wpt_txt = GPX_json.gpx.wpt[i].name['#text'];
        //alert(wpt_txt);

        var table = document.getElementById("waypoint_list_body");
        var waypoint = document.getElementById(wpt_txt);
        var row = table.insertRow();

        var cell_name = row.insertCell(0);
        cell_name.innerHTML = wpt_txt;
        cell_name.className = "wpt_name max-width";
        
        var cell_lat = row.insertCell(1);
        cell_lat.innerHTML = GPX_json.gpx.wpt[i]["@attributes"].lat;

        var cell_lon = row.insertCell(2);
        cell_lon.innerHTML = GPX_json.gpx.wpt[i]["@attributes"].lon;

        var cell_sym = row.insertCell(3);
        cell_sym.innerHTML = GPX_json.gpx.wpt[i].sym['#text'];
        cell_sym.className = "wpt_symbol";

        var cell_type = row.insertCell(4);
         
        if (typeof GPX_json.gpx.wpt[i].type !== 'undefined') {
            cell_type.innerHTML = GPX_json.gpx.wpt[i].type['#text'];
            cell_type.className = "wpt_type";
        }

        var cell_desc = row.insertCell(5);
        cell_desc.innerHTML = GPX_json.gpx.wpt[i].desc['#text'];
        cell_desc.className = "wpt_description";

        var cell_bearing = row.insertCell(6);
        cell_bearing.innerHTML = 'unknown';  //bearing

        var cell_distance = row.insertCell(7);
        cell_distance.innerHTML = 'unknown';  //distance
    }
    update_wpt_bearings();
}

function update_wpt_bearings() {
    console.log('updating bearings for waypoints');
    var table = document.getElementById("waypoint_list");
    var items = table.rows;

    // start at row 1 instead of 0 to skip table header
    for (var i = 1; i < items.length; ++i) {
        // do something with items[i], which is a <li> element

        var name = items[i].cells[0].innerHTML;
        var dst_lat = items[i].cells[1].innerHTML;
        var dst_lon = items[i].cells[2].innerHTML;

        console.log("calc bearing for c_lat" + positionCurrent.lat + "  c_lon " + positionCurrent.lng + "  d_lat " + dst_lat + "  d_lon " + dst_lon);
        
        //var bearing = geo.bearing(positionCurrent.lat ,positionCurrent.lng ,dst_lat,dst_lon);
        //var distance = geo.distance(positionCurrent.lat ,positionCurrent.lng ,dst_lat,dst_lon,'M');
        var B_D = geo.bearing_distance(positionCurrent.lat ,positionCurrent.lng ,dst_lat,dst_lon,'M');
        var bearing = B_D[0];
        var distance = B_D[1];

        // round to 2 decimals, JS only round integers, so need to multiply and divide to get decimals
        var decimals = 100;
        bearing = Math.round(bearing);
        distance = Math.round(distance * decimals) / decimals;

        items[i].cells[6].innerHTML = bearing;
        items[i].cells[7].innerHTML = distance;
        items[i].cells[6].setAttribute("onclick", "setCompassBearing(" + bearing + ")");

        console.log('updating bearing for ' + name);

    }
}

function setCompassBearing(bearing) {
    // apply rotation to compass bearing
    bearing = 360 - bearing;
    if (typeof rose.style.transform !== "undefined") {
        rose.style.transform = "rotateZ(" + bearing + "deg)";
        declination.style.transform = "rotateZ(" + bearing + "deg)";
    } else if (typeof rose.style.webkitTransform !== "undefined") {
        declination.style.webkitTransform = "rotateZ(" + bearing + "deg)";
        rose.style.webkitTransform = "rotateZ(" + bearing + "deg)";
    }
    
}


// Changes XML to JSON
// need to supply xml object as a parameter, not text
function xmlToJson(xml) {	
    console.log("attempting to parse xml to json: xml")

    // Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

    // do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
    }
    console.log("JSON: " + JSON.stringify(obj));
	return obj;
};

// BUG:  this data will lag, it will probably be getting the last itteration gps details
//       its good enough for now
window.addEventListener("deviceorientationabsolute", update_wpt_bearings);
