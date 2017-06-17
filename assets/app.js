//Alexis' New Comment (Sat Class)

// Pseudocode

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

// Commented out these variables since we use them in different ways in the functions below
// var streetOrigin = "";
// var cityOrigin = "";
// var stateOrigin = "";
// var zipOrigin;
// var streetDestination = "";
// var cityDestination = "";
// var stateDestination = "";
// var zipDestination;

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
	//push objects to firebase database
  	database.ref().push(navInfo);
  	

});

// function for pushing firebase addresses to html
database.ref().on("child_added", function(childSnapshot, prevChildKey) {
	// prevent default
	console.log(childSnapshot.val());
	// Store everything into a variable.
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
	$("#prevOrigins").append("<div class='panel panel-default'><div class='panel-body'>"+neatOrigin+"</div></div>");
	$("#prevDestinations").append("<div class='panel panel-default'><div class='panel-body'>"+neatDestination+"</div></div>");
});

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
			console.log(response.results[0].address_components);
			var userCurrentStreet = response.results[0].address_components[0].long_name + " " + response.results[0].address_components[1].long_name;
			console.log(userCurrentStreet);

			var userCurrentCity = response.results[0].address_components[3].long_name;
			console.log(userCurrentCity);

			var userCurrentState = response.results[0].address_components[5].short_name;
			console.log(userCurrentState);

			var userCurrentZIP = response.results[0].address_components[7].long_name;
			console.log(userCurrentZIP);

			$("#originStreet-input").attr("value", userCurrentStreet);
			$("#originCity-input").attr("value", userCurrentCity);
			$("#originState-input").attr("value", userCurrentState);
			$("#originZIP-input").attr("value", userCurrentZIP);



		});
}

//BART API
var userkeyBart = "MW9S-E7SL-26DU-VV8V";

var queryURL = "http://api.bart.gov/api/sched.aspx?cmd=routesched&route=6&key=" + userkeyBart + "&date=sa&json=y";

		$.ajax({
			url: queryURL,
			method: 'GET'
			}).done(function(response){
				console.log(queryURL);

		});

$("#userLocation").on("click", getLocation);

// function to use
// $("#useThisAddress").on("click", function(){
// 	// prevent default
// 	event.preventDefault();

// 	var streetOrigin = $("#originStreet-input").val().trim();
// 	var cityOrigin = $("#originCity-input").val().trim();
// 	var stateOrigin = $("#originState-input").val().trim();
// 	var zipOrigin = $("#originZIP-input").val().trim();
// 	var streetDestination = $("#destinationState-input").val().trim();
// 	var cityDestination = $("#destinationCity-input").val().trim();
// 	var stateDestination = $("#destinationState-input").val().trim();
// 	var zipDestination = $("#destinationZIP-input").val().trim();

// 	var origin = {
// 		street: streetOrigin;
// 		city: cityOrigin;
// 		state: stateOrigin;
// 		zip: zipOrigin;
// 	};

// 	var destination = {
// 		street: streetDestination;
// 		city: cityDestination;
// 		state: stateDestination;
// 		zip: zipDestination;
// 	};

//   	database.ref().push(origin);
//   	database.ref().push(destination);

// });

// </script>