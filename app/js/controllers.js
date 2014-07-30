'use strict';

var app = angular.module("ictApp");

app.controller('UnitsDlg', function($scope, $http){
    $scope.filter_city = 'Gilbert';
    $http.get('data/units.json').
        success(function(data){
            $scope.catalog_units = data;
        });

    $scope.filterByCity = function(city) {
        if($scope.filter_city != city) {
            $scope.filter_city = city;
        } else {
            $scope.filter_city = "";
        }
    };

    $scope.filterByType = function(type) {
        if($scope.filter_type != type) {
            $scope.filter_type = type;
        } else {
            $scope.filter_type = "";
        }
    };

    $scope.selectUnit = function(unit_name) {
        $("#units-dlg").data("tbar_selected");
    };
});

//app.directive('initButton', function() {
//    return function($scope, $element) {
//        $element.button();
//    };
//})

//var ictApp = angular.module('ictApp');
//
//ictApp.directive('sector', function() {
//    return {
//        restrict:'E'
//    };
//});
//
//
//ictApp.directive('sectorNameBtn', function() {
//    return {
//        restrict:'E',
//        transclude:true,
//        template:'Shawn loves Vickie',
//        link: function( $scope, $sectorNameBtnEl) {
//            $sectorNameBtnEl.click(function(){
//                $("#sector-name-dlg").dialog( "open" );
//            });
//        }
//    };
//});
//
//
//ictApp.directive('parBtn', function() {
//    return {
//        restrict:'E',
//        link: function( $scope, $parBtnEl) {
//            $parBtnEl.click(function(){
//                $scope.$apply(function(){
//                    $scope.haspar = true;
//                });
//                $("#par-dlg").dialog( "open" );
//            });
//        }
//    };
//});
//
//
//ictApp.directive('bnchBtn', function(){
//    return {
//        restrict:'E',
//        link:function($scope, $bnchBtnEl){
//            $scope.bnchBtnEl = $bnchBtnEl;
//            $bnchBtnEl.click(function(){
//                $scope.$apply(function(){
//                    $scope.bnch="test";
//                });
//                $("#bnch-dlg").dialog( "open" );
//            });
//        },
//        controller:function($scope) {
//            $scope.$watch('bnch',function(newVal,oldVal){
//                var str = oldVal+"->"+newVal;
//                console.log(str);
//                $scope.bnchBtnEl.find("img").attr('src', 'img/bnch_bar_red.png');
//            });
//        }
//    };
//});


