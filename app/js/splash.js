'use strict';

var app = angular.module("ictApp", ['DataServices']);

//function loadIncidentList($scope, ParseObject, ParseQuery) {
//    // reset list
//    $scope.incident_list = new Array();
//
//    var query = new Parse.Query(Parse.Object.extend('Incident'));
//    ParseQuery(query, {functionToCall:'find'}).then(function(result){
//        var data = new Array();
//        for(var i=0; i<result.length; i++) {
//
//            var incident = new ParseObject(result[i], Incident.model);
//            fetchTypeForIncident(incident, $scope);
//
//            data.push(incident);
//        }
//        $scope.incident_list = data;
//    });
//}

function loadIncidentTypes($scope, ParseObject, ParseQuery) {
    // reset list
    $scope.inc_types = new Array();

    var query = new Parse.Query(Parse.Object.extend('IncidentType'));
    query.ascending("order");
    ParseQuery(query, {functionToCall:'find'}).then(function(result){
        var data = new Array();
        for(var i=0; i<result.length; i++) {
            var obj = new ParseObject(result[i], IncidentType.model);
            data.push(obj);
        }
        $scope.inc_types = data;
    });
}

app.controller('SplashCtrl', function($scope, LoadAllIncidents, Incidents){

    LoadAllIncidents($scope);
    $scope.incident_list = Incidents;

//    var IncidentParseObj = Parse.Object.extend('Incident');
//    $scope.incidentObj = new ParseObject(new IncidentParseObj(), Incident.model);
//
//    // Incident Types
//    loadIncidentTypes($scope, ParseObject, ParseQuery);

    // Respond to incident type button click
    $scope.createAndLoadNewIncident = function(incidentType) {
        $scope.incidentObj.incidentType = incidentType.data;

        // Default value for inc_number
        if(!$scope.incidentObj.inc_number) {
            $scope.incidentObj.inc_number = "[Incident Number]"
        }

        $scope.incidentObj.save().then(function(obj) {
            var incidentObj = new ParseObject(obj, Incident.model);
            $scope.loadIncident(incidentObj);
        }, function(error) {
            console.log("Error saving new incident: "+error);
        });;
    };


    $scope.loadIncident = function(incident) {
        var urlLink = "incident_form.html?i="+incident.data.id;
        window.location.href = urlLink;
    };

    $scope.deleIncident = function(incident) {
        var response = confirm("Are you sure you want to delete incident "+incident.inc_number+"?");
        if (response == true) {
            incident.data.destroy({
                success: function(myObject) {
                    loadIncidentList($scope, ParseObject, ParseQuery);
                },
                error: function(myObject, error) {
                    console.log("Error:"+error);
                    loadIncidentList($scope, ParseObject, ParseQuery);
                }
            });
        }
    };


});
