
angular.module('DataServices', ['ParseServices', 'AdapterServices'])
    .factory('DefaultCity', function() {
        return "Mesa";
    })

    .factory('DataStore', function() {
        return {
            incident:{},
            currentUser:{},
            waitingToLoad:true,
            loadSuccess:false,
            choosing_unit_for_new_mayday:false
        };
    })

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

    .factory('InitDatabase', function (AdapterStore) {
        return function () {
            return AdapterStore.init();
        }
    })

;
