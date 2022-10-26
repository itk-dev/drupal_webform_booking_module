import Proj4 from 'proj4';

export function latlngToUTM(lat, long) { //Convert latitude, longitude to UTM formatted easting, northing. Not correctly configured yet.
    var utm = "+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs";
    var wgs84 = "+proj=longlat +zone=32 +ellps=GRS80 +units=m +no_defs ";

    return Proj4(wgs84, utm, [lat, long]);
}

export function getFeatures(resources) { //Loop resources and build coordinates and tooltip content
    let featureObj = [];
    if (Object.values(resources)[0] !== null) {
        Object.values(resources).map((resource, index) => {
            Object.values(resource).map((value, index) => {
                console.log(value);
                featureObj.push({
                    'id' : value.id,
                    'coordinates': {
                        'easting': 575427.+Math.floor(Math.random() * 30) + 50,
                        'northing': 6223823.+Math.floor(Math.random() * 30) + 50
                        // 'easting': 575427.19,
                        // 'northing': 6223823.10
                    },
                    'name': value.resourceName,
                });
            })
        })
    }
    return featureObj;
}