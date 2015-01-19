'use strict';

var app = angular.module("ictApp", ['ParseServices']);

app.controller('SplashCtrl', function($scope, ParseObject, ParseQuery){

    var IncidentParseObj = Parse.Object.extend('Incident');
    $scope.incidentObj = new ParseObject(new IncidentParseObj(), ['inc_number','inc_address','inc_type']);

    // Incident Type Buttons
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
    query = new Parse.Query(Parse.Object.extend('Incident'));
//    query.ascending("order");
    ParseQuery(query, {functionToCall:'find'}).then(function(result){
        var data = new Array();
        for(var i=0; i<result.length; i++) {
            var type = result[i].get("inc_type");
            type.fetch({
                success: function(type) {
                    console.log(type.get('icon')+" "+type.get('text')+" "+type.get('type'));
                }
            });
        }
//        $scope.inc_types = data;
    });

    // Respond to incident type button click
    $scope.clickSplashBtn = function(incident_btn) {
        var IncidentTypeParseObj = Parse.Object.extend("IncidentType");
        var incidentTypeParseObj = new IncidentTypeParseObj();
        incidentTypeParseObj.id = incident_btn.rawParseObjId;
        $scope.incidentObj.type = incidentTypeParseObj;
        $scope.incidentObj.save();

//        var urlLink = "incident_form.html?inc_num="+$scope.inc_num;
//        window.location.href = urlLink;
    };


});
