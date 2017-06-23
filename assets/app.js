// The user is allowed to input text for Origin Form

	// Street Address
	// City
	// State
	// Zip Code

// The user is allowed to input text for Destination Form

	// Street Address
	// City
	// State
	// Zip Code

// When user clicks the "Use Current Location" link, the current location autopopulates the Origin Form

	// Street Address
	// City
	// State
	// Zip Code

// When user clicks submit button, the page displays the cheapest ride (BART versus Uber) AND fastest ride (BART versus Uber)
// The app shall display the Previous Origin and Previous Destination.
// The displayed Previous Origin and Previous Destination can be clicked. 
// When the displayed Previous Origin and Previous Destination are clicked, the form autopopulates accordingly  

// Backend --- instructions to be completed/revised
// Create a variable to store values for Origin and Destination Data
// Create on-click listener for submit button
// Create the variables for Firebase and store the Data in Firebase
// Set up API's for Uber, BART, Google Maps
// Set up API to get traffic data
// Needs to establish time of search (moment.js) 
// Compare prices. Compare times.

// <script src="https://www.gstatic.com/firebasejs/4.1.2/firebase.js"></script>

// <script>

// initialize firebase
var config = {
   apiKey: "AIzaSyC213GJibSJGz-RH9Eo2Gk6OaeZLCbkQKI",
   authDomain: "commuter-570b0.firebaseapp.com",
   databaseURL: "https://commuter-570b0.firebaseio.com",
   projectId: "commuter-570b0",
   storageBucket: "commuter-570b0.appspot.com",
   messagingSenderId: "554554260832"
};
firebase.initializeApp(config);

// variable
var database = firebase.database()

// uber keys
var uberClientId = "W5EjuGPtsBB6ys1CsU4yO_v2v6OD-9yv";
var uberServerToken = "JAKbUCfFFRjLRY9zixZ7ddtnvEKJ333beHINWKfT";

//function for getting user address inputs and storing to firebase
$("#submitButton").on("click", function(){
	// prevent default
	event.preventDefault();
	// stores user input in variables
	var streetOrigin = $("#originStreet-input").val().trim();
	var cityOrigin = $("#originCity-input").val().trim();
	var stateOrigin = $("#originState-input").val().trim();
	var zipOrigin = $("#originZIP-input").val().trim();
	var streetDestination = $("#destinationStreet-input").val().trim();
	var cityDestination = $("#destinationCity-input").val().trim();
	var stateDestination = $("#destinationState-input").val().trim();
	var zipDestination = $("#destinationZIP-input").val().trim();

	// for (var i = 0; i < streetOrigin.length; i++) {
	// 	var streetOriginURL = streetOrigin + "+"
	// 	};

	// 	console.log(streetOriginURL);

	// assign origin address to an "origin" object
	var navInfo = {
		streetOrigin: streetOrigin,
		cityOrigin: cityOrigin,
		stateOrigin: stateOrigin,
		zipOrigin: zipOrigin,

		streetDestination: streetDestination,
		cityDestination: cityDestination,
		stateDestination: stateDestination,
		zipDestination: zipDestination,
	};
	// push objects to firebase database
  	database.ref().push(navInfo);
  	
  	// clear spans and divs
  	$("#prevOrigins").empty();
  	$("#prevDestinations").empty();
  	$("#cheapestOption").empty();
  	$("#fastestOption").empty();
  	// re-print last 3 addresses from firembase to html
  	printPreviousAddresses();

	// ***THESE ARE TEST VALUES****
	// var userLatitude = 41.7283405
	//   , userLongitude = -72.994567
	//   , partyLatitude = 40.7283405
 // 	  , partyLongitude = -73.994567;

	// getEstimatesForUserLocation(userLatitude, userLongitude);

// start of compare function	

	function compareTime(x,y,z,a,b,c){
		console.log(x + "," + y + "," + z);

		var fastestDisplay;
		var cheapestDisplay;

		if (x < y) {
			if (x < z) {
				fastestDisplay = x + " min (Uber)";
			} else if (z < x) {
				fastestDisplay = z + " min (Google Walk)";
			}
		}

		if (y < x) {
			if (y < z) {
				fastestDisplay = y + " min (Google Transit)" ;
			} else if (z < y) {
				fastestDisplay = z + " min (Google Walk)";
			}
		}

		if (z < x) {
			if (z < y) {
				fastestDisplay = z + " min (Google Walk)";
			} else if (y < z) {
				fastestDisplay = y + " min (Google Transit)";
			}
		}

		if (a < b) {
			if (a < c) {
				cheapestDisplay = a + " (Uber)";
			} else if (c < a) {
				cheapestDisplay = c + " (Google Walk)";
			}
		}

		if (b < a) {
			if (b < c) {
				cheapestDisplay = b + " (Google Transit)";
			} else if (c < b) {
				cheapestDisplay = c + " (Google Walk)";
			}
		}

		if (c < a) {
			if (c < b) {
				cheapestDisplay = c + " (Google Walk)";
			} else if (b < c) {
				cheapestDisplay = b + " (Google Transit)";
			}
		}

		//Comparison logic goes here!!!!!

		$("#fastestOption").append("<h4>Fastest Options</h4><h5 class='text-center' style='color:green'>" + fastestDisplay + "</h5>");

		$("#cheapestOption").append("<h4>Cheapest Options</h4><h5 class='text-center' style='color:green'>$" + cheapestDisplay + "</h5>");

	}

// end of compare function

		
	
// start of call API function .done fixed

	function callAPIS (originLat,originLng,destinationLat,destinationLng) {
	
	// use user's origin and destination long/lats
	//function getEstimatesForUserLocation(latitude,longitude) {
		$.ajax({
	    	url: "https://crossorigin.me/https://api.uber.com/v1/estimates/price?start_latitude=" + originLat 
	    		+ "&start_longitude=" + originLng 
	    		+ "&end_latitude=" + destinationLat 
	    		+ "&end_longitude=" + destinationLng 
	    		+ "&server_token=JAKbUCfFFRjLRY9zixZ7ddtnvEKJ333beHINWKfT",
			method: "GET"
		}).done(function(response) {
			console.log(response);
			var uberHighPrice = response.prices[0].high_estimate;
			var uberHighTime  = response.prices[0].duration/60; //converts seconds to minutes
			console.log("here " + uberHighTime);
			// compareAPIS(uberHighTime, googleBartTime, googleWalkTime);
				// Google Maps Directions API starts here

					var userkeyGoogle = "AIzaSyCyxHsJw8QJ4Fh1yE0w-gJY0K27lSuOurc";

					// URL for transit mode
					var queryURL2 ="https://crossorigin.me/https://maps.googleapis.com/maps/api/directions/json?origin=" + originLat + "," + originLng + "&destination=" + destinationLat + "," + destinationLng + "&mode=transit&key=" + userkeyGoogle;
					// URL for walking mode
					var queryURL3 ="https://crossorigin.me/https://maps.googleapis.com/maps/api/directions/json?origin=" + originLat + "," + originLng + "&destination=" + destinationLat + "," + destinationLng + "&mode=walking&key=" + userkeyGoogle;

					console.log(queryURL2);

					// Call for APIL: Google Maps Direction Transit Mode 

					$.ajax({
					url: queryURL2,
					method: "GET",
					}).done(function(response){

						console.log(response);
									
						googleBartTime = Math.floor(response.routes[0].legs[0].duration.value/60);
						console.log("Transit Duration: " + googleBartTime);


						var googleFare;
						
						if (response.routes[0].fare) {
							googleFare = response.routes[0].fare.value;
						} else {
							googleFare = 8;
						}	

						console.log("google fare " + googleFare);
								
								// Call for APIL: Google Maps Direction Walking Mode 

								$.ajax({
								url: queryURL3,
								method: "GET",
								}).done(function(response){

									console.log(response);
												
									googleWalkTime = Math.floor(response.routes[0].legs[0].duration.value/60);

									console.log("Walking Duration: " + googleWalkTime);

									googleWalkPrice = 0;

										// Google Maps Directions API ends here

									console.log("compareTime : " + uberHighTime, googleBartTime, googleWalkTime);

									compareTime(uberHighTime, googleBartTime, googleWalkTime, uberHighTime, googleFare, googleWalkPrice);

								});						
				});

					console.log(queryURL3);

		});

	}	

// end of call API function .done fixed

	var originLat = 0;
	var originLng = 0;

	// get user's origin and destination long/lats
	$.ajax({
        //url: "https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyAPcxvzzVjsR9zzeLUTBhV87D-a9OER6HQ"
        url: "https://maps.googleapis.com/maps/api/geocode/json?address="+streetOrigin+","+cityOrigin+","+stateOrigin+"&key=AIzaSyAPcxvzzVjsR9zzeLUTBhV87D-a9OER6HQ",
        method: "GET"
    }).done(function(response) {
        console.log(response);
        originLat = response.results[0].geometry.location.lat;
        originLng = response.results[0].geometry.location.lng;
        // console.log(originLat);
        // console.log(originLng);
    }).done(function() {    
		$.ajax({
	        //url: "https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyAPcxvzzVjsR9zzeLUTBhV87D-a9OER6HQ"
	        url: "https://maps.googleapis.com/maps/api/geocode/json?address="+streetDestination+","+cityDestination+","+stateDestination+"&key=AIzaSyAPcxvzzVjsR9zzeLUTBhV87D-a9OER6HQ",
	        method: "GET"
	    }).done(function(response) {
	        console.log(response);
	        var destinationLat = response.results[0].geometry.location.lat;
	        var destinationLng = response.results[0].geometry.location.lng;
	        // console.log(destinationLat);
	        // console.log(destinationLng);
	        callAPIS(originLat,originLng,destinationLat,destinationLng);
	    });
	  });

});

$("#resetButton").on("click", function(){
	document.location.reload(true);
});

// print last 3 addresses from firebase to html upon load
function printPreviousAddresses () {
	database.ref().limitToLast(1).on('child_added', function(childSnapshot) {
		var streetOrigin = childSnapshot.val().streetOrigin;
		var cityOrigin = childSnapshot.val().cityOrigin;
		var stateOrigin = childSnapshot.val().stateOrigin;
		var zipOrigin = childSnapshot.val().zipOrigin;

		var streetDestination = childSnapshot.val().streetDestination;
		var cityDestination = childSnapshot.val().cityDestination;
		var stateDestination = childSnapshot.val().stateDestination;
		var zipDestination = childSnapshot.val().zipDestination;

		var neatOrigin = streetOrigin + ", " + cityOrigin + ", " + stateOrigin + ", " + zipOrigin;
		var neatDestination = streetDestination + ", " + cityDestination + ", " + stateDestination + ", " + zipDestination;
		
		// Add addresses to the respective "Previous ____" div
		$("#prevOrigins").prepend("<div class='panel panel-default'><div class='panel-body'>"+neatOrigin+"<br><a href='#' class='useThisO' street='" + streetOrigin + "' city='" + cityOrigin + "' state='" + stateOrigin + "' zip='" + zipOrigin + "'>Use this origin</a></div></div>");
		$("#prevDestinations").prepend("<div class='panel panel-default'><div class='panel-body'>"+neatDestination+"<br><a href='#' class='useThisD' street='" + streetDestination + "' city='" + cityDestination + "' state='" + stateDestination + "' zip='" + zipDestination + "'>Use this destination</a></div></div>");
	});
};

printPreviousAddresses();



// 3 functions below get user's location
var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAPcxvzzVjsR9zzeLUTBhV87D-a9OER6HQ";

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition)
    }
}

function showPosition(position) {
    var userLat = position.coords.latitude;
    var userLng = position.coords.longitude;
    var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+userLat+","+userLng+"&key=AIzaSyAPcxvzzVjsR9zzeLUTBhV87D-a9OER6HQ"
    	$.ajax({
			url:queryURL,
			method:'GET'
		}).done(function(response) {
			//console.log(response.results[0].address_components);
			var userCurrentStreet = response.results[0].address_components[0].long_name + " " + response.results[0].address_components[1].short_name;
			//console.log(userCurrentStreet);

			var userCurrentCity = response.results[0].address_components[3].long_name;
			//console.log(userCurrentCity);

			var userCurrentState = response.results[0].address_components[6].short_name;
			//console.log(userCurrentState);

			var userCurrentZIP = response.results[0].address_components[7].long_name;
			//console.log(userCurrentZIP);

			$("#originStreet-input").attr("value", userCurrentStreet);
			$("#originCity-input").attr("value", userCurrentCity);
			$("#originState-input").attr("value", userCurrentState);
			$("#originZIP-input").attr("value", userCurrentZIP);

		});
}

$("#userLocation").on("click", getLocation);

$(document).on("click", ".useThisO", function(event){
	// prevent default
	event.preventDefault();
	var prevStreetOrigin = $(this).attr("street");
	var prevCityOrigin = $(this).attr("city");
	var prevStateOrigin = $(this).attr("state");
	var prevZipOrigin = $(this).attr("zip");
	//console.log(prevStreetOrigin);

	$("#originStreet-input").attr("value", prevStreetOrigin);
	$("#originCity-input").attr("value", prevCityOrigin);
	$("#originState-input").attr("value", prevStateOrigin);
	$("#originZIP-input").attr("value", prevZipOrigin);
});

$(document).on("click", ".useThisD", function(event){
	// prevent default
	event.preventDefault();
	var prevStreetDestination = $(this).attr("street");
	var prevCityDestination = $(this).attr("city");
	var prevStateDestination = $(this).attr("state");
	var prevZipDestination = $(this).attr("zip");
	//console.log(prevStreetOrigin);

	$("#destinationStreet-input").attr("value", prevStreetDestination);
	$("#destinationCity-input").attr("value", prevCityDestination);
	$("#destinationState-input").attr("value", prevStateDestination);
	$("#destinationZIP-input").attr("value", prevZipDestination);
	});