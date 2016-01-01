
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

//    .factory('AddDefaultTbars', function (GridsterOpts,  SectorTypes) {
//        return function (incident) {
//            var SectorParseObj = Parse.Object.extend('Sector');
//
//            var rescuSector = new SectorParseObj()
//            var rehabSector = new SectorParseObj()
//            var safetSector = new SectorParseObj()
//
//            new ConvertParseObject(rescuSector, SECTOR_DEF);
//            new ConvertParseObject(rehabSector, SECTOR_DEF);
//            new ConvertParseObject(safetSector, SECTOR_DEF);
//
//            rescuSector.sectorType = SectorTypes.RESCUE;
//            rehabSector.sectorType = SectorTypes.REHAB;
//            safetSector.sectorType = SectorTypes.SAFETY;
//
//            rescuSector.col = GridsterOpts.columns - 1;
//            rescuSector.row = 0;
//            rehabSector.col = GridsterOpts.columns - 1;
//            rehabSector.row = 1;
//            safetSector.col = GridsterOpts.columns - 1;
//            safetSector.row = 2;
//
//            rescuSector.incident = incident;
//            rehabSector.incident = incident;
//            safetSector.incident = incident;
//
//            TbarSectors.push(rescuSector);
//            TbarSectors.push(rehabSector);
//            TbarSectors.push(safetSector);
//
////            var manySectors = (GridsterOpts.rows * GridsterOpts.columns) - 3;
////            for (var i = 0; i < manySectors; i++) {
//            for(var col=0; col<GridsterOpts.columns; col++) {
//                for(var row=0; row<GridsterOpts.rows; row++) {
//                    if(
//                        (row==rescuSector.row && col==rescuSector.col) ||
//                        (row==rehabSector.row && col==rehabSector.col) ||
//                        (row==safetSector.row && col==safetSector.col)
//                    ) {
//                    } else {
//                        var blankSector = new SectorParseObj();
//                        ConvertParseObject(blankSector, SECTOR_DEF);
//                        blankSector.sectorType = SectorTypes.DEFAULT_SECTOR_TYPE;
//                        blankSector.row = row;
//                        blankSector.col = col;
//                        blankSector.incident = incident;
//                        TbarSectors.push(blankSector);
//                    }
//                }
//            }
//        }
//    })

;

