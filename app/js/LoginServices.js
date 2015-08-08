

var app = angular.module("LoginApp", ['UserServices'])

    .controller('LoginCtrl', function($scope, UserLogin){
        $scope.username="";
        $scope.password="";

        // Respond to incident type button click
        $scope.login = function() {
            //console.log("login");
            UserLogin($scope.username, $scope.password, Callback_RedirectToSplashPage, Callback_LoginError);

        };

    })

    .factory('Callback_RedirectToSplashPage', function () {
        return function () {
            var urlLink = "splash.html";
            window.location.href = urlLink;
        }
    })

    .factory('Callback_LoginError', function () {
        return function () {

        }
    })

    ;
