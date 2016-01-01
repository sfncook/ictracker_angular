
angular.module('SectorServices', ['DataServices', 'AdapterServices'])

    .factory('SectorTypes', function() {
        return new Array();
    })

    .controller('SectorNamesDlg', function($scope, $http, DataStore, ReportFunctions, LoadSectorTypes, SectorTypes, CreateBlankSectorType, SaveSector){
        $scope.selectedSector = {};
        $scope.dataStore = DataStore;

        LoadSectorTypes().then(
            function(sectorTypes) {
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
            $scope.selectedSector.initialized = true;
            SaveSector($scope.selectedSector);

            if(sectorType.name=="Customer Service") {DataStore.setCustSvcSector();}

            ReportFunctions.addEvent_title_to_sector($scope.selectedSector);

            $("#sector_name_dlg").dialog( "close" );
        };
        $scope.setDir = function(sector_dir) {
            $scope.selectedSector.direction=sector_dir.tbar;
            SaveSector($scope.selectedSector);
        };
        $scope.setNum = function(sector_num) {
            $scope.selectedSector.number=sector_num;
            SaveSector($scope.selectedSector);
        };

        $scope.isSectorTypeSelected = function(sectorType) {
            console.log("sectorType:",sectorType);
        }

        DataStore.showSectorNameDlg = function(sector) {
            $scope.selectedSector = sector;
            $("#sector_name_dlg").dialog( "open" );
        }
    })

    .factory('LoadSectorTypes', function (AdapterStore, SectorTypes) {
        return function () {
            return AdapterStore.adapter.LoadSectorTypes().then(function(sectorTypes){
                SectorTypes.removeAll();
                for(var i=0; i<sectorTypes.length; i++) {
                    var sectorType = sectorTypes[i];
                    var nameRefor = sectorType.name.replace(" ", "_").toUpperCase();
                    SectorTypes[nameRefor] = sectorType;
                    if (sectorType.name=="Sector Name") {
                        SectorTypes.DEFAULT_SECTOR_TYPE = sectorType;
                    }
                    if (sectorType.name=="Sector ####") {
                        SectorTypes.SECTOR_NUM = sectorType;
                    }
                    SectorTypes.push(sectorType);
                }//for
                return SectorTypes;
            });
        }
    })

    .factory('SaveSector', function (AdapterStore) {
        return function (sector) {
            return AdapterStore.SaveSector(sector);
        }
    })

    .factory('DoesSectorHavePar', [function () {
        return function (sector) {
            var allParsAreZero = true;
            if(sector && sector.units) {
                for(var i=0; i<sector.units.length; i++) {
                    var unit = sector.units[i];
                    if(unit.manyPar<unit.par) {
                        return false;
                    }
                    if(unit.par!=0) {
                        allParsAreZero = false;
                    }
                }
                if(allParsAreZero) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        }
    }])

    .factory('UpdateUnitsForSector', function () {
        return function ($scope, sector) {
            //for(var i=0; i<sector.units.length; i++) {
            //    var unit = sector.units[i];
            //    unit.fetch({
            //        success:function(unit) {
            //            FetchTypeForUnit(unit);
            //            LoadActionsForUnit(unit);
            //        },
            //        error: function(error) {
            //            console.log('Failed to UpdateUnitsForSector, with error code: ' + error.message);
            //        }
            //    });
            //}
        }
    })

;

