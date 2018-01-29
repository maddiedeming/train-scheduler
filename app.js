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
//Firebase Auth
function toggleLogin(){
    if (!firebase.auth().currentUser){
      var provider = new firebase.auth.GithubAuthProvider();
      provider.addScope('repo');
      firebase.auth().signInWithRedirect(provider);
    } 
    else{
      firebase.auth().signOut();
    }
    $("#login").attr("disabled","disabled");
}
//Firebase Auth
function initApp(){
    firebase.auth().getRedirectResult().then(function(result){
        var user = result.user;
    }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        if (errorCode === "auth/account-exists-with-different-credential"){
            alert("You have already signed up with a different auth provider for that email.");
        } 
        else{
            console.error(error);
        }
    });
    firebase.auth().onAuthStateChanged(function(user) {
    if (user){
        $("#login").text("Sign out");
        $("#main").show();
    } 
    else{
        $("#login").text("Sign in with GitHub");
        $("#main").hide();
    }
        $("#login").removeAttr("disabled");
    });
    document.getElementById('login').addEventListener('click', toggleLogin, false);
}
//On Page Load
window.onload = function(){
    $("#main").hide();
    initApp();
};
//Firebase Database Listener
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
//Add a Train Button Click Event
$("#add").on("click", function(event){
    event.preventDefault();
    var _trainName = $("#trainName").val().trim();
    var _destination = $("#destination").val().trim();
    var _firstTrain = $("#firstTrainTime").val().trim();
    var _firstTrainMinutes = parseInt((_firstTrain.charAt(0) + _firstTrain.charAt(1)) * 60) + parseInt(_firstTrain.charAt(3) + _firstTrain.charAt(4));
    var _frequency = $("#frequency").val().trim();
    $("input").val("");
    _firstTrain = moment().startOf("day").minute(_firstTrainMinutes); 
    var number = moment().diff(moment(_firstTrain), "minutes");
    var _minutesAway;
    var _nextArrival;
    if(number < 0){
        number = number * -1;    
        var currentTime = parseInt(((moment().get("hour")) * 60) + (moment().get('minutes')));
        var trainTime = parseInt(((_firstTrain.get('hour')) * 60) + (_firstTrain.get('minutes')));
        _minutesAway = trainTime - currentTime
        _nextArrival = _firstTrain.format("h:mm a");
    }
    else{
        _minutesAway = parseInt(_frequency - (number % _frequency));
        _nextArrival = moment().add(_minutesAway, 'minutes').format("h:mm a");
    }
    var train = {
        trainName: _trainName,
        destination: _destination,
        frequency: _frequency,
        nextArrival: _nextArrival,
        minutesAway: _minutesAway,
        userDetails: {
            createUser: firebase.auth().currentUser.email,
            createTimestamp: moment().format(),
            updateUser: null,
            updateTimestamp: null              
        }        
    }
    database.ref().push(train);
});

// $("td").on("blur", function(event){
// console.log("test")
// });