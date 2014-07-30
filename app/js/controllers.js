'use strict';

var app = angular.module("ictApp");

app.factory('myCallback_svc', function($rootScope) {
    var callback_svc = {};
    callback_svc.callback=0;

    return callback_svc;
});


app.controller('TbarContainer', function($scope, $http){
    $http.get('data/initial_sectors.json').
        success(function(data){
            $scope.sectors = data;
        });

    $scope.showParDlg = function() {
        $("#par-dlg").dialog( "open" );
    }

    $scope.showSectorNameDlg = function() {
        $("#sector-name-dlg").dialog( "open" );
    }

    $scope.showBnchDlg = function() {
        $("#bnch-dlg").dialog( "open" );
    }

    $scope.showUnitsDlg = function() {
        $("#units-dlg").dialog( "open" );
    }

    $scope.showActionsDlg = function() {
        $("#actions-dlg").dialog( "open" );
    }
});

app.controller('SectorTbar', function($scope){

});

//app.directive('sector', function(myCallback_svc){
//    return  {
//        restrict:'E',
//        link:function($scope) {
//            $scope.name='[Sector]';
//            $scope.units=[];
//            $scope.openSectorNameDlg=function() {
//                console.log("openSectorNameDlg");
//            }
//        },
//        controller:function($scope, myCallback_svc){
//            $scope.openSectorNameDlg=function() {
//                console.log("openSectorNameDlg");
//            }
////            myCallback_svc.callback=function(unit){
////                console.log(unit);
////                $scope.units.push.apply(unit);
////            };
//        }
//    }
//});

app.controller('SectorNamesDlg', function($scope, $http, myCallback_svc){
    $http.get('data/sectors.json').
        success(function(data){
            $scope.catalog_sectors = data;
        });
});

app.controller('UnitsDlg', function($scope, $http, myCallback_svc){
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

    $scope.selectUnit = function(unit) {
        $("#units-dlg").data("tbar_selected");
        myCallback_svc.callback(unit);
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


