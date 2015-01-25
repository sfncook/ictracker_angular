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
                    var sectorTypeName = sectorType.name;
                    sectorTypeName = sectorTypeName.toUpperCase();
                    sectorTypeName.replace(" ", "_");
                    Object.defineProperty(SectorTypes, sectorTypeName, {
                        value: sectorType,
                        writable: false
                    });
                }
            });
        }
    }])

    .factory('SectorType', [function () {

        var fields = ["name", "hasClock", "hasAcctBtn", "hasPsiBtn", "hasActions"];

        return function (parseObject) {
            createParseObject(this, fields, parseObject)
        };

    }])

;

function createParseObject(object, fields, parseObject) {
    Object.defineProperty(object, 'data', { get: function () {
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
        return ParseQuery(parseObject, {functionToCall: 'save', params: [null]})
    }
    object.delete = function () {
        return ParseQuery(parseObject, {functionToCall: 'destroy'});
    }
    object.fetch = function () {
        return ParseQuery(parseObject, {functionToCall: 'fetch'});
    }
}
