// Model
var MapLocation = function(data) {
    this.id = data.id;
    this.title = data.title;
    this.location = data.location;
    // TODO
    this.wikipediaSrc = data.wikipediaSrc;
    this.foursquareSrc = data.foursquareSrc;
}

const WIKIPEDIA_API_URL = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&formatversion=2&prop=extracts&pageids='

var mapLocationsArray = [
    new MapLocation({id: 1, title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}}),
    new MapLocation({id: 2, title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}}),
    new MapLocation({id: 3, title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}}),
    new MapLocation({id: 4, title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}}),
    new MapLocation({id: 5, title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}}),
    new MapLocation({id: 6, title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}),
    new MapLocation({
        id: 7,
        title: 'Empire state building',
        location: {lat: 40.7484405, lng: -73.9856644},
        // TODO put the hole url in a constant
        wikipediaSrc: WIKIPEDIA_API_URL + '9736'}),
];

// Knockout ViewModel
function createViewModel(markers, error = false, errorMessage = 'Error loading app.') {

    var self = this;

    self.error = ko.observable(error);

    self.errorMessage = ko.observable(errorMessage);

    self.mapLocations = ko.observableArray(markers);

    self.locationQuery = ko.observable();

    self.searchResults = ko.computed(function () {
        var lowerCaseLocationQuery = self.locationQuery();
        if(!lowerCaseLocationQuery){
            if (!error) {
                self.mapLocations().forEach(function (marker) {
                    marker.setMap(map);
                });
            }
            return self.mapLocations();
        } else {
            var filteredMapLocations = self.mapLocations();
            if (!error) {
                filteredMapLocations.forEach(function (marker) {
                    marker.setMap(null);
                });
            }

            filteredMapLocations = filteredMapLocations.filter(function (mapLocation) {
                var title = mapLocation.title;
                return title.toLowerCase().indexOf(lowerCaseLocationQuery.toLowerCase()) > -1;
            });

            if (!error) {
                filteredMapLocations.forEach(function (marker) {
                    marker.setMap(map);
                });
            }
            return filteredMapLocations;
        }
    }, self);

    self.showMarkerInMap = function (data) {
        new google.maps.event.trigger(data, 'click');
    };

}

// Google maps

var map;

function initMap() {
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

    // Create a new blank array for all the listing markers.
    var markers = [];

    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.7413549, lng: -73.9980244},
        zoom: 13,
        styles: styles,
        mapTypeControl: false
    });

    // These are the real estate listings that will be shown to the user.
    // Normally we'd have these in a database instead.
    var locations = mapLocationsArray;

    var largeInfowindow = new google.maps.InfoWindow();

    // Style the markers a bit. This will be our listing marker icon.
    var defaultIcon = makeMarkerIcon('0091ff');

    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('FFFF24');

    // map bounds
    var bounds = new google.maps.LatLngBounds();
    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
        // Get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
        var id = locations[i].id;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: i,
            map: map,
        });
        // extend map bounds to cover all the markers
        bounds.extend(marker.position);

        // Push the marker to our array of markers.
        markers.push(marker);
        // Create an onclick event to open the large infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
        });
        // Two event listeners - one for mouseover, one for mouseout,
        // to change the colors back and forth.
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });
    }

    map.fitBounds(bounds);

    var viewModel = createViewModel(markers)

    ko.applyBindings(viewModel);

}

function errorOnMap() {
    console.log('error loading google maps');

    var viewModel = createViewModel(mapLocationsArray, true)
    ko.applyBindings(viewModel);

}

function appendContentToInfoWindow(infowindow, contentAsHtml) {
    var currentContent = infowindow.getContent();
    infowindow.setContent(currentContent.concat(contentAsHtml));
}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {

    bounceMarker(marker, 1000);

    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        // Clear the infowindow content to give the streetview time to load.
        infowindow.setContent('');
        infowindow.marker = marker;
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });

        checkWikipediaContent(infowindow, marker);

        // Open the infowindow on the correct marker.
        infowindow.open(map, marker);
    }
}

// TODO refactor into promise to chain events outside of function responsibility
function checkWikipediaContent(infowindow, marker) {
    // gets the location from the array by its index, stored in the marker id
    var mapLocation = mapLocationsArray[marker.id];

    if (mapLocation && mapLocation.wikipediaSrc) {
        $.ajax({
            url: mapLocation.wikipediaSrc,
            dataType: 'jsonp',
        }).done(function(data){
            console.log(data.query.pages[0]);
            appendContentToInfoWindow(infowindow, '<h4>' + marker.title + '</h4>' + data.query.pages[0].extract.substring(0, 600))
        }).fail(function (error) {
            console.log(error);
            appendContentToInfoWindow(infowindow, '<h4>' + marker.title + '</h4><p>Could not load data</p>')
        }).always(function () {
            checkStreetViewPhoto(infowindow, marker);
        });
    } else {
        appendContentToInfoWindow(infowindow, '<h4>' + marker.title + '</h4><p>No wikipedia content for this place.</p>')
    }
}


// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21,34));
    return markerImage;
}

function bounceMarker(marker, timeout) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () {
            marker.setAnimation(null);
        }, timeout);
    }
}

// Google maps
