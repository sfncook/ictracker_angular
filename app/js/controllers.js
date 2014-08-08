'use strict';

var app = angular.module("ictApp", ['gridster']);

//app.controller('MyCtrl', function($scope, $http){
//    $http.get('data/initial_sectors.json').
//        success(function(data){
//            $scope.sectors = data;
//        });
//
//    $scope.gridsterOpts = {
//        margins: [20, 20],
//        outerMargin: false,
//        pushing: true,
//        floating: true,
//        draggable: {
//            enabled: true
//        },
//        resizable: {
//            enabled: false,
//            handles: 'n, e, s, w, se, sw'
//        }
//    };
//
//    $scope.gridNames = [{
//        name: "Dad",
//        sizeX: 2,
//        sizeY: 1,
//        row: 0,
//        col: 0
//    }, {
//        name: "Uncle Randy",
//        sizeX: 2,
//        sizeY: 2,
//        row: 0,
//        col: 2
//    }, {
//        name: "Grandpa",
//        sizeX: 2,
//        sizeY: 1,
//        row: 2,
//        col: 1
//    }, {
//        name: "Vickie's Dad",
//        sizeX: 1,
//        sizeY: 1,
//        row: 2,
//        col: 3
//    }, {
//        name: "Mike",
//        sizeX: 1,
//        sizeY: 1,
//        row: 2,
//        col: 4
//    }];
//});

app.factory('dialogSvc', function() {
    var selectedSector = {};
    var openParDlg;
    var showSectorNameDlg;
    var showBnchDlg;
    var showUnitsDlg;
    var showActionsDlg;

    return {
        getSelectedSector: function () {
            return selectedSector;
        },
        setSelectedSector: function(value) {
            selectedSector = value;
        }
    };
});


app.controller('TbarContainer', function($scope, $http, dialogSvc){
    $http.get('data/initial_sectors.json').
        success(function(data){
            $scope.sectors = data;
        });

    $scope.gridsterOpts = {
        margins: [20, 20],
        outerMargin: false,
        pushing: true,
        floating: true,
        draggable: {
            enabled: true
        },
        resizable: {
            enabled: false,
            handles: 'n, e, s, w, se, sw'
        }
    };

    $scope.showParDlg = function(sector) {
        dialogSvc.openParDlg(sector);
    }

    $scope.showSectorNameDlg = function(sector) {
        dialogSvc.showSectorNameDlg(sector);
    }

    $scope.showBnchDlg = function(sector) {
        dialogSvc.showBnchDlg(sector);
    }

    $scope.showUnitsDlg = function(sector) {
        dialogSvc.showUnitsDlg(sector);
    }

    $scope.showActionsDlg = function(sector) {
        dialogSvc.showActionsDlg(sector);
    }

});

app.controller('SectorTbar', function($scope, dialogSvc){

});



app.controller('ParDlg', function($scope, dialogSvc){
    $scope.selectedSector = {};
    dialogSvc.openParDlg = function(sector) {
        $scope.selectedSector = sector;
        $("#par-dlg").dialog( "open" );
    }
});

app.controller('SectorNamesDlg', function($scope, $http, dialogSvc){
    var selectedSector = {};
    $http.get('data/sectors.json').
        success(function(data){
            $scope.catalog_sectors = data;
        });

    $scope.setSectorName = function(sectorName) {
        var selectedSector = dialogSvc.getSelectedSector();
        selectedSector.name=sectorName;
    };

    dialogSvc.showSectorNameDlg = function(sector) {
        selectedSector = sector;
        $("#sector-name-dlg").dialog( "open" );
    }
});

app.controller('BnchDlg', function($scope, dialogSvc){
    var selectedSector = {};
    dialogSvc.showBnchDlg = function(sector) {
        selectedSector = sector;
        $("#bnch-dlg").dialog( "open" );
    }
});

app.controller('UnitsDlg', function($scope, $http, dialogSvc){
    var selectedSector = {};

    $scope.filter_city = 'Gilbert';
    $http.get('data/units.json').
        success(function(data){
            for(var i = 0; i < data.length; i++) {
                var unit = data[i];
                unit.par = "P";
                unit.psi = "4000";
//                console.log(unit);
            }
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
        var selectedSector = dialogSvc.getSelectedSector();
        if (selectedSector.units.indexOf(unit)<0) {
            selectedSector.units.push(unit);
        }
    };

    dialogSvc.showUnitsDlg = function(sector) {
        selectedSector = sector;
        $("#units-dlg").dialog( "open" );
    }
});

app.controller('ActionsDlg', function($scope, dialogSvc){
    var selectedSector = {};
    dialogSvc.showActionsDlg = function(sector) {
        selectedSector = sector;
        $("#actions-dlg").dialog( "open" );
    }
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


