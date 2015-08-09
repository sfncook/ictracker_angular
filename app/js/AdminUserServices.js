'use strict';

angular.module("AdminModule", ['DataServices', 'UserServices', 'DepartmentServices'])

    .controller('AdminUserCtrl', function ($scope, AllDepartments, LoadAllDepartments, InitDefaultDatabase, LoadCurrentUser, DataStore, IsLoggedIn, LoadAllUsers, AllUsers) {
        $scope.username = "";
        $scope.password = "";
        $scope.email = "";
        $scope.loggedOut = true;
        $scope.showAddUser = false;
        $scope.newuser = {};

        InitDefaultDatabase();

        if(IsLoggedIn()) {
            $scope.loggedOut = false;
            LoadCurrentUser().then(function(){
                $scope.currentUser = DataStore.currentUser;
            });

            LoadAllUsers().then(
                function(){
                $scope.user_list = AllUsers;
            });
        } else{
            $scope.loggedOut = true;
            var urlLink = "login.html";
            window.location.href = urlLink;
        }

        LoadAllDepartments().then(function(){
            $scope.departments = AllDepartments;
        });

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

        $scope.addUser = function() {
            $scope.showAddUser = true;
        }

        $scope.saveNewUser = function() {
            $scope.showAddUser = false;
            $scope.newuser.username="";
            $scope.newuser.name="";
            $scope.newuser.department_id="";
            $scope.newuser.email="";
        }

        $scope.cancelAddUser = function() {
            $scope.showAddUser = false;
            $scope.newuser.username="";
            $scope.newuser.name="";
            $scope.newuser.department_id="";
            $scope.newuser.email="";
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
