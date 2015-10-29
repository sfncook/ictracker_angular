
angular.module('SectorServices', ['DataServices', 'AdapterServices'])

    .factory('SectorTypes', function() {
        return new Array();
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

    //.factory('UpdateUnitsForSector', ['LoadActionsForUnit', 'FetchTypeForUnit', function (LoadActionsForUnit, FetchTypeForUnit) {
    //    return function ($scope, sector) {
    //        for(var i=0; i<sector.units.length; i++) {
    //            var unit = sector.units[i];
    //            unit.fetch({
    //                success:function(unit) {
    //                    FetchTypeForUnit(unit);
    //                    LoadActionsForUnit(unit);
    //                },
    //                error: function(error) {
    //                    console.log('Failed to UpdateUnitsForSector, with error code: ' + error.message);
    //                }
    //            });
    //        }
    //    }
    //}])
//
//    .factory('UpdateSectorsAsNeeded',
//    function (DataStore, ConvertParseObject, DiffUpdatedTimes) {
//        return function ($scope) {
//            for(var i=0; i<DataStore.incident.sectors.length; i++) {
//                var sector = DataStore.incident.sectors[i];
//                var querySectors = new Parse.Query(Parse.Object.extend('Sector'));
//                querySectors.equalTo("objectId", sector.id);
//                querySectors.first({
//                    success: DiffUpdatedTimes($scope, sector),
//                    error: function(error) {
//                        console.log('Failed to UpdateSectors, with error code: ' + error.message);
//                    }
//                });
//            }
//        }
//    })
//
//    .factory('DiffUpdatedTimes', ['ConvertParseObject', 'UpdateSector', function (ConvertParseObject, UpdateSector) {
//        return function ($scope, sector) {
//            return function(sectorNew) {
//                if(sector.updatedAt.getTime()!=sectorNew.updatedAt.getTime()) {
//                    sector.fetch({
//                        success: UpdateSector($scope, sector),
//                        error: function(error) {
//                            console.log('Failed to updateSector, with error code: ' + error.message);
//                        }
//                    });
//                }
//            };
//        }
//    }])
//
//    .factory('UpdateSector', ['ConvertParseObject', 'FetchTypeForSector', 'FetchAcctTypeForSector',
//        function (ConvertParseObject, FetchTypeForSector, FetchAcctTypeForSector) {
//        return function ($scope, sector) {
//            return function(sectorNew) {
////                console.log(sector);
//                FetchTypeForSector($scope, sector);
//                FetchAcctTypeForSector($scope, sector);
//            };
//        }
//    }])

;

