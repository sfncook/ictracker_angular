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

;

