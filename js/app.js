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

		// This will store the search results in an observable array 
		self.items = ko.observableArray();

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



		// Wikipedia AJAX request
		self.myArticles=ko.observableArray();

		self.articleLinks=ko.observableArray();

		self.articleResults = ko.computed(function(){

			var searchString = self.currentSearch().toLowerCase();
			var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + searchString + '&format=json&callback=wikiCallback'

			$.ajax ({
				url: wikiUrl,
				dataType: "jsonp",
				//jsonp: "callback",
				success: function(response){
					var articleList = response[1];
					console.log(articleList);

					if (articleList) {
						self.myArticles(articleList);
						for (var i=0; i < self.myArticles().length; i++) {
							articleStr = self.myArticles()[i];
							var url = '<a href=' + 'http://en.wikipedia.org/wiki/'+ articleStr + '>' + articleStr + '</a>';
							console.log(url);
							self.articleLinks(url);
							return self.articleLinks();
						};
					} else {
						var errorString = 'no article list';
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
