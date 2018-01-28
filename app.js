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

function toggleSignIn(){
    if (!firebase.auth().currentUser){
        var provider = new firebase.auth.GithubAuthProvider();
        provider.addScope('repo');
        firebase.auth().signInWithRedirect(provider);
    } 
    else{
        firebase.auth().signOut();
    }
    $("#login").disabled = true;
}

function initApp(){
    firebase.auth().getRedirectResult().then(function(result){
    if (result.credential){
        var token = result.credential.accessToken;
       //$("#quickstart-oauthtoken").textContent = token;
    } 
    else{
        //$("#quickstart-oauthtoken").textContent = null;
    }
    var user = result.user;
    }).catch(function(error){
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        if(errorCode === "auth/account-exists-with-different-credential") {
            alert("You have already signed up with a different auth provider for that email.");
        } 
        else {
            console.error(error);
        }
    });
    firebase.auth().onAuthStateChanged(function(user){
        if (user){
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;
            //$("#quickstart-sign-in-status").textContent = "Signed in";
            //$("#login").textContent = "Sign out";
            //$("#quickstart-account-details").textContent = JSON.stringify(user, null, "  ");
        } 
        else{
            //$("#quickstart-sign-in-status").textContent = "Signed out";
            //$("#login").textContent = "Sign in with GitHub";
            //$("#quickstart-account-details").textContent = null;
            //$("#quickstart-oauthtoken").textContent = null;
        }
        $("#login").disabled = false;
    });
  //  $("#login").addEventListener('click', toggleSignIn, false);
    Document.getElementById("login").addEventListener('click', toggleSignIn, false);
window.onload = function(){
    initApp();
};

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