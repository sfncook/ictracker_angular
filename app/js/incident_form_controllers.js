'use strict';

angular.module("ictApp", ['gridster', 'DataServices', 'TbarServices', 'ActionServices', 'UnitServices', 'IncidentServices', 'ReportServices', 'IapServices', 'BranchServices', 'UserServices'])

    .controller('HeaderContainer2', function($scope, $http, LoadIncident, DataStore, LoadSectorTypes, LoadIAPForIncident){
        var incidentObjectId = getHttpRequestByName('i');

        $scope.dataStore = DataStore;
        LoadIncident(incidentObjectId, $scope);
        //LoadIAPForIncident($scope, DataStore.incident);
        $scope.showIncInfoDlg = function() {
            DataStore.showIncInfoDlg();
        }
        $scope.showStrategyDlg = function() {
            DataStore.showStrategyDlg();
        }
    })

    .controller('HeaderContainer', function($scope, $interval, DataStore, UserLogout){
        $scope.osrPerc = 0;
        $scope.objPerc = 0;

        $scope.showUnitsDlgForDispUnits = function() {
            DataStore.showUnitsDlgForDispUnits();
        }

        $scope.showBranchDlg = function() {
            //DataStore.showBranchDlg();
            console.log("Branch clicked");
            Parse.Cloud.run('incidentDataAll', { incidentObjectId: '0wyWB7SCst' }, {
                success: function(incidentData) {
                    console.log("success");
                    //console.log(incidentData);
                    var fromParse = JSON.parse(incidentData);
                    console.log(fromParse);
                },
                error: function(error) {
                    console.log("error");
                    console.log(error);
                }
            });
        }

        $scope.showCmdXferDlg = function() {
            DataStore.showCmdXferDlg();
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

        $scope.userLogout = function() {
            UserLogout();
            var urlLink = "login.html";
            window.location.href = urlLink;
        }
    })

    .controller('TbarContainer', function($scope, DataStore, GridsterOpts, TbarSectors, DoesSectorHavePar){

        $scope.openMaydayDlg = function () {
            console.log("click TbarContainer");
            $("#mayday_dlg").dialog("open");
        }

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

        $scope.doesSectorHavePar = DoesSectorHavePar;

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
    .controller('ParDlg', function($scope, DataStore, DoesSectorHavePar, ReportFunctions, DefaultErrorLogger){
        $scope.selectedSector = {};

        DataStore.openParDlg = function(sector) {
            $scope.selectedSector = sector;
            $("#par-dlg").dialog( "open" );
        }

        $scope.selectPersonPar = function(unit, i) {
            if(unit.manyPar>=i) {
                unit.manyPar = i-1;
            } else {
                unit.manyPar = i;
                ReportFunctions.addEvent_person_has_par($scope.selectedSector, unit);
            }
            unit.save(null, DefaultErrorLogger);
        }

        $scope.selectUnitPar = function(unit) {
            if(unit.manyPar == unit.par) {
                unit.manyPar = 0;
            } else {
                unit.manyPar = unit.par;
            }

            if(unit.manyPar == unit.par) {
                ReportFunctions.addEvent_unit_has_par($scope.selectedSector, unit);
            }

            unit.save(null, DefaultErrorLogger);
        }

        $scope.selectSectorPar = function() {
            var selectedSector = $scope.selectedSector;
            if(DoesSectorHavePar(selectedSector)) {
                for(var i=0; i<selectedSector.units.length; i++) {
                    var unit = selectedSector.units[i];
                    unit.manyPar = 0;
                }
            } else {
                for(var i=0; i<selectedSector.units.length; i++) {
                    var unit = selectedSector.units[i];
                    unit.manyPar = unit.par;
                }
                ReportFunctions.addEvent_sector_has_par($scope.selectedSector);
            }

            for(var i=0; i<selectedSector.units.length; i++) {
                var unit = selectedSector.units[i];
                unit.save(null, DefaultErrorLogger);
            }
        }

        $scope.showUnitOptionsDlg = function(unit) {
            DataStore.showUnitOptionsDlg(unit);
        }

        $scope.doesSectorHavePar = DoesSectorHavePar;
    })

    .controller('SectorNamesDlg', function($scope, $http, DataStore, ReportFunctions, LoadSectorTypes, SectorTypes, CreateBlankSectorType, DefaultErrorLogger){
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
            $scope.selectedSector.save(null, DefaultErrorLogger);

            if(sectorType.name=="Customer Service") {DataStore.setCustSvcSector();}

            ReportFunctions.addEvent_title_to_sector($scope.selectedSector);

            $("#sector_name_dlg").dialog( "close" );
        };
        $scope.setDir = function(sector_dir) {
            $scope.selectedSector.direction=sector_dir.tbar;
            $scope.selectedSector.save(null, DefaultErrorLogger);
        };
        $scope.setNum = function(sector_num) {
            $scope.selectedSector.number=sector_num;
            $scope.selectedSector.save(null, DefaultErrorLogger);
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

    .controller('UnitsDlg', function($scope, $http, DataStore, LoadUnitTypes, UnitTypes, DefaultCity, ToggleUnitTypeForSector, ReportFunctions){
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
                $scope.selectedSector.acctUnit = unitType;
                ReportFunctions.addEvent_unitType_to_acct($scope.selectedSector, unitType);
                $scope.forAcct=false;
                $("#units_dlg").dialog( "close" );
                $scope.selectedSector.save(null, {
                    error: function(error) {
                        console.log('Failed to $scope.selectedSector.save() for acctUnit, with error code: ' + error.message);
                    }
                });
            } else if($scope.forDispUnits) {
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

    .controller('ActionsDlg', function($scope, DataStore, LoadActionTypes, ActionTypes, ToggleActionTypeForUnit, ReportFunctions){
        $scope.selectedSector = {};
        LoadActionTypes();
        $scope.actionTypes = ActionTypes;

        $scope.selectAction = function(actionType) {
            ToggleActionTypeForUnit($scope.selectedSector.selectedUnit, actionType);
            ReportFunctions.addEvent_action_to_unit($scope.selectedSector, $scope.selectedSector.selectedUnit, actionType);
//            if(actionType.name=="Take a Line") {DataStore.estSupply();}
        };

        $scope.getActionTypeCategories = function() {
            var categoriesMap = {};
            for(var i=0; i<ActionTypes.length; i++) {
                var actionType = ActionTypes[i];
                categoriesMap[actionType.category] = actionType;
            }
            return Object.keys(categoriesMap);
        };

        DataStore.showActionsDlg = function(sector) {
            $scope.selectedSector = sector;
            $("#actions_dlg").dialog( "open" );
        }

        $scope.unitContainsActionType = function (unit, actionTypeSrc) {
            if(unit && unit.actionsArr) {
                for(var i=0; i<unit.actionsArr.length; i++) {
                    var actionTypeDst = unit.actionsArr[i];
                    if(actionTypeDst.name && actionTypeSrc.name) {
                        if(actionTypeDst.name==actionTypeSrc.name) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
    })

    .controller('IncInfoDlg', function($scope, DataStore){
        $scope.inc_address = '';
        $scope.inc_number = '';

        DataStore.showIncInfoDlg = function() {
            $scope.inc_address = DataStore.incident.inc_address;
            $scope.inc_number = DataStore.incident.inc_number;
            $("#incident_info_dlg").dialog( "open" );
        }

        $scope.clickOk = function() {
            DataStore.incident.inc_address = $scope.inc_address;
            DataStore.incident.inc_number = $scope.inc_number;
            DataStore.incident.save();
            $("#incident_info_dlg").dialog( "close" );
        }

        $scope.clickCancel = function() {
            $("#incident_info_dlg").dialog( "close" );
        }

        $scope.clickAddressClear = function() {
            $scope.inc_address = "";
        }
        $scope.clickNumberClear = function() {
            $scope.inc_number = "";
        }
    })

    .controller('BranchDlg', function($scope, DataStore, LoadIncidentTypes, IncidentTypes, CreateBranch){

        LoadIncidentTypes();
        $scope.incidentTypes = IncidentTypes;

        $scope.users = [
            {"name":"Bob Smith"},
            {"name":"John Jones"},
            {"name":"Sally Smith"},
            {"name":"Jeff Bridges"}
        ];

        DataStore.showBranchDlg = function() {
            $("#branch_dlg").dialog( "open" );
        }

        $scope.clickCancel = function() {
            $("#branch_dlg").dialog( "close" );
        }

        $scope.createBranch = function(incidentType) {
            $("#branch_dlg").dialog( "close" );
            CreateBranch($scope.branch_user, incidentType);
        }
    })

    .controller('CmdXferDlg', function($scope, DataStore){
        $scope.upgrade_primary = 0;
        $scope.upgrade_secondary = 0;

        DataStore.showCmdXferDlg = function() {
            $("#cmdxfer_dialog").dialog( "open" );
        }
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
    })

    .controller('UnitOptionsDlg', function($scope, DataStore, DefaultErrorLogger){
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
            var unit = $scope.selected_unit;
            unit.par = par;
            if(unit.par<unit.manyPar) {
                unit.manyPar = unit.par;
            }
            unit.save(null, DefaultErrorLogger);
            $("#unit_options_dlg").dialog( "close" );
        }

        $scope.selectPsi = function(psi) {
            $scope.selected_unit.psi = psi;
            $scope.selected_unit.save(null, DefaultErrorLogger);
            $("#unit_options_dlg").dialog( "close" );
        }

    })

    .controller('PsiDlg', function($scope, DataStore){
        $scope.psis = [];
        $scope.selected_unit = 0;

        for(var psiValue=4500; psiValue>=0; psiValue-=100) {
            $scope.psis.push(psiValue);
        }

        // selectPsiCallback = function to callback with selected psi(string) as argument
        DataStore.showPsiDlg = function(selectPsiCallback) {
            $scope.selectPsiCallback = selectPsiCallback;
            $("#psi_dlg").dialog( "open" );
        }

        $scope.selectPsi = function(psi) {
            if($scope.selectPsiCallback) {
                $scope.selectPsiCallback(psi);
            }
            $("#psi_dlg").dialog( "close" );
        }

    })

    .factory('SetBeforeDialogClose', [function () {
        return function (func) {
            beforeDialogCloseFunc = func;
        }
    }])
    .factory('ClearBeforeDialogClose', [function () {
        return function () {
            beforeDialogCloseFunc = 0;
        }
    }])

;

function initDialogs() {
    $( ".dialog" ).dialog({
        autoOpen: false,
        modal: true
    });
    $( "#sector_name_dlg" ).dialog( "option", "width", 900 );
    $( "#par-dlg" ).dialog( "option", "width", 839 );
    $( "#bnch_dlg" ).dialog( "option", "width", 515 );
    $( "#units_dlg" ).dialog( "option", "width", 855 );
    $( "#actions_dlg" ).dialog( "option", "width", 810 );
    $( "#cmdxfer_dialog" ).dialog( "option", "width", 350 );
    $( "#upgrade_dlg" ).dialog( "option", "width", 485 );
    $( "#osr_dlg" ).dialog({
    		width: 420,
    		close: function(event, ui){
    			angular.element('#osr_dlg').scope().dataStore.osr.save();	
    		}
    	
    });
    $( "#objectives_dlg" ).dialog({
    		width: 230,
    		close: function(event, ui){
    			angular.element('#objectives_dlg').scope().dataStore.objectives.save();	
    		}
    	
    });
    $( "#iap_dlg" ).dialog({
    	width: 616,
    	close: function(event, ui){
    		angular.element('#iap_dlg').scope().dataStore.iap.save();
    	}
    });
    $( "#unit_options_dlg" ).dialog( "option", "width", 423 );
    $( "#psi_dlg" ).dialog( "option", "width", 423 );
    $( "#address_dialog" ).dialog( "option", "width", 450 );
    $( "#reports_dlg" ).dialog( "option", "width", 820 );
    $( "#clear_mayday_dlg" ).dialog( "option", "width", 348 );
    $( "#incident_info_dlg" ).dialog( "option", "width", 450 );
    $( "#branch_dlg" ).dialog( "option", "width", 550 );
    $( "#strategy_dlg" ).dialog( "option", "width", 258 );
    $("#mayday_form").hide();

    $(".ui-dialog .ui-dialog-titlebar-close").html("Close");

    $( ".dialog" ).on( "dialogbeforeclose", function( event, ui ) {
        if(nextDialogEl) {
            nextDialogEl.dialog('open');
        }

        if(beforeDialogCloseFunc) {
            beforeDialogCloseFunc();
            beforeDialogCloseFunc = 0;
        }
    } );

}
var nextDialogEl; // DOM element - sequentially open dialogs
var beforeDialogCloseFunc; // function
$( document ).ready(initDialogs);
