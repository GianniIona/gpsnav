//https://stackoverflow.com/questions/11415106/issue-with-calcuating-compass-bearing-between-two-gps-coordinates

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
        var dLon = (lng2-lng1);
        var y = Math.sin(dLon) * Math.cos(lat2);
        var x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
        var brng = this._toDeg(Math.atan2(y, x));
        return 360 - ((brng + 360) % 360);
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
