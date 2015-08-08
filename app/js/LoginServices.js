

var app = angular.module("LoginApp", ['UserServices', 'DataServices'])
    .controller('LoginCtrl', function($scope, UserLogin, InitDbForDepartment, Callback_LoginError){
            $scope.username="";
            $scope.password="";

            var department_id = getHttpRequestByName('department_id');
            $scope.department_id=department_id;
            InitDbForDepartment(department_id);

            // Respond to incident type button click
            $scope.login = function() {
                //console.log("login");
                UserLogin($scope.username, $scope.password,
                    function () {
                        var urlLink = "splash.html?department_id="+$scope.department_id;
                        window.location.href = urlLink;
                    },
                    Callback_LoginError);

            };
        })

    .factory('Callback_LoginError', function () {
            return function () {
                //TODO: Display error
            }
        })

    ;
