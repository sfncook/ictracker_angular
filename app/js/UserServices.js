'use strict';

angular.module('UserServices', [])

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
                    console.log(error);
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


;


//angular.module('CreateUserController', ['ParseServices', 'DataServices'])
//    .controller('CreateUserCtrl', function($scope, ConvertParseObject, DefaultErrorLogger){
//            $scope.is_success = false;
//            $scope.is_failure = false;
//
//            $scope.createUser_TrialAccount = function() {
//                $scope.is_success = false;
//                $scope.is_failure = false;
//
//                var user = new Parse.User();
//                user.set("username", $scope.user_name);
//                user.set("password", $scope.password);
//                user.set("email", $scope.email);
//                user.set("phone", $scope.phone);
//
//                user.signUp(null, {
//                    success: function(new_user) {
//                        var queryRole = new Parse.Query(Parse.Role);
//                        queryRole.equalTo("name", "trial_license");
//                        queryRole.first({
//                            success: function(role) {
//                                role.getUsers().add(new_user);
//                                role.save(null, {
//                                    success: function() {
//                                        $scope.$apply(function(){
//                                            $scope.is_success = true;
//                                            $scope.is_failure = false;
//                                        });
//                                    },
//                                    error: function(obj, error) {
//                                        $scope.$apply(function(){
//                                            $scope.is_success = false;
//                                            $scope.is_failure = true;
//                                            $scope.failure_msg = error.message;
//                                        });
//                                    }
//                                });
//                            },
//                            error: function(error) {
//                                console.log('Failed to UpdateSectors, with error code: ' + error.message);
//                            }
//                        });
//                    },
//                    error: function(user, error) {
//                        $scope.$apply(function(){
//                            $scope.is_success = false;
//                            $scope.is_failure = true;
//                            $scope.failure_msg = error.message;
//                        });
//                    }
//                });
//            };
//    })
//;
