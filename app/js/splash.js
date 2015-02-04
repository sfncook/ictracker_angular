'use strict';

var app = angular.module("ictApp", ['DataServices']);

app.controller('SplashCtrl', function($scope, LoadAllIncidents, Incidents, LoadIncidentTypes, IncidentTypes, ConvertParseObject){

    LoadIncidentTypes();
    $scope.incidentTypes = IncidentTypes;

    LoadAllIncidents($scope);
    $scope.incident_list = Incidents;

    var IncidentParseObj = Parse.Object.extend('Incident');
    $scope.incidentObj = new IncidentParseObj();
    ConvertParseObject($scope.incidentObj, INCIDENT_DEF);

    // Respond to incident type button click
    $scope.createAndLoadNewIncident = function(incidentType) {
        $scope.incidentObj.incidentType = incidentType;

        // Default value for inc_number
        if(!$scope.incidentObj.inc_number) {
            $scope.incidentObj.inc_number = "[Incident Number]"
        }

        $scope.incidentObj.save().then(function(incidentObj) {
            ConvertParseObject(incidentObj, INCIDENT_DEF);
            $scope.loadIncident(incidentObj.id);
        }, function(error) {
            console.log("Error saving new incident: "+error);
        });;
    };


    $scope.loadIncident = function(incidentId) {
        var urlLink = "incident_form.html?i="+incidentId;
        window.location.href = urlLink;
    };

    $scope.deleIncident = function(incident) {
        var response = confirm("Are you sure you want to delete incident "+incident.inc_number+"?");
        if (response == true) {
            incident.destroy({
                success: function(myObject) {
                    loadIncidentList($scope, ConvertParseObject, ParseQuery);
                },
                error: function(myObject, error) {
                    console.log("Error:"+error);
                    loadIncidentList($scope, ConvertParseObject, ParseQuery);
                }
            });
        }
    };


});
