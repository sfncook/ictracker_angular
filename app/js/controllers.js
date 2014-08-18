'use strict';

var app = angular.module("ictApp", ['gridster']);

app.factory('dialogSvc', function() {
    var openParDlg;
    var showSectorNameDlg;
    var showBnchDlg;
    var showUnitsDlg;
    var showUnitsDlgForAcct;
    var showUnitsDlgForDispUnits;
    var showActionsDlg;
    var showUnitOptionsDlg;
    var showUpgradeDlg;
    var showOsrDlg;
    var showObjectivesDlg;
    var showIapDlg;

    var setOsrPerc;

    var tbar_sectors = [];

    return {
        "tbar_sectors":[]
//        getSelectedSector: function () {
//            return selectedSector;
//        }
    };
});



app.controller('HeaderContainer', function($scope, dialogSvc){
    $scope.osrPerc = 0;
    $scope.manyOsr = 0;
    $scope.showUnitsDlgForDispUnits = function() {
        dialogSvc.showUnitsDlgForDispUnits();
    }

    $scope.showUpgradeDlg = function() {
        dialogSvc.showUpgradeDlg();
    }

    $scope.showOsrDlg = function() {
        dialogSvc.showOsrDlg();
    }

    $scope.showObjectivesDlg = function() {
        dialogSvc.showObjectivesDlg();
    }

    $scope.showIapDlg = function() {
        dialogSvc.showIapDlg();
    }

    dialogSvc.setOsrPerc = function(perc) {
        $scope.osrPerc = perc;
    }
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
            var sector = new Sector("_");
            if(coli==col_count-1) {
                if(rowi==0) {
                    sector.name = "RESCUE";
                    sector.hasClock = true;
                    sector.hasAcctBtn = true;
                    sector.hasPsiBtn = true;
                    sector.hasActions = true;
                } else if(rowi==1) {
                    sector.name = "ReHab";
                    sector.hasClock = false;
                    sector.hasAcctBtn = false;
                    sector.hasPsiBtn = false;
                    sector.hasActions = false;
                } else if(rowi==2) {
                    sector.name = "Safety";
                    sector.hasClock = true;
                    sector.hasAcctBtn = true;
                    sector.hasPsiBtn = true;
                    sector.hasActions = true;
                }
            }
            $scope.tbar_sectors.push(sector);
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

    $scope.showUnitsDlgForAcct = function(sector) {
        dialogSvc.showUnitsDlgForAcct(sector);
    }

    $scope.showActionsDlg = function(sector) {
        dialogSvc.showActionsDlg(sector);
    }

    $scope.showUnitOptionsDlg = function(unit) {
        dialogSvc.showUnitOptionsDlg(unit);
    }

    $scope.selectUnit = function(sector,unit) {
        sector.selectUnit(unit);
    }
});


app.filter('unitPar', function() {
    return function(input, unitPar) {
        if(unitPar!='P') {
            unitPar = parseInt(unitPar);
            for (var i=0; i<unitPar; i++)
                input.push(i);
        } else {
            input.push(1);
        }
        return input;
    };
});
app.controller('ParDlg', function($scope, dialogSvc){
    $scope.selectedSector = {};

    dialogSvc.openParDlg = function(sector) {
        $scope.selectedSector = sector;
        $("#par-dlg").dialog( "open" );
    }

    $scope.selectPersonPar = function(unit, i) {
        unit.setPar(i);

        var allUnitsHavePar = true;
        for(var i=0; i<$scope.selectedSector.units.length; i++) {
            allUnitsHavePar = allUnitsHavePar&$scope.selectedSector.units[i].hasPar;
        }
        $scope.selectedSector.hasPar = allUnitsHavePar;
    }

    $scope.selectUnitPar = function(unit) {
        unit.toggleHasPar();

        var allUnitsHavePar = true;
        for(var i=0; i<$scope.selectedSector.units.length; i++) {
            allUnitsHavePar = allUnitsHavePar&$scope.selectedSector.units[i].hasPar;
        }
        $scope.selectedSector.hasPar = allUnitsHavePar;
    }

    $scope.selectSectorPar = function() {
        $scope.selectedSector.toggleHasPar();
        for(var i=0; i<$scope.selectedSector.units.length; i++) {
            $scope.selectedSector.units[i].setHasPar($scope.selectedSector.hasPar);
        }
    }

    $scope.showUnitOptionsDlg = function(unit) {
        dialogSvc.showUnitOptionsDlg(unit);
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

    $scope.selectSector = function(catalog_sector) {
        $scope.selectedSector.name      =catalog_sector.name;
        $scope.selectedSector.hasClock  =catalog_sector.hasClock;
        $scope.selectedSector.hasAcctBtn=catalog_sector.hasAcctBtn;
        $scope.selectedSector.hasPsiBtn =catalog_sector.hasPsiBtn;
        $scope.selectedSector.hasActions=catalog_sector.hasActions;

        $("#sector_name_dlg").dialog( "close" );
    };
    $scope.setDir = function(sector_dir) {
        $scope.selectedSector.sector_dir=sector_dir.tbar;
    };
    $scope.setNum = function(sector_num) {
        $scope.selectedSector.sector_num=sector_num;
    };


    dialogSvc.showSectorNameDlg = function(sector) {
        $scope.selectedSector = sector;
        $("#sector_name_dlg").dialog( "open" );
    }
});

app.controller('BnchDlg', function($scope, dialogSvc){
    var selectedSector = {};

    dialogSvc.showBnchDlg = function(sector) {
        $scope.selectedSector = sector;
        $("#bnch_dlg").dialog( "open" );
    }

    $scope.selectBnch = function(bnch) {
        $scope.selectedSector.toggleBnch(bnch);
    }

    $scope.selectUnablePrimary = function() {
        $scope.selectedSector.toggleUnablePrimary();
    }
    $scope.selectUnableSecondary = function() {
        $scope.selectedSector.toggleUnableSecondary();
    }

});

app.controller('UnitsDlg', function($scope, $http, dialogSvc){
    $scope.selectedSector = {};
    $scope.dispatechedUnits = [];
    $scope.tbar_sectors=dialogSvc.tbar_sectors;
    $scope.forAcct=false;

    $scope.cities = [];
    $scope.type_names = [];
    $http.get('data/units.json').
        success(function(data){
            // In order to eliminate duplicates write everything to objects
            var cities_local = [];
            for(var i = 0; i < data.length; i++) {
                var city = cities_local.putIfAbsent(data[i].city, {'name':data[i].city, 'types':[]});
                var type = city.types.putIfAbsent(data[i].type, {'city':data[i].city, 'name':data[i].type, 'units':[]});
                var unit = type.units.putIfAbsent(data[i].unit, new Unit(data[i].unit, data[i].type, data[i].city));

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

    $scope.selectUnit = function(unit) {
        if($scope.forAcct) {
            $scope.selectedSector.setAcctUnit(unit);
            $scope.forAcct=false;
            $("#units_dlg").dialog( "close" );
        } if($scope.forDispUnits) {
            if($scope.dispatechedUnits.contains(unit)){
                $scope.dispatechedUnits.remByVal(unit);
            } else {
                $scope.dispatechedUnits.push(unit);
            }
        } else {
            var wasAdded = $scope.selectedSector.toggleUnit(unit);
            if(wasAdded) {
                if(!$scope.dispatechedUnits.contains(unit)){
                    $scope.dispatechedUnits.push(unit);
                }
            } else {
                $scope.dispatechedUnits.remByVal(unit);
            }
        }
    };

    $scope.selectDispatchedUnit = function(unit) {
        if($scope.forAcct) {
            $scope.selectedSector.setAcctUnit(unit);
            $scope.forAcct=false;
            $("#units_dlg").dialog( "close" );
        } else {
            $scope.selectedSector.addUnit(unit);
        }
    };

    dialogSvc.showUnitsDlg = function(sector) {
        $scope.selectedSector = sector;
        $("#units_dlg").dialog( "open" );
    }

    dialogSvc.showUnitsDlgForAcct = function(sector) {
        $scope.forAcct=true;
        dialogSvc.showUnitsDlg(sector);
    }

    dialogSvc.showUnitsDlgForDispUnits = function() {
        $scope.forDispUnits=true;
        dialogSvc.showUnitsDlg();
    }

    $('#units_dlg').bind('dialogclose', function() {
        $scope.forDispUnits=false;
        $scope.forAcct=false;
    });
});

app.controller('ActionsDlg', function($scope, $http, dialogSvc){
    $scope.selectedSector = {};
    $scope.catalog_action_types = [];

    $http.get('data/actions.json').
        success(function(data){
            // In order to eliminate duplicates write everything to objects
            var action_types_local = [];
            for(var i = 0; i < data.length; i++) {
                var action_type = action_types_local.putIfAbsent(data[i].action_type, {'name':data[i].action_type, 'actions':[]});
                var action = action_type.actions.push(new Action(data[i].name, data[i].action_type, data[i].is_warning));
            }

            // Convert everything to arrays
            $scope.catalog_action_types = action_types_local.propertiesToArray();
        });

    $scope.selectAction = function(action) {
        $scope.selectedSector.toggleAction(action);
    };

    dialogSvc.showActionsDlg = function(sector) {
        $scope.selectedSector = sector;
        $("#actions_dlg").dialog( "open" );
    }
});

app.controller('UpgradeDlg', function($scope, dialogSvc){
    $scope.upgrade_primary = 0;
    $scope.upgrade_secondary = 0;

    dialogSvc.showUpgradeDlg = function() {
        $("#upgrade_dlg").dialog( "open" );
    }
});

app.controller('OsrDlg', function($scope, dialogSvc){
    
    $scope.unit_osr = false;
    $scope.address_left_osr = false;
    $scope.occupancy_osr = false;
    $scope.construction_osr = false;
    $scope.conditions_osr = false;
    $scope.assumecmd_osr = false;
    $scope.location_osr = false;
    $scope.mode_osr = false;
    $scope.attach_line = false;
    $scope.water_supply = false;
    $scope.iric_osr = false;
    $scope.acct_osr = false;

    $scope.disp_address = 'Dispatch Address';
    $scope.type_of_bldg = 'Type of building';
    $scope.num_floors = 'Number of floors';
    $scope.size_building = 'Size of building';
    $scope.basement = 0;
    $scope.construction = 'Construction type';
    $scope.roof = 'Roof';
    $scope.conditions = 'Conditions';
    $scope.location = 0;
    $scope.strategy = 0;

    dialogSvc.showOsrDlg = function() {
        $("#osr_dlg").dialog( "open" );
    }

    function updatePerc() {
        var count = 0;
        if($scope.unit_osr        ) {count++;}
        if($scope.address_left_osr) {count++;}
        if($scope.occupancy_osr   ) {count++;}
        if($scope.construction_osr) {count++;}
        if($scope.conditions_osr  ) {count++;}
        if($scope.assumecmd_osr   ) {count++;}
        if($scope.location_osr    ) {count++;}
        if($scope.mode_osr        ) {count++;}
        if($scope.attach_line     ) {count++;}
        if($scope.water_supply    ) {count++;}
        if($scope.iric_osr        ) {count++;}
        if($scope.acct_osr        ) {count++;}
        var perc = Math.ceil((count*100)/12)
        dialogSvc.setOsrPerc(perc);
    }

    $scope.$watch('unit_osr',           function() { updatePerc(); });
    $scope.$watch('address_left_osr',   function() { updatePerc(); });
    $scope.$watch('occupancy_osr',      function() { updatePerc(); });
    $scope.$watch('construction_osr ',  function() { updatePerc(); });
    $scope.$watch('conditions_osr',     function() { updatePerc(); });
    $scope.$watch('assumecmd_osr',      function() { updatePerc(); });
    $scope.$watch('location_osr',       function() { updatePerc(); });
    $scope.$watch('mode_osr',           function() { updatePerc(); });
    $scope.$watch('attach_line',        function() { updatePerc(); });
    $scope.$watch('water_supply',       function() { updatePerc(); });
    $scope.$watch('iric_osr',           function() { updatePerc(); });
    $scope.$watch('acct_osr',           function() { updatePerc(); });

    $scope.$watch('type_of_bldg',       function(newVal) { $scope.occupancy_osr = newVal!='Type of building';       updatePerc(); });
    $scope.$watch('construction',       function(newVal) { $scope.construction_osr = newVal!='Construction type';   updatePerc(); });
    $scope.$watch('conditions',         function(newVal) { $scope.conditions_osr = newVal!='Conditions';            updatePerc(); });
    $scope.$watch('location',           function(newVal) { $scope.location_osr = newVal>0;                          updatePerc(); });
    $scope.$watch('strategy',           function(newVal) { $scope.mode_osr = newVal>0;                              updatePerc(); });

});

app.controller('ObjectivesDlg', function($scope, dialogSvc){
    //TODO: Toggle buttons on click
    dialogSvc.showObjectivesDlg = function() {
        $("#objectives_dlg").dialog( "open" );
    }
});

app.controller('IapDlg', function($scope, dialogSvc){
    //TODO: Toggle buttons on click
    dialogSvc.showIapDlg = function() {
        $("#iap_dlg").dialog( "open" );
    }
});

app.controller('UnitOptionsDlg', function($scope, dialogSvc){
    $scope.pars = [1, 2, 3, 4, 5];
    $scope.psis = [];
    $scope.selected_unit = {};

    for(var psiValue=4500; psiValue>=0; psiValue-=100) {
        $scope.psis.push(psiValue);
    }

    dialogSvc.showUnitOptionsDlg = function(unit) {
        $scope.selected_unit = unit;
        $("#unit_options_dlg").dialog( "open" );
    }

    $scope.selectPar = function(par) {
        $scope.selected_unit.par = par;
        $("#unit_options_dlg").dialog( "close" );
    }

    $scope.selectPsi = function(psi) {
        $scope.selected_unit.psi = psi;
        $("#unit_options_dlg").dialog( "close" );
    }

});

