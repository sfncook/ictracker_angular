'use strict';

var app = angular.module("SplashController", ['DataServices', 'IncidentServices', 'UserServices', 'DepartmentServices']);

app.controller('SplashCtrl', function($scope, LoadAllIncidents, Incidents, LoadIncidentTypes, IncidentTypes, ConvertParseObject, DefaultErrorLogger, InitDbForDepartment, UserLogout, SetSavedDepartment, DataStore){

    if(!SetSavedDepartment()) {
        alert("No department stored locally.");
    } else {
        console.log(Parse.User.current());
    }

    //$scope.department_id = getHttpRequestByName('department_id');
    //InitDbForDepartmentId($scope.department_id).then(
    //    function() {
    //        // For new databases
    //        //AddUserToRole("sfncook", "ict_admin");
    //        //AddStrongRoleToWeakRole("ict_admin", "admin");
    //        //AddStrongRoleToWeakRole("admin", "user");
    //
    //        console.log(Parse.User.current());
    //
    //        //LoadCurrentUser().then(function(){
    //        //    console.log(DataStore.currentUser);
    //        //    $scope.me = DataStore.currentUser.username;
    //        //    $scope.$apply();
    //        //});
    //
    //        //LoadIncidentTypes();
    //        //$scope.incidentTypes = IncidentTypes;
    //
    //        //LoadAllIncidents($scope);
    //        //$scope.incident_list = Incidents;
    //        //
    //        //var IncidentParseObj = Parse.Object.extend('Incident');
    //        //$scope.incidentObj = new IncidentParseObj();
    //        //ConvertParseObject($scope.incidentObj, INCIDENT_DEF);
    //    }, function(message) {
    //        console.log("Error initializing department database: ");
    //        console.log(error.message);
    //    }
    //);

    $scope.logout = function() {
        UserLogout();
        var urlLink = "login.html?department_id="+$scope.department_id;
        window.location.href = urlLink;
    };

    // Respond to incident type button click
    $scope.createAndLoadNewIncident = function(incidentType) {
        $scope.incidentObj.incidentType = incidentType;

        // Default value for inc_number
        if(!$scope.incidentObj.inc_number) {
            $scope.incidentObj.inc_number = "[Incident Number]"
        }

        $scope.incidentObj.save(null, DefaultErrorLogger).then(function(incidentObj) {
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
                    LoadAllIncidents($scope);
                },
                error: function(myObject, error) {
                    console.log("Error:"+error);
                    LoadAllIncidents($scope);
                }
            });
        }
    };

});
