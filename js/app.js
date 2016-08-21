//Search functionality thanks to https://github.com/Zayah117/neighborhood-map-project/blob/master/index.html

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

//Data for locations
var Location = function(data) {
	this.title = ko.observable(data.title);
	this.lat = ko.observable(data.lat);
	this.lng = ko.observable(data.lng);
};

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


		//setting up infowindows to open on click
		google.maps.event.addListener(marker, 'click', function () {
		infowindow.setContent(this.title);
		infowindow.open(map, this);
		});

		// This will store the search results in an observable array via this.filteredItems
		self.items = ko.observableArray();

		//This will track the user input to the search box
		this.currentSearch = ko.observable('');

		//Changes the location list based on the search input
		this.locationList = ko.computed(function(locations){
			var myList = []
				self.locations().forEach(function(locationItem){
				//If the location name includes text from the input, add it to the list
				if (self.locations()[i].title.toLowerCase().includes(self.currentSearch().toLowerCase())) {
					myList.push(new Location(locationItem));
				}
			});

			return myList;

		}, this);


		//Wiki AJAX request
		var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + this.currentSearch + '&format=json&callback=wikiCallback';

		$.ajax ({
			url: wikiUrl,
			dataType: "jsonp",
			//jsonp: "callback",
			success: function(response) {
				var articleList = response[1];

				for (var i=0; i < articleList.length; i++) {
					articleStr = articleList[i];
					var url = 'http://en.wikipedia.org/wiki/' + articleStr;
				};
			}
		})
	}
};


//VIEW

// Generates the map of Crystal Palace.
function createMap() {

	var myCPMapSpecs = {
		zoom: 15,
		center: new google.maps.LatLng(51.4200164, -0.0809779),
	};
	
	map = new google.maps.Map(document.getElementById('map'), myCPMapSpecs);

	ko.applyBindings(new viewModel());

};
