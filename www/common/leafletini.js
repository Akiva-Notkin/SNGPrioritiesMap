function Leaflet(options, callback) {	
	L.mapbox.accessToken = 'pk.eyJ1IjoiYWtpdmFub3RraW4iLCJhIjoiY2lrNGNobGFpMDAycHZka3QwandrN3p1aCJ9.5Rz07-xE5zhM2CmyZxz7vA';
	// Replace 'mapbox.streets' with your map id.
	var mapboxTiles = L.tileLayer('https://api.mapbox.com/v4/mapbox.outdoors/{z}/{x}/{y}.png?access_token=' + L.mapbox.accessToken, {
	    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
	});

	this.createcolorcalls();

	this.globaljsonarray = [];

	this.map = L.map('map')
	    .addLayer(mapboxTiles)
	    .setView([47.60801, -122.33516], 12);


	this.callback = callback ? callback : function () {
	};


	this.callback();

}

Leaflet.prototype.createcolorcalls = function() {
		this.geojsonMarkerOptions = {
		    radius: 4,
		    weight: 1,
		    opacity: 1,
		    fillOpacity: 0.8
		};


		this.orange = {
		    "color": "#ff7800",
		    "weight": 105,
		    "opacity": 0.2
		};

		this.blue = {
			"color": "#0000ff",
		    "weight": 5,
		    "opacity": 0.65
		};

		this.green = {
			"color": "#008000",
		    "weight": 15,
		    "opacity": 0.65
		};
}


Leaflet.prototype.drawobjectsgoogle = function(jsonobject) {

	for(var i = 0; i < jsonobject.length; i++) {
		
		function onEachFeature(feature, layer) {
			feature = feature.properties;
			var popup = "<b>";
			popup += feature.name;
			popup += "</b><hr>";
			popup += "<br>";
			popup += feature.name + " is " + feature.facilitytype + " " + feature.status ;
			if(feature.yearcompleted != '') {
				popup += " in " + feature.yearcompleted;
			}
			popup += ". ";
			popup += "It is in Council District " + feature.councildistrict + " ";
			if(feature.neighborhood != '') {
				" in the " + feature.neighborhood + " neighborhood";
			}
			if(feature.cost != '') {
			 	popup += "and cost " + feature.cost + " to build";   	
			}
			popup += ".<br><br>";
	       	popup += feature.extratext + "<br><br>";
	       	if(feature.sdotlink != '' || feature.sngbloglink != '' || feature.sngpage != '' || feature.otherlink != '') {	
	       		popup += "<hr>";
	       		popup += "<b>More information</b><br>";
	       		if(feature.sngbloglink != '') {
	       			popup += "<a href='" + feature.sngbloglink + "'>Seattle Neighborhood Greenways blog on " + feature.name + "</a><br>";
	       		}
	       		if(feature.sdotlink != '') {
	       			popup += "<a href='" + feature.sdotlink + "'>Seattle Department of Transporation link to " + feature.name + "</a><br>";
	       		}
	       		if(feature.otherlink != '') {
	       			popup += "<a href='" + feature.otherlink + "'>" + feature.otherlinktext + "</a><br>";
	       		}
	       		if(feature.sngpage != '') {
	       			popup += "<a href='" + feature.sngpage + "'>Get Involved!</a><br>";
	       		}

	       	}
	       	layer.bindPopup(popup);
		}

		this.globaljsonarray[i] = L.geoJson(jsonobject, {
	    	onEachFeature: onEachFeature,
	    	pointToLayer: function (feature, latlng) {
        		return L.circleMarker(latlng, this.geojsonMarkerOptions);
    		},
    		style: leaflet.orange
    	});

    	this.globaljsonarray[i].addTo(this.map);
	}


	//this.createlayers();
}

Leaflet.prototype.createjsonfromgoogle = function(jsonobject) {

		$.ajax({url: "https://spreadsheets.google.com/feeds/list/1plDqOhxv8kNXxgLVuWCenEqXrNPmDdmd23s15n366ak/od6/public/values?alt=json", success: function(result){
			var jsonset = [];
        	var titles = ["name", "facilitytype", "status", "yearcompleted", "priorityofsng", "neighborhood", "councildistrict", "cost", "extratext", "sdotlink", "sngbloglink", "otherlink", "otherlinktext", "campaignpage", "grouppagetogetinvolved","sngpage"];
        	result = result.feed.entry;
        	var i = 0;
        	while(result[i] != null) {
        		if(result[i].gsx$pointzoneline.$t == "Point") {
        			var pointzoneline = "Point";
        			var latlong = result[i].gsx$latlong.$t;
        			var commalocation = latlong.indexOf(",");
        			var lat = parseFloat(latlong.substring(0,commalocation));
        			var longi = parseFloat(latlong.substring(commalocation + 1));
        			var latlongarray = [lat, longi];
        		}
        		else if(result[i].gsx$pointzoneline.$t == "Line") {
        			var pointzoneline = "LineString";
        			var latlong = parseFloat(result[i].gsx$latlong.$t);
        		}

        		//console.log(latlongarray);
        		var jsonoutput = 

        		{
        				"type": "Feature",
        				"properties": {
        					"name": result[i].gsx$name.$t,
        					"facilitytype": result[i].gsx$facilitytype.$t,
        					"status": result[i].gsx$status.$t,
        					"yearcompleted": result[i].gsx$yearcompleted.$t,
        					"priorityofsng": result[i].gsx$priorityofsng.$t,
        					"neighborhood": result[i].gsx$neighborhood.$t,
        					"councildistrict": result[i].gsx$councildistrict.$t,
        					"cost": result[i].gsx$cost.$t,
        					"extratext": result[i].gsx$extratext.$t,
        					"sdotlink": result[i].gsx$sdotlink.$t,
        					"otherlink": result[i].gsx$otherlink.$t,
        					"otherlinktext": result[i].gsx$otherlinktext.$t,
        					"campaignpage": result[i].gsx$campaignpage.$t,
        					"grouppagetogetinvolved": result[i].gsx$grouppagetogetinvolved.$t,
        					"sngpage": result[i].gsx$sngpage.$t,
        					"sdotlink": result[i].gsx$sdotlink.$t
        				},
        				"geometry": {
        					"type": pointzoneline,
        					"coordinates": latlongarray
        				}
        		};

        		//console.log(jsonoutput);

        		jsonset.push(jsonoutput);
        		i++;
        	}

        	leaflet.drawobjectsgoogle(jsonset);
    	}});
}

Leaflet.prototype.createlayers = function() {
	// var influenced = [];
	// var prioritized = [];

	// for(var i = 0; i < this.globaljsonarray.length; i++) {
	// 	if(this.globaljsonarray[i][1] == "a prioritized project of") {
	// 		prioritized.push(this.globaljsonarray[i][0]);
	// 		console.log(i);
	// 	}
	// 	else if(this.globaljsonarray[i][1] == "influenced by") {
	// 		influenced.push(this.globaljsonarray[i][0]);
	// 		console.log(-i);
	// 	}
	// }


	// var influencedgroup = L.layerGroup(influenced).addTo(this.map);

	// var prioritizedgroup = L.layerGroup(prioritized).addTo(this.map);

	// var overlayMaps = {
 //    	"Prioritized": prioritizedgroup,
 //    	"Influenced": influencedgroup
	// };
	console.log(this.globaljsonarray);
	L.control.layers(null, this.globaljsonarray).addTo(this.map);
}
/*
Leaflet.prototype.addEventListners = function() {
	var latlngs = [];
	this.map.on('click', function(e) {
	    latlngs.push(e.latlng);
		leaflet.polyline = L.polyline(latlngs, {color: 'red'}).addTo(leaflet.map);
	});
	
	this.map.on('dblclick', function(e) {
		leaflet.endPolyline();
		leaflet.map.off('click');

	});
}

Leaflet.prototype.endPolyline = function() {
	var popup = "";
	popup += "<form name='myform' action='alert(\\'hello\\')'>Search: <input type='text' name='query' /><a href='javascript: submitform()''>Search</a></form><script type='text/javascript'>function submitform(){document.myform.submit();}</script>";
	this.polyline.bindPopup(popup);

	/*var name = window.prompt("Enter the name of the project", "");
	var facilitytype = window.prompt("Enter the facilitytype ie signal", "");
	var status = window.prompt("Enter the status. MUST be constructed, in campaign, in development", "");
	var yearcompleted = window.prompt("Enter the year the project was compleated. If not compleate leave blank", "");
	var priorityofsng = window.prompt("Enter the priority status of SNG.", "");
	var neighborhood = window.prompt("Enter the neighborhood of the project. If not in a neighborhood leave blank ", "");
	var councildistrict = window.prompt("Enter the Council District of the project", "");
	var cost = window.prompt("Enter the cost of the project. If unknown leave blank", "");
	var extratext = 

				"type": "Feature",
        				"properties": {
        					"name": result[i].gsx$name.$t,
        					"facilitytype": result[i].gsx$facilitytype.$t,
        					"status": result[i].gsx$status.$t,
        					"yearcompleted": result[i].gsx$yearcompleted.$t,
        					"priorityofsng": result[i].gsx$priorityofsng.$t,
        					"neighborhood": result[i].gsx$neighborhood.$t,
        					"councildistrict": result[i].gsx$councildistrict.$t,
        					"cost": result[i].gsx$cost.$t,
        					"extratext": result[i].gsx$extratext.$t,
        					"sdotlink": result[i].gsx$sdotlink.$t,
        					"otherlink": result[i].gsx$otherlink.$t,
        					"otherlinktext": result[i].gsx$otherlinktext.$t,
        					"campaignpage": result[i].gsx$campaignpage.$t,
        					"grouppagetogetinvolved": result[i].gsx$grouppagetogetinvolved.$t,
        					"sngpage": result[i].gsx$sngpage.$t,
        					"sdotlink": result[i].gsx$sdotlink.$t
        				},
        				"geometry": {
        					"type": pointzoneline,
        					"coordinates": latlong
        				}*/
//}