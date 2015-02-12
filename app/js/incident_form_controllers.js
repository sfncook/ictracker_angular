'use strict';
angular.module("ictApp", ['gridster', 'DataServices', 'TbarServices', 'ActionServices', 'UnitServices', 'IncidentServices', 'ReportServices'])

    .controller('HeaderContainer2', function($scope, $http, LoadIncident, DataStore, LoadSectorTypes){
        var incidentObjectId = getHttpRequestByName('i');

        $scope.dataStore = DataStore;
        LoadIncident(incidentObjectId, $scope);
    })

    .controller('HeaderContainer', function($scope, $interval, DataStore){
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
            DataStore.showUnitsDlgForDispUnits();
        }

        $scope.showUpgradeDlg = function() {
            DataStore.showUpgradeDlg();
        }

        $scope.showCmdXferDlg = function() {
            DataStore.showCmdXferDlg();
        }

        $scope.showOsrDlg = function() {
            DataStore.showOsrDlg();
        }

        $scope.showObjectivesDlg = function() {
            DataStore.showObjectivesDlg();
        }

        $scope.showIapDlg = function() {
            DataStore.showIapDlg();
        }

        $scope.showReportsDlg = function() {
            DataStore.showReportsDlg();
        }

        DataStore.setOsrPerc = function(perc) {
            $scope.osrPerc = perc;
        }

        DataStore.setObjPerc = function(perc) {
            $scope.objPerc = perc;
        }
    })

    .controller('TbarContainer', function($scope, DataStore, GridsterOpts, TbarSectors){

        $scope.gridsterOpts = GridsterOpts;
        $scope.tbar_sectors = TbarSectors;

        $scope.showParDlg = function(sector) {
            DataStore.openParDlg(sector);
        }

        $scope.showSectorNameDlg = function(sector) {
            DataStore.showSectorNameDlg(sector);
        }

        $scope.showBnchDlg = function(sector) {
            DataStore.showBnchDlg(sector);
        }

        $scope.showUnitsDlg = function(sector) {
            DataStore.showUnitsDlg(sector);
        }

        $scope.showUnitsDlgForAcct = function(sector) {
            DataStore.showUnitsDlgForAcct(sector);
        }

        $scope.showActionsDlg = function(sector) {
            DataStore.showActionsDlg(sector);
        }

        $scope.showUnitOptionsDlg = function(unit) {
            DataStore.showUnitOptionsDlg(unit);
        }

        $scope.selectUnit = function(sector,unit) {
            sector.selectedUnit = unit;
        }

    })
    .filter('acctUnitName', function() {
        return function(acctUnit) {
            if(acctUnit) {
                return acctUnit.name;
            } else {
                return "@acct";
            }
        };
    })


    .filter('unitPar', function() {
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
    })
    .controller('ParDlg', function($scope, DataStore){
        $scope.selectedSector = {};

        DataStore.openParDlg = function(sector) {
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
            DataStore.showUnitOptionsDlg(unit);
        }
    })

    .controller('SectorNamesDlg', function($scope, $http, DataStore, reportsSvc, LoadSectorTypes, SectorTypes, CreateBlankSectorType){
        $scope.selectedSector = {};
        $scope.tbar_sectors=DataStore.tbar_sectors;

        LoadSectorTypes().then(
            function() {
                // Make all sector_types visible
                for(var i=0; i<SectorTypes.length; i++) {
                    SectorTypes[i].isVisible = true;
                }

                var orderedSectorTypes = [
                    SectorTypes.INTERIOR,       SectorTypes.SECTOR_1,       SectorTypes.ALPHA_SECTOR,       SectorTypes.SALVAGE,            SectorTypes.TRIAGE,
                    SectorTypes.VENTILATION,    SectorTypes.SECTOR_2,       SectorTypes.BRAVO_SECTOR,       SectorTypes.OVERHAUL,           SectorTypes.EXTRICATION,
                    SectorTypes.ROOF,           SectorTypes.SECTOR_3,       SectorTypes.CHARLIE_SECTOR,     SectorTypes.EVACUATION,         SectorTypes.TREATMENT,
                    SectorTypes.ON_DECK,        SectorTypes.SECTOR_4,       SectorTypes.DELTA_SECTOR,       SectorTypes.CUSTOMER_SERVICE,   SectorTypes.TRANSPORTATION,
                    SectorTypes.STAGING,        SectorTypes.SECTOR_5,       CreateBlankSectorType(),        CreateBlankSectorType(),        CreateBlankSectorType(),
                    CreateBlankSectorType(),    SectorTypes.SECTOR_6,       SectorTypes.NORTH_SECTOR,       SectorTypes.REHAB,              SectorTypes.LZ,
                    SectorTypes.IRIC,           SectorTypes.SECTOR_7,       SectorTypes.EAST_SECTOR,        SectorTypes.LOBBY,              CreateBlankSectorType(),
                    SectorTypes.RIC,            SectorTypes.SECTOR_8,       SectorTypes.SOUTH_SECTOR,       SectorTypes.RESOURCE,           CreateBlankSectorType(),
                    SectorTypes.RESCUE,         SectorTypes.SECTOR_9,       SectorTypes.WEST_SECTOR,        SectorTypes.ACCOUNTABILITY,     CreateBlankSectorType(),
                    SectorTypes.SAFETY,         SectorTypes.SECTOR_NUM

                ];

                $scope.OrderedSectorTypes = orderedSectorTypes;
            }
        );

        $scope.sector_dir_btns = [
            {"dialog":"Sub","tbar":"Sub",   "isWide":true},
            {"dialog":"N",  "tbar":"North", "isWide":false},
            {"dialog":"E",  "tbar":"East",  "isWide":false},
            {"dialog":"S",  "tbar":"South", "isWide":false},
            {"dialog":"W",  "tbar":"West",  "isWide":false}
        ];
        $scope.sector_num_btns = ["1","2","3","4","5","6","7","8","9"];

        $scope.selectSectorType = function(sectorType) {
            $scope.selectedSector.sectorType = sectorType;
            $scope.selectedSector.save();

            if(sectorType.name=="Customer Service") {DataStore.setCustSvcSector();}

            reportsSvc.addEvent_title_to_sector(sectorType.name);

            $("#sector_name_dlg").dialog( "close" );
        };
        $scope.setDir = function(sector_dir) {
            $scope.selectedSector.sector_dir=sector_dir.tbar;
        };
        $scope.setNum = function(sector_num) {
            $scope.selectedSector.sector_num=sector_num;
        };


        DataStore.showSectorNameDlg = function(sector) {
            $scope.selectedSector = sector;
            $("#sector_name_dlg").dialog( "open" );
        }
    })

    .controller('BnchDlg', function($scope, DataStore){
        var selectedSector = {};

        DataStore.showBnchDlg = function(sector) {
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

    })

    .controller('UnitsDlg', function($scope, $http, DataStore, LoadUnitTypes, UnitTypes, DefaultCity, ToggleUnitTypeForSector){
        $scope.selectedSector = {};
        $scope.dispatechedUnits = [];
        $scope.tbar_sectors=DataStore.tbar_sectors;
        $scope.forAcct=false;

        $scope.cities = new Array();
        $scope.type_names = new Array();

        LoadUnitTypes().then(
            function() {
                // In order to eliminate duplicates write everything to objects
                var cities_local = [];
                for(var i = 0; i < UnitTypes.length; i++) {
                    var unitType = UnitTypes[i];
                    var city = cities_local.putIfAbsent(unitType.city, {'name':unitType.city, 'types':[]});
                    var type = city.types.putIfAbsent(unitType.type, {'city':unitType.city, 'name':unitType.type, 'units':[]});
                    type.units.putIfAbsent(unitType.name, unitType);

                    if(city.name==DefaultCity) {
                        $scope.selected_city = city;
                        $scope.selected_type_name = '';
                    }
                }//for

                // Convert everything to arrays
                $scope.cities = cities_local.propertiesToArray();
                $scope.cities.forEach(function(city) {
                    city.types = city.types.propertiesToArray();
                    city.types.forEach(function(type) {
                        type.units= type.units.propertiesToArray();
                    });
                });
            }
        );

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

        $scope.selectUnit = function(unitType) {
            if($scope.forAcct) {
                $scope.selectedSector.set('acctUnit',unitType);
                $scope.forAcct=false;
                $("#units_dlg").dialog( "close" );
            } if($scope.forDispUnits) {
                if($scope.dispatechedUnits.contains(unitType)){
                    $scope.dispatechedUnits.remByVal(unitType);
                } else {
                    $scope.dispatechedUnits.push(unitType);
                }
            } else {
    //            var wasAdded = $scope.selectedSector.toggleUnit(unitType);
                var wasAdded = ToggleUnitTypeForSector($scope.selectedSector, unitType);
                if(wasAdded) {
                    if(!$scope.dispatechedUnits.contains(unitType)){
                        $scope.dispatechedUnits.push(unitType);
                    }

                    // Update sector.selectedUnit
                    if(!$scope.selectedSector.selectedUnit) {
                        $scope.selectedSector.selectedUnit=$scope.selectedSector.units[0];
                    }

                    var sectorName = $scope.selectedSector.name;
                    if(sectorName=="RESCUE") {
                        DataStore.setRescue();
                    }
                    if(sectorName=="Safety") {
                        DataStore.setSafety();
                    }
                    if(sectorName=="On Deck") {
                        DataStore.setOnDeck();
                    }
                    if(sectorName=="ReHab") {
                        DataStore.setRehab();
                    }
                } else {
                    $scope.dispatechedUnits.remByVal(unitType);
                }
                $("#units_dlg").dialog( "close" );
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

        DataStore.showUnitsDlg = function(sector) {
            $scope.selectedSector = sector;
            $("#units_dlg").dialog( "open" );
        }

        DataStore.showUnitsDlgForAcct = function(sector) {
            $scope.forAcct=true;
            DataStore.showUnitsDlg(sector);
        }

        DataStore.showUnitsDlgForDispUnits = function() {
            $scope.forDispUnits=true;
            DataStore.showUnitsDlg();
        }

        $('#units_dlg').bind('dialogclose', function() {
            $scope.forDispUnits=false;
            $scope.forAcct=false;
        });
    })
    .filter('getUnitPar', function() {
        return function(unitPar) {
            if(unitPar==0) {
                return "P";
            } else {
                return unitPar;
            }
        };
    })

    .controller('ActionsDlg', function($scope, $http, DataStore, LoadActionTypes, ActionTypes, ToggleActionTypeForUnit){
        $scope.selectedSector = {};
		$scope.actionTypes = ActionTypes;
		LoadActionTypes().then(
            function(){
                // In order to eliminate duplicates write everything to objects
                var action_types_local = [];
                for(var i = 0; i < ActionTypes.length; i++) {
                    var action_type = action_types_local.putIfAbsent(ActionTypes[i].category, {'name':ActionTypes[i].category, 'actions':[]});
                    var action = action_type.actions.push({name:ActionTypes[i].name, action_type:ActionTypes[i].category, is_warning:ActionTypes[i].isWarning});
                }

                // Convert everything to arrays
                $scope.catalog_action_types = action_types_local.propertiesToArray();
        });

        $scope.selectAction = function(action) {
        	console.log($scope.selectedSector.selectedUnit);
            // $scope.selectedSector.toggleAction(action);
				var wasAdded = ToggleActionTypeForUnit($scope.selectedSector.selectedUnit, action);
                if(wasAdded) {
                    if(!$scope.selectedSector.selectedUnit.actions.contains(action)){
                        $scope.selectedSector.selectedUnit.actions.push(action);
                    }
                } else {
                    $scope.selectedSector.selectedUnit.actions.remByVal(unitType);
                }
            if(action.name=="Take a Line") {DataStore.estSupply();}
        };

        DataStore.showActionsDlg = function(sector) {
            $scope.selectedSector = sector;
            $("#actions_dlg").dialog( "open" );
        }
    })

    .controller('UpgradeDlg', function($scope, DataStore){
        $scope.upgrade_primary = 0;
        $scope.upgrade_secondary = 0;

        DataStore.showUpgradeDlg = function() {
            $("#upgrade_dlg").dialog( "open" );
        }
    })

    .controller('CmdXferDlg', function($scope, DataStore){
        $scope.upgrade_primary = 0;
        $scope.upgrade_secondary = 0;

        DataStore.showCmdXferDlg = function() {
            $("#cmdxfer_dialog").dialog( "open" );
        }
    })

    .controller('OsrDlg', function($scope, DataStore){

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

        DataStore.showOsrDlg = function() {
            $("#osr_dlg").dialog( "open" );
        }

        $scope.showAddressDlg = function() {
            DataStore.showAddressDlg();
        }

        DataStore.getDispAddress = function() {
            return $scope.disp_address;
        }

        DataStore.setDispAddress = function(address) {
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
            DataStore.setOsrPerc(perc);
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

    })

    .controller('AddressDlg', function($scope, DataStore){

        $scope.address = '';

        DataStore.showAddressDlg = function() {
            $scope.address = DataStore.getDispAddress();
            if($scope.address=='Dispatch Address') $scope.address = '';
            $("#address_dialog").dialog( "open" );
        }

        $scope.clickOk = function() {
            var addy = $scope.address;
            if(addy=='') addy = 'Dispatch Address';
            DataStore.setDispAddress(addy);
            $("#address_dialog").dialog( "close" );
        }

        $scope.clickCancel = function() {
            $("#address_dialog").dialog( "close" );
        }

        $scope.clickClear = function() {
            $scope.address = "";
        }
    })

    .controller('ObjectivesDlg', function($scope, DataStore){

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
            DataStore.setObjPerc(perc);
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

        DataStore.setCustSvcSector = function() {
            $scope.obj_srvc = true;
            updatePerc();
        }

        DataStore.estSupply = function() {
            $scope.obj_estb = true;
            updatePerc();
        }

        DataStore.setRescue = function() {
            $scope.obj_upgd = true;
            updatePerc();
        }

        DataStore.setSafety = function() {
            $scope.obj_safe = true;
            updatePerc();
        }

        DataStore.setOnDeck = function() {
            $scope.obj_deck = true;
            updatePerc();
        }

        DataStore.setRehab = function() {
            $scope.obj_rehb = true;
            updatePerc();
        }

        DataStore.showObjectivesDlg = function() {
            $("#objectives_dlg").dialog( "open" );
        }
    })

    .controller('IapDlg', function($scope, DataStore){
        $scope.iap_evlc_show = false;
        DataStore.showIapDlg = function() {
            $("#iap_dlg").dialog( "open" );
        }
    })

    .controller('UnitOptionsDlg', function($scope, DataStore){
        $scope.pars = [1, 2, 3, 4, 5];
        $scope.psis = [];
        $scope.selected_unit = {};

        for(var psiValue=4500; psiValue>=0; psiValue-=100) {
            $scope.psis.push(psiValue);
        }

        DataStore.showUnitOptionsDlg = function(unit) {
            $scope.selected_unit = unit;
            $("#unit_options_dlg").dialog( "open" );
        }

        $scope.selectPar = function(par) {
            $scope.selected_unit.par = par;
            $scope.selected_unit.save();
            $("#unit_options_dlg").dialog( "close" );
        }

        $scope.selectPsi = function(psi) {
            $scope.selected_unit.psi = psi;
            $scope.selected_unit.save();
            $("#unit_options_dlg").dialog( "close" );
        }

    })

;

function initDialogs() {
    $( ".dialog" ).dialog({
        autoOpen: false,
        modal: true
    });
    $( "#sector_name_dlg" ).dialog( "option", "width", 900 );
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
$( document ).ready(initDialogs);
