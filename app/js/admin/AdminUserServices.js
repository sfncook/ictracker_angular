'use strict';

angular.module("AdminModule", ['DataServices', 'UserServices'])

    .controller('AdminUserCtrl', function ($scope, ConvertParseObject, LoadAllDepartments, Departments, CreateUser) {
        $scope.username = "";
        $scope.password = "";
        $scope.email = "";

        $scope.currentUser = Parse.User.current();
        if($scope.currentUser) {
            $scope.loggedOut = false;
            ConvertParseObject($scope.currentUser, USER_DEF);
        } else {
            $scope.loggedOut = true;
        }

        LoadAllDepartments();
        $scope.departments = Departments;
        $scope.roles = ["admin", "user"];
        $scope.addedRoles = new Array();

        $scope.createUser = function() {
//            CreateUser($scope.username, $scope.password, $scope.email, $scope.department, $scope.addedRoles);
            var role = new Parse.Role("admin", new Parse.ACL());
            role.getUsers().add($scope.currentUser);
            role.save();
        }

        $scope.logout = function() {
            Parse.User.logOut();
            location.reload();
        }

        $scope.login = function() {
            Parse.User.logIn($scope.username, $scope.password, {
                success: function(user) {
                    console.log("successful login");
                    location.reload();
                },
                error: function(user, error) {
                    console.log("Error: " + error.code + " " + error.message);
                    $scope.loggedOut = true;
                }
            });
        }

        $scope.toggleRole = function(roleName) {
            if($scope.addedRoles.indexOf(roleName)>=0) {
                $scope.addedRoles.remByVal(roleName);
            } else {
                $scope.addedRoles.push(roleName);
            }
        }

        $scope.isAddedRoll = function(roleName) {
            return $scope.addedRoles.indexOf(roleName)>=0;
        }

    })

    .factory('Departments', function() {
        return new Array();
    })

    .factory('LoadAllDepartments', ['ConvertParseObject', 'ParseQuery', 'Departments', function (ConvertParseObject, ParseQuery, Departments) {
        return function () {
            var query = new Parse.Query(Parse.Object.extend('FireDepartment'));
            ParseQuery(query, {functionToCall:'find'}).then(function(departments){
                Departments.removeAll();
                for(var i=0; i<departments.length; i++) {
                    var department = departments[i];
                    ConvertParseObject(department, DEPT_DEF);
                    Departments.push(department);
                }
            });
        }
    }])

;
