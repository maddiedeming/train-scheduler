var _minutesAway;
var _nextArrival = "";
var ip = "";
//Firebase
var config = {
    apiKey: "AIzaSyDnAUlx9qlnBAf17mXq0NmW9UFvwFnJqV0",
    authDomain: "trainscheduler-1bfe3.firebaseapp.com",
    databaseURL: "https://trainscheduler-1bfe3.firebaseio.com",
    projectId: "trainscheduler-1bfe3",
    storageBucket: "",
    messagingSenderId: "372011317998"
};
firebase.initializeApp(config);
var database = firebase.database();

function calculateTimes(frequency,minutes){
    _firstTrain = moment().startOf('day').minute(minutes); 
    var number = moment().diff(moment(_firstTrain), "minutes");
    
    if(number < 0){
        number = number * -1;    
        var currentTime = parseInt(((moment().get('hour')) * 60) + (moment().get('minutes')));
        var trainTime = parseInt(((_firstTrain.get('hour')) * 60) + (_firstTrain.get('minutes')));
        _minutesAway = trainTime - currentTime
        _nextArrival = _firstTrain.format("h:mm a");
    }
    else{
        _minutesAway = parseInt(frequency - (number % frequency));
        _nextArrival = moment().add(_minutesAway, 'minutes').format("h:mm a");
    }
}

$("#add").on("click", function(event){
    event.preventDefault();
    var _trainName = $("#trainName").val().trim();
    var _destination = $("#destination").val().trim();
    var _firstTrain = $("#firstTrainTime").val().trim();
    var _firstTrainMinutes = parseInt((_firstTrain.charAt(0) + _firstTrain.charAt(1)) * 60) + parseInt(_firstTrain.charAt(3) + _firstTrain.charAt(4));
    var _frequency = $("#frequency").val().trim();
    $("input").val("");
    calculateTimes(_frequency,_firstTrainMinutes);
    var train = {
        trainName: _trainName,
        destination: _destination,
        frequency: _frequency,
        nextArrival: _nextArrival,
        minutesAway: _minutesAway,
        userDetails: {
            //createUser: ,
            createTimestamp: Math.floor(Date.now()),
            updateUser: null,
            updateTimestamp: null              
        }        
    }
    database.ref().push(train);
});

database.ref().on("child_added", function(snapshot){
    var trainTable = $("#trainTable");
    var tableRow = $("<tr>");
    var tableColumn = 
        $('<td>' + snapshot.val().trainName + '</td>' +
        '<td>' + snapshot.val().destination + '</td>' +
        '<td>' + snapshot.val().frequency + '</td>' +
        '<td>' + snapshot.val().nextArrival + '</td>' +
        '<td>' + snapshot.val().minutesAway + '</td>' +
        '<td>' + '<button type="button" class="btn btn-link"><i class="fa fa-trash-o"></i></button>' + '</td>');
    tableRow.append(tableColumn);
    trainTable.append(tableRow);
  }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
  });

$("td").on("blur", function(event){
console.log("test")
});