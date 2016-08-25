
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

var $wikiElem = $('#wikipedia-articles');
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

	}


//LIST FILTERING

	//This will track the user input to the search box
	this.currentSearch = ko.observable('');

	//Changes the location list based on the search input
	this.filteredLocations = ko.computed(function(){

		//explain
		var query = self.currentSearch().toLowerCase();

		console.log(self.currentSearch());

		return ko.utils.arrayFilter(self.locations(), function(locationItem) {
			var title = locationItem.title.toLowerCase();
			return title.indexOf(query) !== -1;
		});

	});


//MARKER FILTERING
//With help thanks to https://github.com/Zayah117/neighborhood-map-project/blob/master/index.html

    self.visiblePlaces = ko.observableArray();

    // This pushes all the objects from the locations observable array into
    //a new array which we will use for filtering
    
    self.moveLocations = function(){
	    for (var i=0; i < self.locations().length; i++) {
	    	self.visiblePlaces.push(locations()[i]);
	    	console.log(locations()[i].title);
		};
	};

	//The following clears all the current markers and then populates them 
	//into visiblePlaces based on whether it matches the location title
    self.filterMarkers = function() {
    	var searchQuery = self.currentSearch().toLowerCase();

    	self.visiblePlaces.removeAll();


    	for (var i=0; i < self.locations().length; i++) {
    		self.locations()[i].marker.setVisible(false);
    		console.log(self.locations()[i]);
    	}	

    	if (self.locations()[i].title.toLowerCase().indexOf(searchQuery) !== -1) {
    		self.visiblePlaces.push(locations()[i]);
    		console.log(locations()[i]);
    	}


	    for (var i=0; i < self.visiblePlaces().length; i++) {
	    	self.locations()[i].marker.serVisible(true);
	    }
    	
    };



//WIKIPEDIA ARTICLE SEARCH

		// Wikipedia AJAX request
		self.myArticles=ko.observableArray();

		self.articleResults = ko.computed(function(){

			var searchString = self.currentSearch().toLowerCase();
			var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + searchString + '&format=json&callback=wikiCallback'

			$.ajax ({
				url: wikiUrl,
				dataType: "jsonp",
				//jsonp: "callback",
				success: function(response){
					var articleList = response[3];

					if (articleList) {
						self.myArticles(articleList);

						//might not need this as we are getting the URLs from the wikipedia response
						for (var i=0; i < self.myArticles().length; i++) {

						};
					} else {
						var errorString = 'No articles could be found right now. Sorry about that!';
					}
				}
			})
		})


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

function googleError() {
    if (typeof google === "undefined") {
        $('#map').html('<h1>' + "Oops! Something went wrong. Wait a little bit, then try refreshing." + '</h1>');
    }
};

