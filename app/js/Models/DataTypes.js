angular.module('DataTypes', ['DataTypes'])

    .factory('SectorTypes', function() {
        return new Array();
    })

    .factory('LoadDataTypes', ['SectorTypes', 'SectorType', function (SectorTypes, SectorType) {
        return function () {
            var sectorTypeQuery = new Parse.Query("SectorType");
            sectorTypeQuery.find().then(function(results) {
                for(var i=0; i<results.length; i++) {
                    var parseObject = results[i];
                    var sectorType = new SectorType(parseObject);
                    SectorTypes.push(sectorType);

                    //Create constants from sectorType names.  ex: "Sector 1"==>obj.SECTOR_1
                    if(sectorType.name=="Sector Name") {
                        var sectorTypeName = "DEFAULT_SECTOR_TYPE";
                    } else {
                        var sectorTypeName = sectorType.name;
                        sectorTypeName = sectorTypeName.toUpperCase();
                        sectorTypeName.replace(" ", "_");
                    }
                    Object.defineProperty(SectorTypes, sectorTypeName, {
                        value: sectorType,
                        writable: false
                    });
                }//for
                var defaultSectorType = new SectorType();
                defaultSectorType.name = "Sector Name";
                defaultSectorType.hasClock = true;
                defaultSectorType.hasAcctBtn = true;
                defaultSectorType.hasPsiBtn = true;
                defaultSectorType.hasActions = true;
                SectorTypes.DEFAULT_SECTOR_TYPE = defaultSectorType;
            });
        }
    }])

    .factory('SectorType', [function () {

        var fields = ["name", "hasClock", "hasAcctBtn", "hasPsiBtn", "hasActions"];

        return function (parseObject) {
            if(parseObject) {
                convertParseObject(this, fields, parseObject);
            } else {
                createParseObject(this, fields, 'SectorType');
            }
        };

    }])

    .factory('Sector', [function () {

        var fields = ['sectorType', 'incident', 'units', 'row', 'col'];

        return function (parseObject) {
            if(parseObject) {
                convertParseObject(this, fields, parseObject);
            } else {
                createParseObject(this, fields, 'Sector');
            }
        };

    }])

;

function createParseObject(object, fields, className) {
    var ParseModel = Parse.Object.extend(className);
    parseObject = new ParseModel();
    return convertParseObject(object, fields, parseObject);
}

function convertParseObject(object, fields, parseObject) {

    Object.defineProperty(object, 'parseObject', { get: function () {
        return parseObject;
    } });

    //add dynamic properties from fields array
    for (var i = 0; i < fields.length; i++) {
        //add closure
        (function () {
            var propName = fields[i];
            Object.defineProperty(object, propName, {
                get: function () {
                    return parseObject.get(propName);
                },
                set: function (value) {
                    parseObject.set(propName, value);
                }
            });
        })();
    }

    //instance methods
    object.save = function () {
        return parseObject.save();
    }
    object.delete = function () {
        return parseObject.destroy();
    }
    object.fetch = function () {
        return parseObject.fetch();
    }
}
