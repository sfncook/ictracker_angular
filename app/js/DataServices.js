
var DEPARTMENT_DEF = ['name_short', 'name_long', 'app_key', 'js_key'];
var INCIDENT_DEF = ['inc_number', 'inc_address', 'incidentType', 'inc_startDate', 'strategy', 'txid'];
var INCIDENT_TYPE_DEF = ['icon', 'nameLong', 'nameShort', 'order'];
var SECTOR_DEF = ['sectorType', 'direction', 'number', 'row', 'col', 'incident', 'acctUnit', 'bnch1', 'bnch2', 'bnch3', 'bnch4'];
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
var DISPATCHED_UNITS_DEF = ['incident', 'unitTypes'];
var USER_DEF = ['username', 'email', 'name', 'department'];
var ROLE_DEF = ['name', 'users', 'roles'];

angular.module('DataServices', ['ParseServices'])
    .factory('DefaultCity', function() {
        return "Mesa";
    })

    .factory('DataStore', function() {
        return {
            incident:{},
            currentUser:{},
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

    .factory('InitDefaultDatabase', [function () {
        return function () {
            if(ENABLE_SERVER_COMM && typeof Parse!='undefined') {
                Parse.initialize("rGT3rpOCdLiXBniennYMpIr77IzzDAlTmGHwy1fO", "L0Brh9CVpryQ2yTIezbjLrEdBOfoVlbIMmtgUniJ");
            }
        }
    }])

    .factory('InitDbForDepartment', ['ParseQuery', 'ConvertParseObject', 'InitDefaultDatabase', function (ParseQuery, ConvertParseObject, InitDefaultDatabase) {
        return function (department) {
            console.log("InitDbForDepartment department:"+department.app_key+", "+department.js_key);
            Parse.initialize(department.app_key, department.js_key);
        }
    }])

    .factory('InitDbForDepartmentId', ['ParseQuery', 'ConvertParseObject', 'InitDefaultDatabase', 'InitDbForDepartment', function (ParseQuery, ConvertParseObject, InitDefaultDatabase, InitDbForDepartment) {
        return function (department_id) {
            console.log("InitDbForDepartmentId department_id:"+department_id);
            InitDefaultDatabase();
            var queryDepartment = new Parse.Query(Parse.Object.extend('Department'));
            queryDepartment.equalTo("objectId", department_id);
            return queryDepartment.first({
                success: function(department) {
                    ConvertParseObject(department, DEPARTMENT_DEF);
                    InitDbForDepartment(department);
                },
                error: function() {
                    console.log('Failed to find department_id:'+department_id+', with error code: ' + error.message);
                }
            });
        }
    }])

    .factory('InitDatabase', ['InitDbForDepartment', 'InitDefaultDatabase', function (InitDbForDepartment, InitDefaultDatabase) {
        return function () {
            if(ENABLE_SERVER_COMM && typeof Parse!='undefined') {
                var app_key =   localStorage.getItem('app_key');
                var js_key =    localStorage.getItem('js_key');
                if(app_key && js_key) {
                    Parse.initialize(app_key, js_key);
                }
            }
        }
    }])

;
