//connect the app to firebase
var config = {
  apiKey: "AIzaSyBWSqcMpIV4bIrPDtCOopxAFO1v-a7eYAI",
  authDomain: "uoft-adam-class-33a8e.firebaseapp.com",
  databaseURL: "https://uoft-adam-class-33a8e.firebaseio.com",
  projectId: "uoft-adam-class-33a8e",
  storageBucket: "uoft-adam-class-33a8e.appspot.com",
  messagingSenderId: "211937931691",
  appId: "1:211937931691:web:f490fe3c625f126f"
};

firebase.initializeApp(config);

// Define variable to reference the d/b.
var database = firebase.database();

// determine the variables
var name = "";
var destination = "";
var startTime= "";
var nextarrival = "";
var frequency=0;
var minutesAway=0;

// user clicks the submit button, accept input and add to firebase d/b 
 
$("#add-user").click(function(event){

    event.preventDefault();     
    console.log("Prevent Default");
	
// grab the user input
    var trainName=$("#train-name-input").val().trim();
    var destination=$("#destination-input").val().trim();
    var firstTime=$("#time-input").val().trim();
    var tFrequency=$("#frequency-input").val().trim();

//Logic to calculate  minutes till next train

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + currentTime.format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;

// ---------------------------------------------------------------     
// calculate Next Train Arrival time
    var nextArrival = moment().add(tMinutesTillTrain, "minutes");
    var nextTrainArrival=moment(nextArrival).format("hh:mm");
    console.log(nextTrainArrival);

// Uploads train data to the database
  database.ref().push({

    name:trainName,
    destination:destination,
    startTime:firstTime,
    frequency:tFrequency,
    nextarrival:nextTrainArrival,
    minutesAway: tMinutesTillTrain,
  });
});  

  // Firebase event for adding data to the d/b 
  //and a row in the html when a user adds an entry
  database.ref().on("child_added", function(snapshot){

        var sv=snapshot.val();
        var  newRow= $("<tr>").append(
        $("<td>").text(sv.name), 
        $("<td>").text(sv.destination),
        $("<td>").text(sv.frequency),
        $("<td>").text(sv.nextarrival),
        $("<td>").text(sv.minutesAway));

        $("tbody").append(newRow);
  });