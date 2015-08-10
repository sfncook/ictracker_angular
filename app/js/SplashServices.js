'use strict';

var app = angular.module("SplashController", ['DataServices', 'IncidentServices', 'UserServices']);

app.controller('SplashCtrl', function($scope, LoadAllIncidents, Incidents, LoadIncidentTypes, IncidentTypes, ConvertParseObject, DefaultErrorLogger, InitDbForDepartment, UserLogout){

    $scope.logout = function() {
        UserLogout();
        var urlLink = "login.html?department_id="+$scope.department_id;
        window.location.href = urlLink;
    };

    $scope.department_id = getHttpRequestByName('department_id');
    InitDbForDepartment($scope.department_id).then(
        function() {

            //DEBUGING

            var queryAdminRole = new Parse.Query(Parse.Object.extend('Role'));
            queryAdminRole.equalTo("name", "admin");
            queryAdminRole.first({
                success: function(adminRole) {
                    console.log("success");
                    console(adminRole);
                },
                error: function(error) {
                    console.log('Error: ');
                    console.log(error.message);
                }
            });


            //var administrators = /* Your "Administrators" role */;
            //var moderators = /* Your "Moderators" role */;
            //moderators.getRoles().add(administrators);
            //moderators.save();

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
        }, function(message) {
            console.log("Error initializing department database: ");
            console.log(error.message);
        }
    );

});
