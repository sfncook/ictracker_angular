
angular.module('SectorServices', ['ParseServices', 'DataServices'])

    .factory('SectorTypes', function() {
        return new Array();
    })

    .factory('LoadSectorTypes', ['SectorTypes', 'ParseQuery', 'ConvertParseObject', function (SectorTypes, ParseQuery, ConvertParseObject) {
        return function () {
            var querySectorTypes = new Parse.Query(Parse.Object.extend('SectorType'));
            return ParseQuery(querySectorTypes, {functionToCall:'find'}).then(function(sectorTypes){
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
            });
        }
    }])

;
