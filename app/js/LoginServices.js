
var app = angular.module("LoginApp", ['UserServices'])

    .controller('LoginCtrl', function($scope, UserLogin){
        $scope.username="user";
        $scope.password="pass";

        // Respond to incident type button click
        $scope.login = function() {
            //console.log("login");
            UserLogin($scope.username, $scope.password);
        };

    });
