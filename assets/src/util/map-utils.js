import Proj4 from 'proj4';

export function latlngToUTM(lat, long) {
    var utm = "+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs";
    var wgs84 = "+proj=longlat +zone=32 +ellps=GRS80 +units=m +no_defs ";

    return Proj4(wgs84, utm, [lat, long]);
}

export function getFeatures(resources) {
    return [
        {
            'coordinates': {
                'easting': 575427.19,
                'northing': 6223823.10
            },
            'name': 'DOKK1',
            'address': 'Hack Kampmans Plads 2',
            'city': '8000 Aarhus C',
        },
        {
            'coordinates': {
                'easting': 574032,
                'northing': 6224463
            },
            'name': 'Midtbyen',
            'address': 'Hack Kampmans Plads 2',
            'city': '8000 Aarhus C',
        }
    ]
}