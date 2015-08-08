

var app = angular.module("LoginApp", ['UserServices', 'DataServices'])
    .controller('LoginCtrl', function($scope, UserLogin, InitDbForDepartment){
            $scope.username="";
            $scope.password="";

            $scope.department_id = getHttpRequestByName('department_id');
            InitDbForDepartment($scope.department_id);

            // Respond to incident type button click
            $scope.login = function() {
                //console.log("login");
                UserLogin($scope.username, $scope.password).then(
                    function () {
                        var urlLink = "splash.html?department_id="+$scope.department_id;
                        window.location.href = urlLink;
                    },
                    function () {
                        //TODO: Display error
                    }
                );

            };
        })

    ;
