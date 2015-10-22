'use strict';

angular.module("SplashController", ['DataServices', 'IncidentServices', 'UserServices', 'DepartmentServices'])
    .run(function(IsLoggedIn, InitDatabase, ResetSavedDepartment) {
        InitDatabase();

        if(!IsLoggedIn()){
            ResetSavedDepartment();
            var urlLink = "login.html";
            window.location.href = urlLink;
        }
    })

    .controller('SplashCtrl', function($scope, $interval, LoadAllIncidents, Incidents, LoadIncidentTypes, IncidentTypes, ConvertParseObject, DefaultErrorLogger, InitDbForDepartment, UserLogout, IsLoggedIn, ResetSavedDepartment, DataStore){
        $scope.dataStore = DataStore;

        if(!IsLoggedIn()) {
            console.log("Not logged in. Redirecting to login.html");
            ResetSavedDepartment();
            var urlLink = "login.html";
            window.location.href = urlLink;
        }

        LoadIncidentTypes().then(function(incidentTypes){
            console.log(incidentTypes);
            $scope.incidentTypes = IncidentTypes;
        });

        LoadAllIncidents().then(function(){
            $scope.incident_list = Incidents;
            function hideLoadingSplash() {
                $scope.dataStore.loadSuccess = true;
                $scope.dataStore.waitingToLoad = false;
            }
            $interval(hideLoadingSplash, 1000);
        });

        var IncidentParseObj = Parse.Object.extend('Incident');
        $scope.incidentObj = new IncidentParseObj();
        ConvertParseObject($scope.incidentObj, INCIDENT_DEF);

        $scope.userLogout = function() {
            UserLogout();
            var urlLink = "login.html";
            window.location.href = urlLink;
        };

        $scope.redirectAdmin = function() {
            var urlLink = "admin_user.html";
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
                //console.log(incidentObj);
                //ConvertParseObject(incidentObj, INCIDENT_DEF);
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
                        LoadAllIncidents();
                    },
                    error: function(myObject, error) {
                        console.log("Error:"+error);
                        LoadAllIncidents();
                    }
                });
            }
        };
    })

    .controller('LoadingSplashDlg', function($scope, DataStore){
        $scope.dataStore = DataStore;
    })
;
