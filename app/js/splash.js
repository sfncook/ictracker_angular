'use strict';

var app = angular.module("ictApp", ['ParseServices']);

app.controller('SplashCtrl', function($scope, ParseObject, ParseQuery){

    $scope.inc_num = "";
    $scope.inc_add = "";

    $scope.clickSplashBtn = function(incident_btn) {
        localStorage.setItem('inc_num', $scope.inc_num);
        localStorage.setItem('inc_add', $scope.inc_add);
        localStorage.setItem('inc_typ', incident_btn.type);

        var urlLink = "incident_form.html?inc_num="+$scope.inc_num;
        window.location.href = urlLink;
    };

    var query = new Parse.Query(Parse.Object.extend('IncidentType'));
    ParseQuery(query, {functionToCall:'find'}).then(function(result){
//        $scope.newContact = new ParseObject(obj, ['firstName','lastName','email']);
        var data = new Array();
        for(var i=0; i<result.length; i++) {
            var obj = new ParseObject(result[i], ['type','icon','text']);
            data.push(obj);
        }
        $scope.inc_types = data;
    });

});
