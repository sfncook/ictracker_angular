'use strict';

angular.module('DepartmentServices', ['DataServices'])

    .factory('AllDepartments', function() {
        return new Array();
    })

    .factory('LoadAllDepartments', ['ConvertParseObject', 'AllDepartments', function (ConvertParseObject, AllDepartments) {
        return function () {
            var queryDepartment = new Parse.Query(Parse.Object.extend('Department'));
            return queryDepartment.find({
                success: function(allDepartments) {
                    AllDepartments.removeAll();
                    for(var i=0; i<allDepartments.length; i++) {
                        var department = allDepartments[i];
                        ConvertParseObject(department, DEPARTMENT_DEF);
                        AllDepartments.push(department);
                    }
                },
                error: function(error) {
                    console.log('Failed LoadAllDepartments, with error code: ' + error.message);
                }
            });
        }
    }])

    .factory('SetDepartment', [function () {
        return function (department) {
            Parse.initialize(department.app_key, department.js_key);
            localStorage.setItem('department_app_key', department.app_key);
            localStorage.setItem('department_js_key', department.js_key);
        }
    }])

    .factory('ResetSavedDepartment', [function () {
        return function () {
            localStorage.removeItem('department_app_key');
            localStorage.removeItem('department_js_key');
        }
    }])

;

