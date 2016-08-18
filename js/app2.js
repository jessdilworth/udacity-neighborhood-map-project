
// 	this.pointsOfInterest = ko.observableArray([
// 		{title: 'Westow House Pub', location: {lat: 51.4200164, lng: -0.0809779}},
// 		{title: 'Crystal Palace Antique and Modern', location: {lat:51.4200389, lng: -0.0816344}},
// 		{title: 'Four Hundred Rabbits', location: {lat: 51.4189756, lng: -0.0850944}},
// 		{title: 'The Secret Garden', location: {lat: 51.4172203, lng: -0.0847438}},
// 		{title: 'Crystal Palace Station', location: {lat: 51.4181133, lng: -0.0747687}}
// 		]);

// }; 

//MODEL

var localSpots = {
		pointsOfInterest: [
			{title: 'Westow House Pub', lat: 51.4200164, lng: -0.0809779},
			{title: 'Crystal Palace Antique and Modern', lat:51.4200389, lng: -0.0816344},
			{title: 'Four Hundred Rabbits', lat: 51.4189756, lng: -0.0850944},
			{title: 'The Secret Garden', lat: 51.4172203, lng: -0.0847438},
			{title: 'Crystal Palace Station', lat: 51.4181133, lng: -0.0747687}
		]

	};

//VIEWMODEL

var viewModel = function() {

	var self = this;

	//separating out the model video lesson: Cat constructor function
	self.locations = ko.observableArray(localSpots.pointsOfInterest);


	var infowindow = new google.maps.InfoWindow({
    	content: 'test content'
	});


	for (var i=0; i < self.locations().length; i++) {

			var position = new google.maps.LatLng(self.locations()[i].lat, self.locations()[i].lng);
			
			var marker = new google.maps.Marker({
				map: map,
				position: position,
				title: self.locations()[i].title
			});

		self.locations()[i].marker = marker;

		google.maps.event.addListener(marker, 'click', function () {
		// where I have added .html to the marker object.
		infowindow.setContent(this.title);
		infowindow.open(map, this);
		});
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

	ko.applyBindings(new viewModel());
};
