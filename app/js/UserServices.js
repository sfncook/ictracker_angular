'use strict';

angular.module('CreateUserController', ['ParseServices', 'DataServices'])

.controller('CreateUserCtrl', function($scope, ConvertParseObject, DefaultErrorLogger){

        $scope.is_success = false;
        $scope.is_failure = false;

        $scope.createUser_TrialAccount = function() {
            $scope.is_success = false;
            $scope.is_failure = false;

            var user = new Parse.User();
            user.set("username", $scope.user_name);
            user.set("password", $scope.password);
            user.set("email", $scope.email);
            user.set("phone", $scope.phone);

            user.signUp(null, {
                success: function(new_user) {
                    var queryRole = new Parse.Query(Parse.Role);
                    queryRole.equalTo("name", "trial_license");
                    queryRole.first({
                        success: function(role) {
                            role.getUsers().add(new_user);
                            role.save(null, {
                                success: function() {
                                    $scope.$apply(function(){
                                        $scope.is_success = true;
                                        $scope.is_failure = false;
                                    });
                                },
                                error: function(obj, error) {
                                    $scope.$apply(function(){
                                        $scope.is_success = false;
                                        $scope.is_failure = true;
                                        $scope.failure_msg = error.message;
                                    });
                                }
                            });
                        },
                        error: function(error) {
                            console.log('Failed to UpdateSectors, with error code: ' + error.message);
                        }
                    });
                },
                error: function(user, error) {
                    $scope.$apply(function(){
                        $scope.is_success = false;
                        $scope.is_failure = true;
                        $scope.failure_msg = error.message;
                    });
                }
            });
        };

})

;
