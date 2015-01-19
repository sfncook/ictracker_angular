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
            var obj = new ParseObject(result[i], ['type','icon','text']);
            obj.rawParseObjId = result[i].id;
            data.push(obj);
        }
        $scope.inc_types = data;
    });

    // Previous Incidents List
    $scope.incident_list = new Array();
    query = new Parse.Query(Parse.Object.extend('Incident'));
//    query.ascending("order");
    ParseQuery(query, {functionToCall:'find'}).then(function(result){
        var data = new Array();
        for(var i=0; i<result.length; i++) {

            var incident = new ParseObject(result[i], ['inc_number','inc_address','inc_type']);
            fetchTypeForIncident(incident, $scope);

            data.push(incident);
        }
        $scope.incident_list = data;
    });

    // Respond to incident type button click
    $scope.clickSplashBtn = function(incident_btn) {
        var IncidentTypeParseObj = Parse.Object.extend("IncidentType");
        var incidentTypeParseObj = new IncidentTypeParseObj();
        incidentTypeParseObj.id = incident_btn.rawParseObjId;
        $scope.incidentObj.type = incidentTypeParseObj;

        // Default value for inc_number
        if(!$scope.incidentObj.inc_number) {
            $scope.incidentObj.inc_number = "[Incident Number]"
        }

        $scope.incidentObj.save();

//        var urlLink = "incident_form.html?inc_num="+$scope.inc_num;
//        window.location.href = urlLink;
    };


});
