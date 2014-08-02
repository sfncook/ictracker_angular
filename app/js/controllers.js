'use strict';

var app = angular.module("ictApp", []);

app.factory('sectorCallbacks', function() {
    var selectedSector = {};
    var parSetSectorFn;

    return {
        getSelectedSector: function () {
            return selectedSector;
        },
        setSelectedSector: function(value) {
            selectedSector = value;
        },

        setParSetSectorFn: function(value) {
            parSetSectorFn = value;
        },
        setParSector: function(sector) {
            parSetSectorFn(sector);
        }
    };
});

app.controller('ParDlg', function($scope, sectorCallbacks){
    var parSetSectorFn = function(sector) {
        $scope.parSector = sector;
    };
    sectorCallbacks.setParSetSectorFn(parSetSectorFn);
});

var gridster;
function initGridster() {
    gridster = $("#tbar_container").gridster({
        widget_base_dimensions: [278, 275],
        widget_margins: [5, 5],
        autogrow_cols: false
    }).data('gridster');
    gridster.disable();
}

var newTbars = [];
app.controller('TbarContainer', function($scope, $http, sectorCallbacks){
    $http.get('data/initial_sectors.json').
        success(function(data){
            $scope.sectors = data;
        });

    initGridster();
    $scope.$watchCollection('sectors', function(newValue, oldValue){
        if(typeof newValue!='undefined') {
            newTbars = newTbars.concat(newValue);
            console.log(newValue);
            //This ensures we fire *after* the DOM is updated
            $scope.$evalAsync(function() {
                var tbar;
                for (tbar in newTbars) {
                    console.log(tbar);
                    gridster.add_widget.apply(gridster, [tbar, 1, 1]);
                }
            });
        }

    });

    $scope.showParDlg = function(sector) {
        sectorCallbacks.setParSector(sector);
        $("#par-dlg").dialog( "open" );
    }

    $scope.showSectorNameDlg = function(sector) {
        sectorCallbacks.setSelectedSector(sector);
        $("#sector-name-dlg").dialog( "open" );
    }

    $scope.showBnchDlg = function() {
        $("#bnch-dlg").dialog( "open" );
    }

    $scope.showUnitsDlg = function(sector) {
        sectorCallbacks.setSelectedSector(sector);
        $("#units-dlg").dialog( "open" );
    }

    $scope.showActionsDlg = function() {
        $("#actions-dlg").dialog( "open" );
    }

});

app.controller('SectorTbar', function($scope, sectorCallbacks){

});


app.controller('SectorNamesDlg', function($scope, $http, sectorCallbacks){
    $http.get('data/sectors.json').
        success(function(data){
            $scope.catalog_sectors = data;
        });

    $scope.setSectorName = function(sectorName) {
        var selectedSector = sectorCallbacks.getSelectedSector();
        selectedSector.name=sectorName;
    };
});

app.controller('UnitsDlg', function($scope, $http, sectorCallbacks){
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
        var selectedSector = sectorCallbacks.getSelectedSector();
        if (selectedSector.units.indexOf(unit)<0) {
            selectedSector.units.push(unit);
        }
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


