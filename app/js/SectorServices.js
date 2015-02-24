
angular.module('SectorServices', ['ParseServices', 'DataServices'])

    .factory('SectorTypes', function() {
        return new Array();
    })

    .factory('LoadSectorsForIncident', [
        'LoadUnitsForSector', 'AddDefaultTbars', 'SaveTbars', 'TbarSectors', 'ParseQuery', 'ConvertParseObject', 'FetchTypeForSector',
        function (LoadUnitsForSector, AddDefaultTbars, SaveTbars, TbarSectors, ParseQuery, ConvertParseObject, FetchTypeForSector) {
        return function ($scope, incident) {
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
                            FetchTypeForSector($scope, sector);
                            TbarSectors.push(sector);
                            LoadUnitsForSector(sector, $scope);
                        }
                    }
                },
                error: function(error) {
                    console.log('Failed to LoadSectorsForIncident, with error code: ' + error.message);
                }
            });
        }
    }])

    .factory('UpdateSectors', [
        'TbarSectors', 'ConvertParseObject', 'FetchTypeForSector', 'UpdateUnitsForSector',
        function (TbarSectors, ConvertParseObject, FetchTypeForSector, UpdateUnitsForSector) {
            return function ($scope) {
                for(var i=0; i<TbarSectors.length; i++) {
                    var sector = TbarSectors[i];
                    sector.fetch({
                        success:function(sector) {
                            FetchTypeForSector($scope, sector);
                            UpdateUnitsForSector($scope, sector);
                        },
                        error: function(error) {
                            console.log('Failed to UpdateSectors, with error code: ' + error.message);
                        }
                    });
                }
            }
        }])

    .factory('FetchTypeForSector', ['ConvertParseObject', function (ConvertParseObject) {
        return function ($scope, sector) {
            var type = sector.sectorType;
            if(type) {
                type.fetch({
                    success: function(type) {
                        $scope.$apply(function(){
                            ConvertParseObject(type, SECTOR_TYPE_DEF);
                            sector.sectorType= type;
                        });
                    },
                    error: function(error) {
                        console.log('Failed to FetchTypeForSector, with error code: ' + error.message);
                    }
                });
            }
        }
    }])

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

;
