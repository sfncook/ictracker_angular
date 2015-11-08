
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

