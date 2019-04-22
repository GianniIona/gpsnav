//https://stackoverflow.com/questions/11415106/issue-with-calcuating-compass-bearing-between-two-gps-coordinates

// heading is the diection you are pointing
// bearing is the direction you need to travel to reach you destination

var geo = {
    /**
    * Calculate the bearing between two positions as a value from 0-360
    *
    * @param lat1 - The latitude of the first position
    * @param lng1 - The longitude of the first position
    * @param lat2 - The latitude of the second position
    * @param lng2 - The longitude of the second position
    *
    * @return int - The bearing between 0 and 360
    */
    bearing : function (lat1,lng1,lat2,lng2) {
        // convert to rad
        var radlat1 = this._toRad(lat1);
        var radlng1 = this._toRad(lng1);
        var radlat2 = this._toRad(lat2);
        var radlng2 = this._toRad(lng2);
        var dLon = (radlng2 - radlng1);
        var y = Math.sin(dLon) * Math.cos(radlat2);
        var x = Math.cos(radlat1)*Math.sin(radlat2) - Math.sin(radlat1)*Math.cos(radlat2)*Math.cos(dLon);
        var brng = this._toDeg(Math.atan2(y, x));
        return ((brng + 360) % 360);
    },

    bearing_distance : function(lat1,lng1,lat2,lng2,unit) {
        // convert to rad
        var dist;
        var brng;
        if ((lat1 == lat2) && (lng1 == lng2)) {
            dist = 0;
            brng = 0;
        } else {

            var radlat1 = this._toRad(lat1);
            var radlng1 = this._toRad(lng1);
            var radlat2 = this._toRad(lat2);
            var radlng2 = this._toRad(lng2);
            var dLon = (radlng2 - radlng1);
            var y = Math.sin(dLon) * Math.cos(radlat2);
            var x = Math.cos(radlat1)*Math.sin(radlat2) - Math.sin(radlat1)*Math.cos(radlat2)*Math.cos(dLon);
            //console.log("Bearing_distance val of X: " + x);
            brng = this._toDeg(Math.atan2(y, x));
            brng = ((brng + 360) % 360);

            dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(dLon);
            //console.log("Bearing_distance val of dist: " + dist);
	    	if (dist > 1) {
	    		dist = 1;
	    	}
	    	dist = Math.acos(dist);
	    	dist = this._toDeg(dist);
	    	dist = dist * 60 * 1.1515;
	    	if (unit=="K") { dist = dist * 1.609344 }
	    	if (unit=="N") { dist = dist * 0.8684 }
        }
        return [brng,dist];

    },

    distance : function (lat1,lng1,lat2,lng2,unit) {
        if ((lat1 == lat2) && (lng1 == lng2)) {
	    	return 0;
	    }
	    else {
	    	var radlat1 = Math.PI * lat1/180;
	    	var radlat2 = Math.PI * lat2/180;
	    	var theta = lng1-lng2;
	    	var radtheta = Math.PI * theta/180;
	    	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	    	if (dist > 1) {
	    		dist = 1;
	    	}
	    	dist = Math.acos(dist);
	    	dist = dist * 180/Math.PI;
	    	dist = dist * 60 * 1.1515;
	    	if (unit=="K") { dist = dist * 1.609344 }
	    	if (unit=="N") { dist = dist * 0.8684 }
	    	return dist;
        }
    },

    /**
    * Since not all browsers implement this we have our own utility that will
    * convert from degrees into radians
    *
    * @param deg - The degrees to be converted into radians
    * @return radians
    */
    _toRad : function(deg) {
        return deg * Math.PI / 180;
    },

    /**
    * Since not all browsers implement this we have our own utility that will
    * convert from radians into degrees
    *
    * @param rad - The radians to be converted into degrees
    * @return degrees
    */
    _toDeg : function(rad) {
        return rad * 180 / Math.PI;
    },
};
