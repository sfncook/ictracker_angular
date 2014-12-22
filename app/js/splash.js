'use strict';

var app = angular.module("ictApp", []);

app.controller('SplashCtrl', function($scope, $http){

    $scope.inc_num = "";
    $scope.inc_add = "";

    $scope.clickSplashBtn = function(incident_btn) {
        localStorage.setItem('inc_num', $scope.inc_num);
        localStorage.setItem('inc_add', $scope.inc_add);
        localStorage.setItem('inc_typ', incident_btn.type);

        var urlLink = "incident_form.html?inc_num="+$scope.inc_num;
        window.location.href = urlLink;
    };

    $http.get('data/inc_types.json').
        success(function(data){
            $scope.inc_types = data;
        });

});
