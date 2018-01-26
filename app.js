//Global Variables
var trainName = $("#trainName");
var destination = $("#destination");
var firstTrainTime = $("#firstTrainTime");
var frequency = $("#frequency");
var add = $("#add");
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

$(frequency).blur(function(){
    var _inputFrequency = parseInt(frequency.val().trim());
    if(_inputFrequency > 60){
        frequency.val(60);
    }
});

$(firstTrainTime).blur(function(){
    if(firstTrainTime[0].type != "time"){
        var _firstTrainTime = firstTrainTime.val().trim();
        //Fix Shit For Internet Explorer and Safari
    }
});

$(add).on("click", function(event){
    event.preventDefault();
    var _inputTrainName = trainName.val().trim();
    var _inputDestination = destination.val().trim();
    var _inputFirstTrainTime = firstTrainTime.val().trim();
    var _inputFrequency = frequency.val().trim();
    //Clear Input Values
    if(_inputTrainName != null){
        trainName.val("");
    }
    if(_inputDestination != null){
        destination.val("");
    }
    if(_inputFirstTrainTime != null){
        firstTrainTime.val("");
    }
    if(_inputFrequency != null){
        frequency.val("");
    }
});

//Integrate DOM Manipulation Logic When You Learn How To Use Firebase
var trainTable = $("#trainTable");
var tableRow = $("<tr>");
var tableColumn = $("<td><td><td><td><td>");
tableRow.append(tableColumn);
trainTable.append(tableRow);