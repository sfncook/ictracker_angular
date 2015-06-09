
var INCIDENT_DEF = ['inc_number', 'inc_address', 'incidentType', 'inc_startDate', 'strategy', 'txid'];
var INCIDENT_TYPE_DEF = ['icon', 'nameLong', 'nameShort', 'order'];
var SECTOR_DEF = ['sectorType', 'direction', 'number', 'row', 'col', 'incident', 'acctUnit'];
var SECTOR_TYPE_DEF = ['name', 'manyBenchmarkBars', 'hasAcctBtn', 'hasActions', 'hasClock', 'hasPsiBtn', 'isVisible'];
var UNIT_TYPE_DEF = ['name', 'type', 'city'];
var UNIT_DEF = ['actions', 'manyPeople', 'manyPar', 'par', 'psi', 'sector', 'type'];
var ACTION_TYPE_DEF = ['name', 'category', 'incidentType', 'isWarning'];
var UPGRADE_DEF = ['incident', 'isWorkingFire', 'is1stAlarm', 'is2ndAlarm', 'is3rdAlarm', 'is4thAlarm', 'isBalanceTo', 'isEnRoute'];
var MAYDAY_DEF = ['incident', 'number', 'unitType', 'sectorType', 'isOnHoseline', 'isUnInjured', 'isLost', 'isTrapped', 'isOutOfAir', 'isRegulatorIssue', 'isLowAir', 'isPackIssue', 'nameFFighter', 'psi', 'channel', 'rank'];
var REPORT_ACTION_DEF = ['incident', 'sector', 'text'];
var IAP_DEF = ['fireControl', 'firefighterSafety', 'incident', 'isActionEffect', 'isArrangement', 'isBuilding', 'isFire', 'isLifeHazard', 'isOccupancy', 'isResources', 'isSpecial', 'isSprinkler', 'isVent', 'propertyPeople', 'evacutionLocation', 'rescue'];
var OSR_DEF = ['incident', 'isAddress', 'isOccupancy', 'isConstruction', 'isAssumeCommand', 'isLocation', 'isStrategy', 'isAttackLine', 'isWaterSupply', 'isIRIC', 'isBasement', 'isMobile', 'isDefensive', 'accountability', 'accountabilityLocation', 'unit', 'dispatchAddress', 'sizeOfBuilding', 'numberOfFloors', 'typeOfBuilding', 'subFloors', 'constructionType', 'roofType', 'conditions'];
var OBJECTIVES_DEF = ['incident', 'upgradeToFullRescue', 'assingSafety', 'establishSupplyLine', 'secureUtilities', 'ventiliation', 'createOnDeck', 'pressurizeExposures', 'monitorChannel16', 'salvage', 'establishRehab', 'customerService'];
var DEPT_DEF = ['name'];
var USER_DEF = ['username', 'email'];
var ROLE_DEF = ['name'];

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
