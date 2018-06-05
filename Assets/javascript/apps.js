
// My Global Variables: I leave them blank to be fillede later within my table
var trainName = "";
var trainDestination = "";
var trainTime = "";
var trainFrequency = "";
var nextArrival = "";
var minutesAway = "";

// jQuery global variables
var mytrain = $("#train-name");
var mytrainDestination = $("#train-destination");

// form validation for Time using jQuery Mask plugin (Note: I found this online and totally copied this piece)
var mytrainTime = $("#train-time").mask("00:00");
var myTimeFreq = $("#time-freq").mask("00");

// Firebase
var config = {
    apiKey: "AIzaSyD1ofF5gbF3uoreBNm9w3txg4BHpUR3Is8",
    authDomain: "train-scheduler-20757.firebaseapp.com",
    databaseURL: "https://train-scheduler-20757.firebaseio.com",
    projectId: "train-scheduler-20757",
    storageBucket: "",
    messagingSenderId: "263234224513"
  };
  
  firebase.initializeApp(config);

var database = firebase.database();

database.ref("/trains").on("child_added", function(snapshot) {

    //  create my "local" variables which stores data from firebase
    var trainDiff = 0;
    var trainRemainder = 0;
    var minutesTillArrival = "";
    var nextTrainTime = "";
    var frequency = snapshot.val().frequency;

    // Below is logic for my math as Murph showed us in class

    // the difference in time from 'now' and the first train using UNIX timestamp, store in variable & convert to minutes
    trainDiff = moment().diff(moment.unix(snapshot.val().time), "minutes");

    // remainder of time by using 'moderator' w/ the frequency & time difference, store in variable
    trainRemainder = trainDiff % frequency;

    // subtract remainder from the frequency, store in variable
    minutesTillArrival = frequency - trainRemainder;

    // add minutesTillArrival to now, to find next train & convert to std time
    nextTrainTime = moment().add(minutesTillArrival, "m").format("hh:mm A");

    // this adds to our panel data by.. --> appending to our table of trains, inside tbody, with a new row of the train data 
    $("#table-data").append(
        "<tr><td>" + snapshot.val().name + "</td>" +
        "<td>" + snapshot.val().destination + "</td>" +
        "<td>" + frequency + "</td>" +
        "<td>" + minutesTillArrival + "</td>" +
        "<td>" + nextTrainTime + "  " + "<a><span class='glyphicon glyphicon-remove icon-hidden' aria-hidden='true'></span></a>" + "</td></tr>"
    );

    $("span").hide();

});

// function calls button event, and stores the values in the input form
var storeInputs = function(event) {
    // prevent event from reseting when you refresh
    event.preventDefault();

    // gets/stores inputs 
    trainName = mytrain.val().trim();
    trainDestination = mytrainDestination.val().trim();
    trainTime = moment(mytrainTime.val().trim(), "HH:mm").subtract(1, "years").format("X");
    trainFrequency = myTimeFreq.val().trim();

    // add in firebase
    database.ref("/trains").push({
        name: trainName,
        destination: trainDestination,
        time: trainTime,
        frequency: trainFrequency,
        nextArrival: nextArrival,
        minutesAway: minutesAway,
        date_added: firebase.database.ServerValue.TIMESTAMP
    });

    alert("Train successuflly added!");

    //  creates an empty form after sumbission of previous inputs
    mytrain.val("");
    mytrainDestination.val("");
    mytrainTime.val("");
    myTimeFreq.val("");
};

// Calls storeInputs function if submit button clicked
$("#btn-add").on("click", function(event) {

    // form validation: alerts if empty
    if (mytrain.val().length === 0 || mytrainDestination.val().length === 0 || mytrainTime.val().length === 0 || myTimeFreq === 0) {
        alert("Please Fill All Required Fields");
    } else {
        // if form is filled out, run function
        storeInputs(event);
    }
});

// Calls storeInputs function if enter key is clicked
$('form').on("keypress", function(event) {
    if (event.which === 13) {
        // form validation: alerts if empty
        if (mytrain.val().length === 0 || mytrainDestination.val().length === 0 || mytrainTime.val().length === 0 || myTimeFreq === 0) {
            alert("Please Fill All Required Fields");
        } else {
            // if form is filled out, run function
            storeInputs(event);
        }
    }
});
