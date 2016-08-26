
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

	self.markerArray=ko.observableArray();

	for (var i=0; i < self.locations().length; i++) {

			var position = new google.maps.LatLng(self.locations()[i].lat, self.locations()[i].lng);
			
			var marker = new google.maps.Marker({
				map: map,
				position: position,
				title: self.locations()[i].title,
				animation: google.maps.Animation.DROP
			});


		// self.locations()[i].marker = marker;

		// self.markerArray.push(marker);
		console.log(marker);
		self.markerArray.push(marker);

		addMarkerListener(marker);
		



		//setting up infowindows to open on clic

		// function infoWindowOpen () {
		// infowindow.setContent(this.title);
		// infowindow.open(map, this);
		// };

		//Function to animate markers when clicked
	}


	// function addMarkerListener (marker){
	// 	google.maps.event.addListener(marker, 'click', fucntion(){
	// 	infowindow.setContent(this.title);
	// 	infowindow.open(map, this);
	// 	console.log("Clicked");

	// 	toggleBounce(marker);
	// 	})
	// };
	function addMarkerListener (marker) {

		var f = google.maps.event.addListener(marker, 'click', function() {
			infowindow.setContent(this.title);
			infowindow.open(map, this);
			console.log("Clicked");

			toggleBounce(marker);
			return f;
		});
	}

	//google.maps.event.

	function toggleBounce(marker) {
		if (marker.getAnimation() !== null) {
	    marker.setAnimation(null);
	  } else {
	    marker.setAnimation(google.maps.Animation.BOUNCE);
	  }

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
//With help thanks to https://github.com/Zayah117/neighborhood-map-project



	 this.locationList = ko.computed(function() {
	 	var i = 0;
		self.locations().forEach(function(locationItem){
			


			// If the location name includes text from the input add it to the list
			if (self.markerArray()[i].title.toLowerCase().includes(self.currentSearch().toLowerCase())) {
				self.markerArray()[i].setMap(map);
				i++;
			} else {
				self.markerArray()[i].setMap(null);
				i++;
			}
		});
	}, this);     


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

