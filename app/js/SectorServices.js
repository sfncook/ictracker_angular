
angular.module('SectorServices', ['ParseServices', 'DataServices'])

    .factory('SectorTypes', function() {
        return new Array();
    })

    .factory('LoadSectorTypes', ['SectorTypes', 'ParseQuery', 'ConvertParseObject', function (SectorTypes, ParseQuery, ConvertParseObject) {
        return function () {
            var querySectorTypes = new Parse.Query(Parse.Object.extend('SectorType'));
            return querySectorTypes.find({
                success: function(sectorTypes) {
                    for(var i=0; i<sectorTypes.length; i++) {
                        var sectorType = sectorTypes[i];
                        ConvertParseObject(sectorType, SECTOR_TYPE_DEF);
                        SectorTypes.push(sectorType);
                        var nameRefor = sectorType.name.replace(" ", "_").toUpperCase();
                        SectorTypes[nameRefor] = sectorType;
                        if (sectorType.name=="Sector Name") {
                            SectorTypes.DEFAULT_SECTOR_TYPE = sectorType;
                        }
                        if (sectorType.name=="Sector ####") {
                            SectorTypes.SECTOR_NUM = sectorType;
                        }
                    }//for
                },
                error: function(error) {
                    console.log('Failed to LoadSectorTypes, with error code: ' + error.message);
                }
            });
        }
    }])

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
    //.factory('UpdateSectorsAsNeeded',
    //function (TbarSectors, ConvertParseObject, UpdateUnitsForSector, DiffUpdatedTimes) {
    //    return function ($scope) {
    //        for(var i=0; i<TbarSectors.length; i++) {
    //            var sector = TbarSectors[i];
    //            var querySectors = new Parse.Query(Parse.Object.extend('Sector'));
    //            querySectors.equalTo("objectId", sector.id);
    //            querySectors.first({
    //                success: DiffUpdatedTimes($scope, sector),
    //                error: function(error) {
    //                    console.log('Failed to UpdateSectors, with error code: ' + error.message);
    //                }
    //            });
    //        }
    //    }
    //})

    .factory('UpdateSectorsAsNeeded',
    function () {
        return function ($scope) {
            //for(var i=0; i<TbarSectors.length; i++) {
            //    var sector = TbarSectors[i];
            //    var querySectors = new Parse.Query(Parse.Object.extend('Sector'));
            //    querySectors.equalTo("objectId", sector.id);
            //    querySectors.first({
            //        success: DiffUpdatedTimes($scope, sector),
            //        error: function(error) {
            //            console.log('Failed to UpdateSectors, with error code: ' + error.message);
            //        }
            //    });
            //}
        }
    })

    .factory('DiffUpdatedTimes', ['ConvertParseObject', 'UpdateSector', function (ConvertParseObject, UpdateSector) {
        return function ($scope, sector) {
            return function(sectorNew) {
                if(sector.updatedAt.getTime()!=sectorNew.updatedAt.getTime()) {
                    sector.fetch({
                        success: UpdateSector($scope, sector),
                        error: function(error) {
                            console.log('Failed to updateSector, with error code: ' + error.message);
                        }
                    });
                }
            };
        }
    }])

    .factory('UpdateSector', ['ConvertParseObject', 'FetchTypeForSector', 'FetchAcctTypeForSector',
        function (ConvertParseObject, FetchTypeForSector, FetchAcctTypeForSector) {
        return function ($scope, sector) {
            return function(sectorNew) {
//                console.log(sector);
                FetchTypeForSector($scope, sector);
                FetchAcctTypeForSector($scope, sector);
            };
        }
    }])

;

