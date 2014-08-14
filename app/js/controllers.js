'use strict';

var app = angular.module("ictApp", ['gridster']);

app.factory('dialogSvc', function() {
    var openParDlg;
    var showSectorNameDlg;
    var showBnchDlg;
    var showUnitsDlg;
    var showActionsDlg;
    var tbar_sectors = [];

    return {
        "tbar_sectors":[]
//        getSelectedSector: function () {
//            return selectedSector;
//        }
    };
});


app.controller('TbarContainer', function($scope, dialogSvc){
    var window_width = $(window).width();
    var window_height = $(window).height();
    var tbar_width = 290;
    var tbar_height = 300;
    var header_width = 100;
    var col_count = Math.floor((window_width - header_width)/tbar_width);
    var init_row_count = Math.floor(window_height/tbar_height);
    init_row_count = Math.max(init_row_count, 3);
    var left_margin = Math.floor((window_width - (col_count*tbar_width) - header_width )/2);
    $("#tbar_container").css("padding-left", left_margin);

    $scope.tbar_sectors=dialogSvc.tbar_sectors;

    $scope.gridsterOpts = {
        columns:col_count,
        margins: [10, 10],
        outerMargin: true,
        colWidth: tbar_width,
        rowHeight: tbar_height,
        defaultSizeX: 1,
        draggable: {enabled: false},
        resizable: {enabled: false}
    };

    for(var rowi=0; rowi<init_row_count; rowi++) {
        for(var coli=0; coli<col_count; coli++) {
            var sectorName = "_";
            if(coli==col_count-1) {
                if(rowi==0) {
                    sectorName = "RESCUE";
                } else if(rowi==1) {
                    sectorName = "ReHab";
                } else if(rowi==2) {
                    sectorName = "Safety";
                }
            }
            $scope.tbar_sectors.push(new Sector(sectorName));
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
    $scope.tbar_sectors=dialogSvc.tbar_sectors;

    $scope.sector_dir_btns = [{"dialog":"N","tbar":"North"},{"dialog":"E","tbar":"East"},{"dialog":"S","tbar":"South"},{"dialog":"W","tbar":"West"}];
    $scope.sector_num_btns = ["1","2","3","4","5","6","7","8","9"];

    $http.get('data/sectors.json').
        success(function(data){
            $scope.catalog_sectors = data;
        });

    $scope.setSectorName = function(sectorName) {
        $scope.selectedSector.name=sectorName;
        $("#sector_name_dlg").dialog( "close" );
    };
    $scope.setDir = function(sector_dir) {
        $scope.selectedSector.sector_dir=sector_dir.tbar;
    };
    $scope.setNum = function(sector_num) {
        $scope.selectedSector.sector_num=sector_num;
    };

    $scope.setSectorName = function(sectorName) {
        $scope.selectedSector.name=sectorName;
        $("#sector_name_dlg").dialog( "close" );
    };

    dialogSvc.showSectorNameDlg = function(sector) {
        $scope.selectedSector = sector;
        $("#sector_name_dlg").dialog( "open" );
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

    $scope.cities = [];
    $scope.type_names = [];
    $http.get('data/units.json').
        success(function(data){
            // In order to eliminate duplicates write everything to objects
            var cities_local = [];
            for(var i = 0; i < data.length; i++) {
                var city = cities_local.putIfAbsent(data[i].city, {'name':data[i].city, 'types':[]});
                var type = city.types.putIfAbsent(data[i].type, {'city':data[i].city, 'name':data[i].type, 'units':[]});
                var unit = type.units.putIfAbsent(data[i].unit, {'city':data[i].city, 'type':data[i].type, 'name':data[i].unit});

                if( typeof data[i].default != 'undefined') {
                    $scope.selected_city = city;
                    $scope.selected_type_name = '';
                }
            }

            // Convert everything to arrays
            $scope.cities = cities_local.propertiesToArray();
            $scope.cities.forEach(function(city) {
                city.types = city.types.propertiesToArray();
                city.types.forEach(function(type) {
                    type.units= type.units.propertiesToArray();
                });
            });
        });

    $scope.selectCity = function(city) {
        $scope.selected_city = city;
    };

    $scope.selectType = function(type) {
        if( $scope.selected_type_name != type.name) {
            $scope.selected_type_name = type.name;
        } else {
            $scope.selected_type_name = '';
        }
    };

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

