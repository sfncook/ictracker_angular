'use strict';

angular.module('UserServices', ['DataServices'])

    .factory('IsLoggedIn', [function () {
        return function () {
            return Parse.User.current();
        }
    }])

    .factory('LoadCurrentUser', ['ConvertParseObject', 'DataStore', function (ConvertParseObject, DataStore) {
        return function () {

            DataStore.currentUser = Parse.User.current();
            ConvertParseObject(DataStore.currentUser, USER_DEF);

            var queryUser = new Parse.Query(Parse.Object.extend('User'));
            queryUser.equalTo("objectId", DataStore.currentUser.id);
            return queryUser.first({
                success: function(currentUser_) {
                    ConvertParseObject(currentUser_, USER_DEF);
                    DataStore.currentUser = currentUser_;
                },
                error: function(error) {
                    console.log('Failed queryUser, with error code: ' + error.message);
                }
            });
        }
    }])

    .factory('AllUsers', function() {
        return new Array();
    })

    .factory('LoadAllUsers', ['ConvertParseObject', 'AllUsers', function (ConvertParseObject, AllUsers) {
        return function () {

            var queryUser = new Parse.Query(Parse.Object.extend('User'));
            queryUser.include('department');
            return queryUser.find({
                success: function(allUsers) {
                    AllUsers.removeAll();
                    for(var i=0; i<allUsers.length; i++) {
                        var user = allUsers[i];
                        ConvertParseObject(user, USER_DEF);
                        if(user.department){
                            user.department.name_long = user.department.get('name_long');
                        }
                        //user.department.fetch().then(function(departmentObj){
                        //    ConvertParseObject(departmentObj, DEPARTMENT_DEF);
                        //    //DataStore.incident.inc_type_obj= incidentTypeObj;
                        //});
                        AllUsers.push(user);
                    }
                },
                error: function(error) {
                    console.log('Failed LoadAllUsers, with error code: ' + error.message);
                }
            });
        }
    }])

    .factory('UserLogin', [function () {
        return function (username, password, callback_success, callback_error) {
            return Parse.User.logIn(username, password, {
                success: function(user) {
                    console.log("Login success! user:");
                    console.log(user);
                    if (callback_success) {
                        callback_success(user);
                    }
                },
                error: function(user, error) {
                    console.log("Login error:");
                    console.log(error.message);
                    if (callback_error) {
                        callback_error(error);
                    }
                }
            });
        }
    }])

    .factory('UserLogout', [function () {
        return function () {
            return Parse.User.logOut();
        }
    }])

    .factory('CreateUser', [function () {
        return function (username, password, name, email, department_obj, callback_success, callback_error) {

            var user = new Parse.User();
            user.set("username", username);
            user.set("password", password);
            user.set("name", name);
            user.set("email", email);
            user.set("department", department_obj);

            user.signUp(null, {
                success: function(new_user){
                    if (callback_success) {
                        callback_success(user);
                    }
                },
                error: function(user, error) {
                    console.log("CreateUser error:");
                    console.log(error.message);
                    if (callback_error) {
                        callback_error(error);
                    }
                }
            });
        }
    }])



    //.controller('CreateUserCtrl', function($scope, ConvertParseObject, DefaultErrorLogger){
    //    $scope.is_success = false;
    //    $scope.is_failure = false;
    //
    //    $scope.createUser_TrialAccount = function() {
    //        $scope.is_success = false;
    //        $scope.is_failure = false;
    //
    //        var user = new Parse.User();
    //        user.set("username", $scope.user_name);
    //        user.set("password", $scope.password);
    //        user.set("email", $scope.email);
    //        user.set("phone", $scope.phone);
    //
    //        user.signUp(null, {
    //            success: function(new_user) {
    //                var queryRole = new Parse.Query(Parse.Role);
    //                queryRole.equalTo("name", "trial_license");
    //                queryRole.first({
    //                    success: function(role) {
    //                        role.getUsers().add(new_user);
    //                        role.save(null, {
    //                            success: function() {
    //                                $scope.$apply(function(){
    //                                    $scope.is_success = true;
    //                                    $scope.is_failure = false;
    //                                });
    //                            },
    //                            error: function(obj, error) {
    //                                $scope.$apply(function(){
    //                                    $scope.is_success = false;
    //                                    $scope.is_failure = true;
    //                                    $scope.failure_msg = error.message;
    //                                });
    //                            }
    //                        });
    //                    },
    //                    error: function(error) {
    //                        console.log('Failed to UpdateSectors, with error code: ' + error.message);
    //                    }
    //                });
    //            },
    //            error: function(user, error) {
    //                $scope.$apply(function(){
    //                    $scope.is_success = false;
    //                    $scope.is_failure = true;
    //                    $scope.failure_msg = error.message;
    //                });
    //            }
    //        });
    //    };
    //})

;

