'use strict';

var app = angular.module("ictApp", ['gridster', 'ParseServices', 'TbarServices', 'DataTypes']);

function init() {
    initDialogs();
    initIncidentData();
}
function initIncidentData() {

}
function initDialogs() {
    $( ".dialog" ).dialog({
        autoOpen: false,
        modal: true
    });
    $( "#sector_name_dlg" ).dialog( "option", "width", 730 );
    $( "#par-dlg" ).dialog( "option", "width", 475 );
    $( "#bnch_dlg" ).dialog( "option", "width", 515 );
    $( "#units_dlg" ).dialog( "option", "width", 855 );
    $( "#actions_dlg" ).dialog( "option", "width", 545 );
    $( "#cmdxfer_dialog" ).dialog( "option", "width", 350 );
    $( "#upgrade_dlg" ).dialog( "option", "width", 328 );
    $( "#osr_dlg" ).dialog( "option", "width", 420 );
    $( "#objectives_dlg" ).dialog( "option", "width", 230 );
    $( "#iap_dlg" ).dialog( "option", "width", 616 );
    $( "#unit_options_dlg" ).dialog( "option", "width", 423 );
    $( "#address_dialog" ).dialog( "option", "width", 450 );
    $( "#reports_dlg" ).dialog( "option", "width", 550 );

    $(".ui-dialog .ui-dialog-titlebar-close").html("Close");

}
$( document ).ready(init);


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
    var showCmdXferDlg;
    var showOsrDlg;
    var showObjectivesDlg;
    var showIapDlg;
    var showAddressDlg;
    var showReportsDlg;

    var setOsrPerc;
    var getDispAddress;
    var setDispAddress;

    var setObjPerc;
    var setCustSvcSector;
    var estSupply;
    var setRescue;
    var setSafety;
    var setOnDeck;
    var setRehab;

    return {
    };
});


app.controller('HeaderContainer2', function($scope, $http, dialogSvc, ParseObject, ParseQuery, AddDefaultTbars, TbarSectors, AddTbar, SaveTbars, LoadDataTypes){
    var incidentObjectId = getHttpRequestByName('i');

    LoadDataTypes();

    var queryIncident = new Parse.Query(Parse.Object.extend('Incident'));
    queryIncident.equalTo("objectId", incidentObjectId);
    queryIncident.include('inc_type');
    ParseQuery(queryIncident, {functionToCall:'first', synchronous:true, relations:['sectors'],pointers:['sectorType']}).then(function(incidentObj){
        var incident = new ParseObject(incidentObj, Incident.model);
        var querySectors = incidentObj.relation("sectors").query();
        querySectors.include('sectorType');
        querySectors.find({
            success: function(sectors) {
                if(sectors.length==0) {
                    AddDefaultTbars();
                    SaveTbars();
                } else {
                    for(var i=0; i<sectors.length; i++) {
                        var sector = new ParseObject(sectors[i], Sector.model);
                        AddTbar(new ParseObject(sectors[i], Sector.model));
                    }
                }
            }
        });
        $scope.incident = incident;
    });
});

app.controller('HeaderContainer', function($scope, $interval, dialogSvc){
    $scope.osrPerc = 0;
    $scope.objPerc = 0;

    $scope.timer_text = "00:00";
    $scope.hourRollOverDone = false;
    var t0 = (new Date()).getTime();
    function updateTimer() {
        var t1 = (new Date()).getTime();
        var elapsed = parseInt(t1-t0);
        var elapsedSec = parseInt((elapsed/1000)%60);
        var elapsedMin = parseInt((elapsed/(1000*60))%60);
        var elapsedHr = parseInt((elapsed/(1000*60*60))%60);

        var secStr = (elapsedSec<10)?("0"+elapsedSec):elapsedSec;
        var minStr = (elapsedMin<10)?("0"+elapsedMin):elapsedMin;
        var hrStr = (elapsedHr<10)?("0"+elapsedHr):elapsedHr;

        var new_timer_text = "";
        if (elapsedHr>0) {
            if (!$scope.hourRollOverDone) {
                $scope.hourRollOverDone = true;
            }
            new_timer_text = hrStr+":"+minStr+":"+secStr;
        } else {
            new_timer_text = minStr+":"+secStr;
        }
        $scope.timer_text = new_timer_text;
    }
    $interval(updateTimer, 1000);

    $scope.showUnitsDlgForDispUnits = function() {
        dialogSvc.showUnitsDlgForDispUnits();
    }

    $scope.showUpgradeDlg = function() {
        dialogSvc.showUpgradeDlg();
    }

    $scope.showCmdXferDlg = function() {
        dialogSvc.showCmdXferDlg();
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

    $scope.showReportsDlg = function() {
        dialogSvc.showReportsDlg();
    }

    dialogSvc.setOsrPerc = function(perc) {
        $scope.osrPerc = perc;
    }

    dialogSvc.setObjPerc = function(perc) {
        $scope.objPerc = perc;
    }
});

app.controller('TbarContainer', function($scope, dialogSvc, GridsterOpts, TbarSectors){
    $scope.tbar_sectors=TbarSectors;
    $scope.gridsterOpts = GridsterOpts;

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

app.controller('SectorNamesDlg', function($scope, $http, dialogSvc, reportsSvc){
    $scope.selectedSector = {};
    $scope.tbar_sectors=dialogSvc.tbar_sectors;

    $scope.sector_dir_btns = [
        {"dialog":"Sub","tbar":"Sub",   "isWide":true},
        {"dialog":"N",  "tbar":"North", "isWide":false},
        {"dialog":"E",  "tbar":"East",  "isWide":false},
        {"dialog":"S",  "tbar":"South", "isWide":false},
        {"dialog":"W",  "tbar":"West",  "isWide":false}
    ];
    $scope.sector_num_btns = ["1","2","3","4","5","6","7","8","9"];

    $http.get('data/sectors.json').
        success(function(data){
            $scope.catalog_sectors = data;
        });

    $scope.selectSector = function(catalog_sector) {
        $scope.selectedSector.set('name',       catalog_sector.name);
        $scope.selectedSector.set('hasClock'  , catalog_sector.hasClock);
        $scope.selectedSector.set('hasAcctBtn', catalog_sector.hasAcctBtn);
        $scope.selectedSector.set('hasPsiBtn' , catalog_sector.hasPsiBtn);
        $scope.selectedSector.set('hasActions', catalog_sector.hasActions);

        if(catalog_sector.name=="Customer Service") {dialogSvc.setCustSvcSector();}

        reportsSvc.addEvent_title_to_sector(catalog_sector.name);

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
                var unit = type.units.putIfAbsent(data[i].unit, new CatalogUnit(data[i].unit, data[i].type, data[i].city));

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

    $scope.selectUnit = function(catalogUnit) {
        if($scope.forAcct) {
            $scope.selectedSector.set('acctUnit',catalogUnit);
            $scope.forAcct=false;
            $("#units_dlg").dialog( "close" );
        } if($scope.forDispUnits) {
            if($scope.dispatechedUnits.contains(catalogUnit)){
                $scope.dispatechedUnits.remByVal(catalogUnit);
            } else {
                $scope.dispatechedUnits.push(catalogUnit);
            }
        } else {
            var wasAdded = $scope.selectedSector.toggleUnit(catalogUnit);
            if(wasAdded) {
                if(!$scope.dispatechedUnits.contains(catalogUnit)){
                    $scope.dispatechedUnits.push(catalogUnit);
                }

                var sectorName = $scope.selectedSector.name;
                if(sectorName=="RESCUE") {
                    dialogSvc.setRescue();
                }
                if(sectorName=="Safety") {
                    dialogSvc.setSafety();
                }
                if(sectorName=="On Deck") {
                    dialogSvc.setOnDeck();
                }
                if(sectorName=="ReHab") {
                    dialogSvc.setRehab();
                }
            } else {
                $scope.dispatechedUnits.remByVal(catalogUnit);
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

        if(action.name=="Take a Line") {dialogSvc.estSupply();}
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

app.controller('CmdXferDlg', function($scope, dialogSvc){
    $scope.upgrade_primary = 0;
    $scope.upgrade_secondary = 0;

    dialogSvc.showCmdXferDlg = function() {
        $("#cmdxfer_dialog").dialog( "open" );
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

    $scope.showAddressDlg = function() {
        dialogSvc.showAddressDlg();
    }

    dialogSvc.getDispAddress = function() {
        return $scope.disp_address;
    }

    dialogSvc.setDispAddress = function(address) {
        $scope.disp_address = address;
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

app.controller('AddressDlg', function($scope, dialogSvc){

    $scope.address = '';

    dialogSvc.showAddressDlg = function() {
        $scope.address = dialogSvc.getDispAddress();
        if($scope.address=='Dispatch Address') $scope.address = '';
        $("#address_dialog").dialog( "open" );
    }

    $scope.clickOk = function() {
        var addy = $scope.address;
        if(addy=='') addy = 'Dispatch Address';
        dialogSvc.setDispAddress(addy);
        $("#address_dialog").dialog( "close" );
    }

    $scope.clickCancel = function() {
        $("#address_dialog").dialog( "close" );
    }

    $scope.clickClear = function() {
        $scope.address = "";
    }
});

app.controller('ObjectivesDlg', function($scope, dialogSvc){

    function updatePerc() {
        var count = 0;
        if($scope.obj_upgd) {count++;}
        if($scope.obj_safe) {count++;}
        if($scope.obj_estb) {count++;}
        if($scope.obj_utes) {count++;}
        if($scope.obj_vent) {count++;}
        if($scope.obj_deck) {count++;}
        if($scope.obj_pres) {count++;}
        if($scope.obj_moni) {count++;}
        if($scope.obj_salv) {count++;}
        if($scope.obj_rehb) {count++;}
        if($scope.obj_srvc) {count++;}
        var perc = Math.ceil((count*100)/11)
        dialogSvc.setObjPerc(perc);
    }

    $scope.$watch('obj_upgd', function() { updatePerc(); });
    $scope.$watch('obj_safe', function() { updatePerc(); });
    $scope.$watch('obj_estb', function() { updatePerc(); });
    $scope.$watch('obj_utes', function() { updatePerc(); });
    $scope.$watch('obj_vent', function() { updatePerc(); });
    $scope.$watch('obj_deck', function() { updatePerc(); });
    $scope.$watch('obj_pres', function() { updatePerc(); });
    $scope.$watch('obj_moni', function() { updatePerc(); });
    $scope.$watch('obj_salv', function() { updatePerc(); });
    $scope.$watch('obj_rehb', function() { updatePerc(); });
    $scope.$watch('obj_srvc', function() { updatePerc(); });

    dialogSvc.setCustSvcSector = function() {
        $scope.obj_srvc = true;
        updatePerc();
    }

    dialogSvc.estSupply = function() {
        $scope.obj_estb = true;
        updatePerc();
    }

    dialogSvc.setRescue = function() {
        $scope.obj_upgd = true;
        updatePerc();
    }

    dialogSvc.setSafety = function() {
        $scope.obj_safe = true;
        updatePerc();
    }

    dialogSvc.setOnDeck = function() {
        $scope.obj_deck = true;
        updatePerc();
    }

    dialogSvc.setRehab = function() {
        $scope.obj_rehb = true;
        updatePerc();
    }

    dialogSvc.showObjectivesDlg = function() {
        $("#objectives_dlg").dialog( "open" );
    }
});

app.controller('IapDlg', function($scope, dialogSvc){
    $scope.iap_evlc_show = false;
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

