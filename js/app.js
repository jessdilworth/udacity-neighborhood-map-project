
//MODEL

var localSpots = {
		pointsOfInterest: [
			{title: 'Dulwich Picture Gallery', lat: 51.4459785, lng: -0.0863698},
			{title: 'Horniman Museum and Gardens', lat:51.4410383, lng: -0.063203},
			{title: 'Brockwell Park Lido', lat: 51.45305, lng: -0.1086446},
			{title: 'Crystal Palace Dinosaurs', lat: 51.4165373, lng: -0.0697965},
			{title: 'Crystal Palace Station', lat: 51.4181133, lng: -0.0747687}
		]

	};

//VIEWMODEL


var viewModel = function() {

	var self = this;

	self.locations = ko.observableArray(localSpots.pointsOfInterest);

	var infowindow = new google.maps.InfoWindow({

    	content: 'test content'

	});

	self.markerArray=ko.observableArray();

	//This function opens the infowindow and initiates the animation 
	this.toggleBounce = function(marker) {
		var self = this;
		if (marker.getAnimation() !== null) {

	    	marker.setAnimation(null);

	  	} else {

	    	marker.setAnimation(google.maps.Animation.BOUNCE);

	    	setTimeout(function(){ marker.setAnimation(null); }, 750);

	  	}

	};

	this.addMarkerListener = function(marker) {
		var self = this;

		var f = google.maps.event.addListener(marker, 'click', function() {

				infowindow.setContent(this.title);

				infowindow.open(map, this);

			self.toggleBounce(marker);

			return f;
		});
	};

	for (var i=0; i < self.locations().length; i++) {

		var position = new google.maps.LatLng(self.locations()[i].lat, self.locations()[i].lng);
		
		//this will create a marker for each point of interest
		var marker = new google.maps.Marker({
			map: map,
			position: position,
			title: self.locations()[i].title,
			animation: google.maps.Animation.DROP
		});

		self.markerArray.push(marker);

		self.addMarkerListener(marker);
		
	}


	//LIST FILTERING

	//This will track the user input to the search box
	this.currentSearch = ko.observable('');

	//Changes the location list based on the search input
	this.filteredLocations = ko.computed(function(){

		var query = self.currentSearch().toLowerCase();

		return ko.utils.arrayFilter(self.locations(), function(locationItem) {

			var title = locationItem.title.toLowerCase();

			return title.indexOf(query) !== -1;

		});

	});

	self.listAnimationTimeout = function(i) {

		setTimeout (function(){

			self.markerArray()[i].setAnimation(null);

		}, 1400);

	};

	//This function triggers the marker animation when a list item is clicked
	self.addListListener = function (marker){

		for (var i=0; i < self.markerArray().length; i++) {

			if (self.markerArray()[i].title == this.title) {

	   			self.markerArray()[i].setAnimation(google.maps.Animation.BOUNCE);
	   			
	   			self.listAnimationTimeout(i);
			}

		}

	};


	//MARKER FILTERING
	//With help thanks to https://github.com/Zayah117/neighborhood-map-project

	 this.locationList = ko.computed(function() {

	 	for (var i=0; i < self.locations().length; i++) {
			
			// If the location name includes text from the input add it to the list
			if (self.markerArray()[i].title.toLowerCase().includes(self.currentSearch().toLowerCase())) {

				self.markerArray()[i].setMap(map);

			} else {

				self.markerArray()[i].setMap(null);
			}
		}
	}, this);     


	//WIKIPEDIA ARTICLE SEARCH


	var myArticles=[];

	//This iterates through the titles of the markers in order to fetch related wikipedia articles and store them in myArticles
	this.articleReturn= function(){

		for (var i=0; i < self.markerArray().length; i++) {

			$.ajax ({
				url: 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + self.markerArray()[i].title + '&format=json&callback=wikiCallback',
				dataType: "jsonp",
				//jsonp: "callback",
				success: function(response) {
                	
                	myArticles.push(response[3]);
					
            	}
				
			});

		}
	
	};

	//This function matches the search query with the array of article URLs stored in myArticles
	this.ajaxRequestSuccess = ko.computed(function() {

		var locationArticle=[];

		self.articleReturn();

		function searchWikipedia () {

			var wikiSearchStrg = self.currentSearch().replace(/ /g,"_");
			
			if (myArticles) {

				if(wikiSearchStrg.length > 2)

					for (var i=0; i < myArticles.length; i++) {

						for (var j=0; j < myArticles[i].length; j++) {

							if (myArticles[i][j].toLowerCase().includes(wikiSearchStrg.toLowerCase())) {
								
								if (!locationArticle.includes(myArticles[i][j])) {

										locationArticle.push(myArticles[i][j]);
								} 
							} 
						}
					}
			} 
			if (locationArticle.length === 0 && self.currentSearch().length > 3) {
				locationArticle.push("Sorry, it looks like there are no articles related to your search.");
			}
			console.log(locationArticle);
		}

		searchWikipedia();

		return locationArticle;

	});

				
};



//VIEW

// Generates the map of Crystal Palace.
function createMap() {

	var myCPMapSpecs = {
		zoom: 12,
		center: new google.maps.LatLng(51.4459785, -0.0863698),
	};
	
	map = new google.maps.Map(document.getElementById('map'), myCPMapSpecs);

	ko.applyBindings(new viewModel());

}

//In case google maps cannot be loaded
function googleError() {
    if (typeof google === "undefined") {

        $('#map').html('<h1>' + "Oops! Something went wrong. Wait a little bit, then try refreshing." + '</h1>');
        
    }
}

