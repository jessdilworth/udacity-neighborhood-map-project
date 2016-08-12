var map;

		//Create a  new blank array for all the listing markers.
		var markers = [];

		function initMap() {
			//Constructor creates a new map - only center and zoom are required.
			map = new google.maps.Map(document.getElementById('map'), {
				center: {lat: 51.4216897, lng: -0.0915919},
				zoom: 13
			});

			//These are the real estate listings that will be shown to the user.
			//Normally we'd have these in a database instead.
			var locations = [
				{title: 'Westow House Pub', location: {lat: 51.4200164, lng: -0.0809779}},
				{title: 'Crystal Palace Antique and Modern', location: {lat:51.4200389, lng: -0.0816344}},
				{title: 'Four Hundred Rabbits', location: {lat: 51.4189756, lng: -0.0850944}},
				{title: 'The Secret Garden', location: {lat: 51.4172203, lng: -0.0847438}},
				{title: 'Crystal Palace Station', location: {lat: 51.4181133, lng: -0.0747687}}
			];

			var largeInfowindow = new google.maps.InfoWindow();

			var bounds = new google.maps.LatLngBounds();

			//then, we'll loop through the locations we've created in order to create one marker per loop.

			for (var i=0; i < locations.length; i++){
					//Get the position from the location array.
					var position = locations[i].location;
					var title = locations[i].title;
					//Create a marker per location, and put into markers array. 
					var marker = new google.maps.Marker({
						map: map,
						position: position,
						title: title,
						animation: google.maps.Animation.DROP,
						id: i
					});
				}
			//Push the marker to our array of markers. 
			markers.push(marker);

			//Extend the boundaries of the map for each marker
			bounds.extend(marker.position);

			//Create an onclick event to open an infowindow at each marker.
			marker.addListener('click', function() {
				populateInfoWindow(this, largeInfowindow);
			});

			// map.fitBounds(bounds);

			//This function populates the infowindow when the marker is clicked. We'll only allow
			//one infowindow which will open at the marker that is clicked, and populate based
			//on that markers position.

			function populateInfoWindow(marker, infowindow) {
				//Check to make sure the infowindow is not already opened on this marker.
				if (infowindow.marker != marker) {
					infowindow.marker = marker;
					infowindow.setContent('<div>' + marker.title + '</div>');
					infowindow.open(map, marker);
					//Make sure the marker property is cleared if the infowindow is closed
					infowindow.addListener('closeclick', function(){
						infowindow.setMarker(null);
					})
				}
			}
		}