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

    .factory('SetSavedDepartment', [function () {
        return function () {
            var app_key = localStorage.getItem('department_app_key');
            var js_key = localStorage.getItem('department_js_key');

            if(app_key && js_key) {
                console.log(app_key+" "+js_key);
                Parse.initialize(app_key, js_key);
                return true;
            } else {
                return false;
            }
        }
    }])

;

