'use strict';

angular.module("SplashController", ['IncidentServices', 'UserServices'])

    .run(function(InitAdapter, IsLoggedIn) {
        InitAdapter();

        if(!IsLoggedIn()) {
            var urlLink = "login.html"+document.location.search;
            window.location.href = urlLink;
        }
    })

    .controller('SplashCtrl', function($scope, LoadIncidentTypes, LoadAllIncidents){

        $scope.incidentObj = {};
        $scope.loadSuccess = false;

        LoadIncidentTypes().then(
            function(obj){
                //console.log("IncidentType findAll success:", obj);
                $scope.incidentTypes = obj;
            },
            function(error){
                console.log("SplashServices - IncidentType findAll error:", error);
            }
        );

        LoadAllIncidents().then(
            function(obj) {
                //console.log("SplashServices LoadAllIncidents.then()");
                $scope.incident_list = obj;
                $scope.loadSuccess = true;
            }
        );

        $scope.loadIncident = function(incidentId) {
            var argsStr = "i="+incidentId;
            var adapter = getHttpRequestByName('adapter');
            if(adapter) {
                argsStr = argsStr+"&adapter="+adapter;
            }
            var urlLink = "incident_form.html?"+argsStr;
            window.location.href = urlLink;
        };


        //Incident.findAll().then(
        //    function(obj){
        //        console.log("Incident findAll success:", obj);
        //        $scope.incident_list = obj;
        //        $scope.loadSuccess = true;
        //    },
        //    function(error){
        //        console.log("Incident findAll error:", error);
        //    }
        //);
        //
        //Incident.find('gFGa4HMohQ').then(function(incident){
        //        IncidentType.find(incident.incidentType.objectId).then(
        //            function(incidentType){
        //                console.log("Incident find IncidentType success:", incidentType);
        //                incident.incidentType.incidentType = incidentType;
        //            },
        //            function(error){
        //                console.log("Incident find IncidentType error:", error);
        //            }
        //        )
        //    });

        //LoadIncidentTypes().then(function(){
        //    $scope.incidentTypes = IncidentTypes;
        //    $scope.$apply();
        //});
        //
        //LoadAllIncidents($scope).then(function(){
        //    $scope.incident_list = Incidents;
        //    $scope.$apply();
        //});
        //
        //var IncidentParseObj = Parse.Object.extend('Incident');
        //$scope.incidentObj = new IncidentParseObj();
        //ConvertParseObject($scope.incidentObj, INCIDENT_DEF);
        //
        //$scope.userLogout = function() {
        //    UserLogout();
        //    var urlLink = "login.html";
        //    window.location.href = urlLink;
        //};
        //
        //$scope.redirectAdmin = function() {
        //    var urlLink = "admin_user.html";
        //    window.location.href = urlLink;
        //};
        //
        //// Respond to incident type button click
        //$scope.createAndLoadNewIncident = function(incidentType) {
        //    $scope.incidentObj.incidentType = incidentType;
        //
        //    // Default value for inc_number
        //    if(!$scope.incidentObj.inc_number) {
        //        $scope.incidentObj.inc_number = "[Incident Number]"
        //    }
        //
        //    $scope.incidentObj.save(null, DefaultErrorLogger).then(function(incidentObj) {
        //        //console.log(incidentObj);
        //        //ConvertParseObject(incidentObj, INCIDENT_DEF);
        //        $scope.loadIncident(incidentObj.id);
        //    }, function(error) {
        //        console.log("Error saving new incident: "+error);
        //    });;
        //};
        //
        //
        //$scope.loadIncident = function(incidentId) {
        //    var urlLink = "incident_form.html?i="+incidentId;
        //    window.location.href = urlLink;
        //};
        //
        //$scope.deleIncident = function(incident) {
        //    var response = confirm("Are you sure you want to delete incident "+incident.inc_number+"?");
        //    if (response == true) {
        //        incident.destroy({
        //            success: function(myObject) {
        //                LoadAllIncidents($scope);
        //            },
        //            error: function(myObject, error) {
        //                console.log("Error:"+error);
        //                LoadAllIncidents($scope);
        //            }
        //        });
        //    }
        //};
    })
;
