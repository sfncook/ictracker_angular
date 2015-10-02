
angular.module('SectorServices', ['ParseServices', 'DataServices', 'AdapterServices'])

    .factory('SectorTypes', function() {
        return new Array();
    })

    .factory('LoadSectorsForIncident',
        function ($q, LoadUnitsForSector, AdapterStore, AddDefaultTbars, SaveTbars, TbarSectors, ParseQuery, ConvertParseObject, FetchTypeForSector, FetchAcctTypeForSector) {
        return function (incident) {
            var deferred = $q.defer();
            var promises = [];
            var querySectors = new Parse.Query(Parse.Object.extend('Sector'));
            querySectors.equalTo("incident", incident);
            querySectors.find({
                success: function(sectors) {
                    if(sectors.length==0) {
                        AddDefaultTbars(incident);
                        SaveTbars();
                    } else {
                        for(var i=0; i<sectors.length; i++) {
                            var sector = sectors[i];
                            ConvertParseObject(sector, SECTOR_DEF);
                            promises.push(FetchTypeForSector(sector));
                            TbarSectors.push(sector);
                            promises.push(AdapterStore.adapter.LoadUnitsForSector(sector));
                            promises.push(AdapterStore.adapter.FetchAcctTypeForSector(sector));
                        }
                    }
                },
                error: function(error) {
                    console.log('Failed to LoadSectorsForIncident, with error code: ' + error.message);
                }
            });
            $q.all(promises)
                .then(
                function(results) {
                    deferred.resolve(results);
                },
                function(errors) {
                    deferred.reject(errors);
                },
                function(updates) {
                    deferred.update(updates);
                });
            return deferred.promise;
        }
    })

    .factory('FetchTypeForSector', function (ConvertParseObject) {
        return function (sector) {
            sector.sectorType.fetch().then(
                function(type) {
                    ConvertParseObject(type, SECTOR_TYPE_DEF);
                    sector.sectorType= type;
                },
                function(error) {
                    console.log('Failed to FetchTypeForSector, with error code: ' + error.message);
                }
            );
        }
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


    .factory('UpdateSectorsAsNeeded',
    function (TbarSectors, ConvertParseObject, UpdateUnitsForSector, DiffUpdatedTimes) {
        return function ($scope) {
            for(var i=0; i<TbarSectors.length; i++) {
                var sector = TbarSectors[i];
                var querySectors = new Parse.Query(Parse.Object.extend('Sector'));
                querySectors.equalTo("objectId", sector.id);
                querySectors.first({
                    success: DiffUpdatedTimes($scope, sector),
                    error: function(error) {
                        console.log('Failed to UpdateSectors, with error code: ' + error.message);
                    }
                });
            }
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

