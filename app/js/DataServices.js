
var INCIDENT_DEF = ['inc_number', 'inc_address', 'incidentType', 'inc_startDate', 'txid'];
var INCIDENT_TYPE_DEF = ['icon', 'nameLong', 'nameShort', 'order'];
var SECTOR_DEF = ['sectorType', 'row', 'col', 'incident'];
var SECTOR_TYPE_DEF = ['name', 'manyBenchmarkBars', 'hasAcctBtn', 'hasActions', 'hasClock', 'hasPsiBtn', 'isVisible'];
var UNIT_TYPE_DEF = ['name', 'type', 'city'];
var UNIT_DEF = ['actions', 'manyPeople', 'manyPar', 'par', 'psi', 'sector', 'type'];
var ACTION_TYPE_DEF = ['name', 'category', 'incidentType', 'isWarning'];
var MAYDAY_DEF = ['incident', 'number', 'unitType', 'sectorType', 'isOnHoseline', 'isUnInjured', 'isLost', 'isTrapped', 'isOutOfAir', 'isRegulatorIssue', 'isLowAir', 'isPackIssue', 'nameFFighter', 'psi', 'channel', 'rank'];

angular.module('DataServices', ['ParseServices'])

    .factory('DefaultCity', function() {
        return "Mesa";
    })

    .factory('DataStore', function() {
        return {
            incident:{},
            waitingToLoad:true,
            loadSuccess:false
        };
    })

    .factory('ConvertParseObject', [function () {
        return function (parseObject, fields) {
            //add dynamic properties from fields array
            for (var i = 0; i < fields.length; i++) {
                //add closure
                (function () {
                    var propName = fields[i];
                    Object.defineProperty(parseObject, propName, {
                        get: function () {
                            return parseObject.get(propName);
                        },
                        set: function (value) {
                            parseObject.set(propName, value);
                        }
                    });
                })();
            }
        }
    }])

    // Pass this into Parse save commands to log errors.
    .factory('DefaultErrorLogger', [function () {
        return {
            error: function(obj, error) {
                console.log('Failed to create new object, with error code: ' + error.message);
            }
        }
    }])

;
