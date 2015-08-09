'use strict';

angular.module("AdminModule", ['DataServices', 'UserServices'])

    .controller('AdminUserCtrl', function ($scope, LoadAllDepartments, Departments, InitDefaultDatabase, LoadCurrentUser, DataStore, IsLoggedIn) {
        $scope.username = "";
        $scope.password = "";
        $scope.email = "";
        $scope.loggedOut = true;

        InitDefaultDatabase();

        if(IsLoggedIn()) {
            $scope.loggedOut = false;
            LoadCurrentUser().then(function(){
                $scope.currentUser = DataStore.currentUser;
            });
        } else{
            $scope.loggedOut = true;
            var urlLink = "login.html";
            window.location.href = urlLink;
        }

        LoadAllDepartments();
        $scope.departments = Departments;
        $scope.roles = ["admin", "user"];
        $scope.addedRoles = new Array();

        $scope.createUser = function() {
            createRole();
//            CreateUser($scope.username, $scope.password, $scope.email, $scope.department, $scope.addedRoles);
//            Parse.Cloud.run('setUserRole', { userId: 'MnppIcJMyX', role: 'admin' }, {
//                success: function(response) {
//                    console.log("success:");
//                    console.log(response);
//                },
//                error: function(error) {
//                    console.log("error:");
//                    console.log(error);
//                }
//            });
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

function createRole() {
    var roleACL = new Parse.ACL();
    roleACL.setWriteAccess(Parse.User.current(), true);
    roleACL.setPublicReadAccess(true);
    var role = new Parse.Role("Administrator", roleACL);
    role.getUsers().add(Parse.User.current());

    role.save(null, {
        success: function(saveObject) {
            // The object was saved successfully.
            alert('role creation done');
            updateRoleACL(saveObject);
        },
        error: function(saveObject, error) {
            // The save failed.
            window.alert("Failed creating role with error: " + error.code + ":"+ error.message);
            //assignRoles();
        }
    });
}
