const WIKIPEDIA_API_URL_EN = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&formatversion=2&prop=extracts&pageids=';
const WIKIPEDIA_API_URL_PT = 'https://pt.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&formatversion=2&prop=extracts&pageids=';
const WIKIPEDIA_PAGE_URL = 'https://en.wikipedia.org/wiki/';

var mapLocationsArray = [
    new MapLocation({id: 1, title: 'Turvo State Park', location: {lat: -27.1810977, lng: -53.9432112}, wikipediaSrc: WIKIPEDIA_API_URL_EN + '52249899'}),
    new MapLocation({id: 2, title: 'Guarita State Park', location: {lat: -29.3558406, lng: -49.7346058}, wikipediaSrc: WIKIPEDIA_API_URL_EN + '120314'}),
    new MapLocation({id: 3, title: 'Nova Petrópolis', location: {lat: -29.3757219, lng: -51.11431}, wikipediaSrc: WIKIPEDIA_API_URL_EN + '1058942'}),
    new MapLocation({id: 4, title: 'Aparados da Serra National Park', location: {lat: -29.1898946, lng: -50.248855}, wikipediaSrc: WIKIPEDIA_API_URL_EN + '4143512'}),
    new MapLocation({id: 5, title: 'Serra Geral National Park', location: {lat: -29.1361151, lng: -50.1992628}, wikipediaSrc: WIKIPEDIA_API_URL_EN + '16465615'}),

];

// Create a styles array to use with the map.
var styles = [
    {
        featureType: 'water',
        stylers: [
            { color: '#19a0d8' }
        ]
    },{
        featureType: 'administrative',
        elementType: 'labels.text.stroke',
        stylers: [
            { color: '#ffffff' },
            { weight: 6 }
        ]
    },{
        featureType: 'administrative',
        elementType: 'labels.text.fill',
        stylers: [
            { color: '#e85113' }
        ]
    },{
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [
            { color: '#efe9e4' },
            { lightness: -40 }
        ]
    },{
        featureType: 'transit.station',
        stylers: [
            { weight: 9 },
            { hue: '#e85113' }
        ]
    },{
        featureType: 'road.highway',
        elementType: 'labels.icon',
        stylers: [
            { visibility: 'off' }
        ]
    },{
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [
            { lightness: 100 }
        ]
    },{
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [
            { lightness: -100 }
        ]
    },{
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [
            { visibility: 'on' },
            { color: '#f0e4d3' }
        ]
    },{
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [
            { color: '#efe9e4' },
            { lightness: -25 }
        ]
    }
];
