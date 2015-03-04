'use strict';

angular.module("AdminModule", ['DataServices'])

    .controller('AdminUserCtrl', function ($scope, ConvertParseObject) {
        $scope.username = "";
        $scope.password = "";
        $scope.email = "";

        var currentUser = Parse.User.current();
        console.log(currentUser);

        $scope.createUser = function() {
            var user = new Parse.User();
            user.set("username", $scope.username);
            user.set("password", $scope.password);
            user.set("email", $scope.email);

            user.signUp(null, {
                success: function(user) {
                    console.log("Success!");
                },
                error: function(user, error) {
                    // Show the error message somewhere and let the user try again.
                    alert("Error: " + error.code + " " + error.message);
                }
            });
        }
    })

;
