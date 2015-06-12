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
                success: function(user) {
                    $scope.$apply(function(){
                        $scope.is_success = true;
                        $scope.is_failure = false;
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
