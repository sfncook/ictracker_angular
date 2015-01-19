'use strict';

var app = angular.module("ictApp", ['ParseServices']);

function fetchTypeForIncident(incident, $scope) {
    var type = incident.inc_type;
    if(type) {
        type.fetch({
            success: function(type) {
                $scope.$apply(function(){
//                console.log(incident.inc_number+' - '+ type.get('icon')+" "+type.get('text')+" "+type.get('type'));
                    incident.inc_type_text = type.get('text');
                });
            }
        });
    }
}

function loadIncidentList($scope, ParseObject, ParseQuery) {
    // reset list
    $scope.incident_list = new Array();

    var query = new Parse.Query(Parse.Object.extend('Incident'));
    ParseQuery(query, {functionToCall:'find'}).then(function(result){
        var data = new Array();
        for(var i=0; i<result.length; i++) {

            var incident = new ParseObject(result[i], ['inc_number','inc_address','inc_type']);
            incident.rawParseObj = result[i];
            fetchTypeForIncident(incident, $scope);

            data.push(incident);
        }
        $scope.incident_list = data;
    });
}

app.controller('SplashCtrl', function($scope, ParseObject, ParseQuery){

    var IncidentParseObj = Parse.Object.extend('Incident');
    $scope.incidentObj = new ParseObject(new IncidentParseObj(), ['inc_number','inc_address','inc_type']);

    // Incident Types
    $scope.inc_types = new Array();
    var query = new Parse.Query(Parse.Object.extend('IncidentType'));
    query.ascending("order");
    ParseQuery(query, {functionToCall:'find'}).then(function(result){
        var data = new Array();
        for(var i=0; i<result.length; i++) {
            var obj = new ParseObject(result[i], ['nameLong','nameShort','icon']);
            obj.rawParseObjId = result[i].id;
            data.push(obj);
        }
        $scope.inc_types = data;
    });

    // Load incident list
    loadIncidentList($scope, ParseObject, ParseQuery);

    // Respond to incident type button click
    $scope.clickIncidentTypeBtn = function(incidentType) {
        var IncidentTypeParseObj = Parse.Object.extend("IncidentType");
        var incidentTypeParseObj = new IncidentTypeParseObj();
        incidentTypeParseObj.id = incidentType.rawParseObjId;
        $scope.incidentObj.type = incidentTypeParseObj;

        // Default value for inc_number
        if(!$scope.incidentObj.inc_number) {
            $scope.incidentObj.inc_number = "[Incident Number]"
        }

        $scope.incidentObj.save();

//        var urlLink = "incident_form.html?inc_num="+$scope.incidentObj.inc_number;
//        window.location.href = urlLink;
    };


    $scope.loadIncident = function(incident) {
    };

    $scope.deleIncident = function(incident) {
        var response = confirm("Are you sure you want to delete incident "+incident.inc_number+"?");
        if (response == true) {
            incident.rawParseObj.destroy({
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
