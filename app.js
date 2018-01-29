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
    tableRow.attr("id",snapshot.child().ref.parent.key);
    tableRow.attr("data-value",snapshot.child().ref.parent.key);
    var tableColumn = 
        $('<td><p value="' + snapshot.val().trainName + '" data-value="' + snapshot.val().trainName + '">' + snapshot.val().trainName + '</p></td>' +
        '<td><p value="' + snapshot.val().destination + '" data-value="' + snapshot.val().destination + '">' + snapshot.val().destination + '</p></td>' +
        '<td><p value="' + snapshot.val().frequency + '" data-value="' + snapshot.val().frequency + '">' + snapshot.val().frequency + '</p></td>' +
        '<td><p value="' + snapshot.val().nextArrival + '" data-value="' + snapshot.val().nextArrival + '">' + snapshot.val().nextArrival + '</p></td>' +
        '<td><p value="' + snapshot.val().minutesAway + '" data-value="' + snapshot.val().minutesAway + '">' + snapshot.val().minutesAway + '</p></td>' +
        '<td>' +
        '<button type="button" onclick="editTrain(this)" class="btn btn-link edit-train"><i class="fa fa-edit"></i></button>' +
        '<button type="button" onclick="editTrain(this)" class="btn btn-link delete-train"><i class="fa fa-trash-o"></i></button>' + 
        '<button type="submit" onclick="editTrain(this)" class="btn btn-link update-train edit-row"><i class="fa fa-check"></i></button>' +
        '<button type="button" onclick="editTrain(this)" class="btn btn-link cancel-train edit-row"><i class="fa fa-ban"></i></button>' + '</td>');
    tableRow.append(tableColumn);
    trainTable.append(tableRow);
    $(".update-train").hide();
    $(".cancel-train").hide();
  }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
  });

  database.ref().on("child_changed", function(snapshot){
    $("#" + snapshot.child().ref.parent.key).empty();
    var trainTable = $("#trainTable");
    var tableRow = $("<tr>");
    var tableRow = $("#" + snapshot.child().ref.parent.key);
    var tableColumn = 
        $('<td><p value="' + snapshot.val().trainName + '" data-value="' + snapshot.val().trainName + '">' + snapshot.val().trainName + '</p></td>' +
        '<td><p value="' + snapshot.val().destination + '" data-value="' + snapshot.val().destination + '">' + snapshot.val().destination + '</p></td>' +
        '<td><p value="' + snapshot.val().frequency + '" data-value="' + snapshot.val().frequency + '">' + snapshot.val().frequency + '</p></td>' +
        '<td><p value="' + snapshot.val().nextArrival + '" data-value="' + snapshot.val().nextArrival + '">' + snapshot.val().nextArrival + '</p></td>' +
        '<td><p value="' + snapshot.val().minutesAway + '" data-value="' + snapshot.val().minutesAway + '">' + snapshot.val().minutesAway + '</p></td>' +
        '<td>' +
        '<button type="button" onclick="editTrain(this)" class="btn btn-link edit-train"><i class="fa fa-edit"></i></button>' +
        '<button type="button" onclick="editTrain(this)" class="btn btn-link delete-train"><i class="fa fa-trash-o"></i></button>' + 
        '<button type="submit" onclick="editTrain(this)" class="btn btn-link update-train edit-row"><i class="fa fa-check"></i></button>' +
        '<button type="button" onclick="editTrain(this)" class="btn btn-link cancel-train edit-row"><i class="fa fa-ban"></i></button>' + '</td>');
    tableRow.append(tableColumn);
    trainTable.append(tableRow);
    $(".update-train").hide();
    $(".cancel-train").hide();
  }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
  });

//Add a Train Button Click Event
$("#add").on("click", function(event){
    event.preventDefault();
    var _trainName = $("#trainName").val().trim();
    var _destination = $("#destination").val().trim();
    var _firstTrain = $("#firstTrainTime").val().trim();
    var _frequency = $("#frequency").val().trim();
    if(_trainName === "" || _destination === "" || _firstTrain === "" || _frequency === ""){
        alert("All fields are required. Please fill in the missing information.")
        if(_trainName === ""){
            $("#trainName").css("border-color","red");
        }
        if(_destination === ""){
            $("#destination").css("border-color","red");
        }
        if(_firstTrain === ""){
            $("#firstTrainTime").css("border-color","red");
        }
        if(_frequency === ""){
            $("#frequency").css("border-color","red");
        }
    }
    else{
        $("#trainName,#destination,#firstTrainTime,#frequency").css("border-color","none");
        var _firstTrainMinutes = parseInt((_firstTrain.charAt(0) + _firstTrain.charAt(1)) * 60) + parseInt(_firstTrain.charAt(3) + _firstTrain.charAt(4));
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
    }
});
$("input").on("blur", function(event){
    if($(this).val() === ""){
        $(this).css("border-color","red");
    }
    else{
        $(this).removeAttr("style");
    }
});
var dbTrainName = "";
var dbDestination = "";
var dbFrequency = "";
var dbNextArrival = "";
var dbMinutesAway = "";
function editTrain(button){
    var row = button.parentElement.parentElement;
    var rowKey = $(row).data("value")
    if(!$(button).hasClass("edit-row")){
        if($(button).hasClass("edit-train")){
            $(button.parentElement.lastChild.previousSibling).show();
            $(button.parentElement.lastChild).show();
            $(button.parentElement.firstChild).hide();
            $(button.parentElement.firstChild.nextSibling).hide();
            row.children[0].children[0].focus();
            for(i = 0; i < 4; i++){
                var dataValue = ""
                if($(row.children[i].children[0]).val() === ""){
                    dataValue = row.children[i].children[0].textContent;
                    
                }
                else {
                    dataValue = $(row.children[i].children[0]).val();
                }
                
                $(row.children[i].children[0]).replaceWith('<input value="' + dataValue + '" data-value="' + dataValue + '">');
                row.children[i].children[0].className = "form-control";
                if(i === 3){
                    var resetTime = moment(dataValue,'HH:mm a');
                    row.children[i].children[0].type = "time";
                    row.children[i].children[0].value = resetTime.format('HH:mm');
                }
            }
        }
        else if($(button).hasClass("delete-train")){
            database.ref().child(rowKey).remove().then(function(result){
                    $(row).empty();
                }).catch(function(error){
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    var email = error.email;
                    var credential = error.credential;
            });
        }
    }
    else {
        $(button.parentElement.lastChild.previousSibling).hide();
        $(button.parentElement.lastChild).hide();
        $(button.parentElement.firstChild).show();
        $(button.parentElement.firstChild.nextSibling).show();
        if($(button).hasClass("update-train")){
            $(row.children[3].children[0]).css("border-color","none");
            var time = $(row.children[3].children[0]).val();
            var firstTrain = moment(time,'hh:mm a');
            if(moment().isBefore(firstTrain)){
                var firstTrainMinutes = parseInt(moment(firstTrain).hours() * 60) + parseInt(moment(firstTrain).minutes());
                var currentTime = parseInt(moment().hours() * 60) + parseInt(moment().minutes());
                var updateMinutesAway = firstTrainMinutes - currentTime;     
                database.ref().update({
                    ['/' + rowKey + '/trainName']: $(row.children[0].children[0]).val(),
                    ['/' + rowKey + '/destination']: $(row.children[1].children[0]).val(),
                    ['/' + rowKey + '/frequency']: $(row.children[2].children[0]).val(),
                    ['/' + rowKey + '/nextArrival']: firstTrain.format('hh:mm a'),
                    ['/' + rowKey + '/minutesAway']: updateMinutesAway,
                    ['/' + rowKey + '/userDetails/updateUser']: firebase.auth().currentUser.email,
                    ['/' + rowKey + '/userDetails/updateTimestamp']: moment().format()   
                    }).then(function(result){
                            for(var i = 0; i < 5; i++){
                        $(row.children[0].children[0]).data("value",$(row.children[0].children[0]).val());
                        $(row.children[1].children[0]).data("value",$(row.children[1].children[0]).val());
                        $(row.children[2].children[0]).data("value",$(row.children[2].children[0]).val());
                        $(row.children[3].children[0]).data("value",$(row.children[3].children[0]).val());
                        $(row.children[4].children[0]).data("value",$(row.children[4].children[0]).val());
                            }
        
                    }).catch(function(error){
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        var email = error.email;
                        var credential = error.credential;
                });
                for(i = 0; i < 4; i++){
                    $(row.children[i].children[0]).removeClass("form-control");
                    $(row.children[i].children[0]).replaceWith('<p value="' + $(row.children[i].children[0]).data("value") + '" data-value="' + $(row.children[i].children[0]).data("value") + '">' + $(row.children[i].children[0]).data("value") + '</p>');
                }   
            }
            else{
                $(row.children[3].children[0]).css("border-color","red");
                $(button.parentElement.lastChild.previousSibling).show();
                $(button.parentElement.lastChild).show();
                $(button.parentElement.firstChild).hide();
                $(button.parentElement.firstChild.nextSibling).hide();
            }
        }
        else if($(button).hasClass("cancel-train")){
            for(i = 0; i <4; i++){
                $(row.children[i].children[0]).removeClass("form-control");
                $(row.children[i].children[0]).replaceWith('<p value="' + $(row.children[i].children[0]).data("value") + '" data-value="' + $(row.children[i].children[0]).data("value") + '">' + $(row.children[i].children[0]).data("value") + '</p>');
            }
        }
        $(row.children[3].children[0]).css("border-color","none");
    }
}