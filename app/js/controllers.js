'use strict';

var app = angular.module("ictApp", ['gridster']);

app.factory('dialogSvc', function() {
    var openParDlg;
    var showSectorNameDlg;
    var showBnchDlg;
    var showUnitsDlg;
    var showActionsDlg;

    return {
//        getSelectedSector: function () {
//            return selectedSector;
//        }
    };
});


app.controller('TbarContainer', function($scope, dialogSvc){
    var window_width = $(window).width();
    var window_height = $(window).height();
    var tbar_width = 297;
    var tbar_height = 300;
    var header_width = 100;
    var col_count = Math.floor((window_width - header_width)/tbar_width);
    var init_row_count = Math.floor(window_height/tbar_height);
    init_row_count = Math.max(init_row_count, 3);
    var left_margin = Math.floor((window_width - (col_count*tbar_width) - header_width )/2);
    console.log(left_margin);
    $("#tbar_container").css("padding-left", left_margin);

    $scope.gridsterOpts = {
        columns:col_count,
        margins: [20, 20],
        outerMargin: true,
        colWidth: tbar_width,
        rowHeight: tbar_height,
        defaultSizeX: 1,
        draggable: {enabled: false},
        resizable: {enabled: false}
    };

    $scope.sectors=[];
    for(var rowi=0; rowi<init_row_count; rowi++) {
        for(var coli=0; coli<col_count; coli++) {
            var sectorName = "";
            if(coli==col_count-1) {
                if(rowi==0) {
                    sectorName = "Rescue";
                } else if(rowi==1) {
                    sectorName = "REHAB";
                } else if(rowi==2) {
                    sectorName = "Safety";
                }
            }
            $scope.sectors.push(new Sector(sectorName));
        }//for col
    }//for row

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


app.controller('ParDlg', function($scope, dialogSvc){
    $scope.selectedSector = {};
    dialogSvc.openParDlg = function(sector) {
        $scope.selectedSector = sector;
        $("#par-dlg").dialog( "open" );
    }
});

app.controller('SectorNamesDlg', function($scope, $http, dialogSvc){
    $scope.selectedSector = {};
    $http.get('data/sectors.json').
        success(function(data){
            $scope.catalog_sectors = data;
        });

    $scope.setSectorName = function(sectorName) {
        $scope.selectedSector.name=sectorName;
    };

    dialogSvc.showSectorNameDlg = function(sector) {
        $scope.selectedSector = sector;
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
    $scope.selectedSector = {};

    $scope.filter_city = 'Gilbert';
    $http.get('data/units.json').
        success(function(data){
            var units = [];
            for(var i = 0; i < data.length; i++) {
                var unit = new Unit(data[i].name, data[i].type, data[i].city);
                units.push(unit);
            }
            $scope.catalog_units = units;
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
        $scope.selectedSector.toggleUnit(unit);
    };

    dialogSvc.showUnitsDlg = function(sector) {
        $scope.selectedSector = sector;
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

