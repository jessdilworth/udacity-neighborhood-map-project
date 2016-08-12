
// 	this.pointsOfInterest = ko.observableArray([
// 		{title: 'Westow House Pub', location: {lat: 51.4200164, lng: -0.0809779}},
// 		{title: 'Crystal Palace Antique and Modern', location: {lat:51.4200389, lng: -0.0816344}},
// 		{title: 'Four Hundred Rabbits', location: {lat: 51.4189756, lng: -0.0850944}},
// 		{title: 'The Secret Garden', location: {lat: 51.4172203, lng: -0.0847438}},
// 		{title: 'Crystal Palace Station', location: {lat: 51.4181133, lng: -0.0747687}}
// 		]);

// }; 

//MODEL

var model = {
		pointsOfInterest: [
			{title: 'Westow House Pub', lat: 51.4200164, lng: -0.0809779},
			{title: 'Crystal Palace Antique and Modern', lat:51.4200389, lng: -0.0816344},
			{title: 'Four Hundred Rabbits', lat: 51.4189756, lng: -0.0850944},
			{title: 'The Secret Garden', lat: 51.4172203, lng: -0.0847438},
			{title: 'Crystal Palace Station', lat: 51.4181133, lng: -0.0747687}
		]

	};

//VIEWMODEL

var viewModel = {

	// Retrieves the locations object, containing all hard-coded markers
    getMarkers: function () {
    	var markers = ko.observableArray();
        markers.push(model.pointsOfInterest);
    },

    init: function() {
    	var self = this;

    	// Retrieve the objects stored in the model and store them in the locations variable.
        var locations = this.getMarkers();
    }
};


//VIEW

// Generates the map of Crystal Palace.
function createMap() {

	var myCPMapSpecs = {
		zoom: 13,
		center: new google.maps.LatLng(51.4200164, -0.0809779),
	};
	
	map = new google.maps.Map(document.getElementById('map'), myCPMapSpecs);
};


ko.bindingHandlers.marker= {
	init: function (element, valueAccessor, allBindingsAccessor, viewModel, google, locations) {

		//Running viewModel
		viewModel.getMarkers();
		viewModel.init();

		for (var i=0; i < viewModel.locations.length; i++) {
			var position = new google.maps.LatLng(51.4200164, -0.0809779);

			var position = new google.maps.LatLng(viewModel.locations.lat, viewModel.locations.lng);
			
			var marker = new google.maps.Marker({
				map: map,
				position: postion,
				title: title
			})

		};
	}
};

ko.applyBindings(viewModel);






	// var viewModel = new MyViewModel();c

			// 	this.markers = ko.observableArray([]);

			// 	for (var i=0; i < locations.length; i++){
			// 		//Get the position from the location array.
			// 		var position = locations[i].location;
			// 		var title = locations[i].title;
			// 		//Create a marker per location, and put into markers array. 
			// 		var marker = new google.maps.Marker({
			// 			map: map,
			// 			position: position,
			// 			title: title,
			// 			animation: google.maps.Animation.DROP,
			// 			id: i
			// 		});
			// 	}
			// //Push the marker to our array of markers. 
			// 	markers.push(marker);