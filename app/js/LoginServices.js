

var app = angular.module("LoginApp", ['UserServices', 'DataServices'])
    .controller('LoginCtrl', function($scope, UserLogin, InitDbForDepartment, InitDefaultDatabase){
            $scope.username="";
            $scope.password="";

            // Respond to incident type button click
            $scope.login = function() {
                $scope.department_id = getHttpRequestByName('department_id');

                if($scope.department_id) {
                    InitDbForDepartment($scope.department_id);

                    //console.log("login");
                    UserLogin($scope.username, $scope.password,
                        function () {
                            var urlLink = "splash.html?department_id=" + $scope.department_id;
                            window.location.href = urlLink;
                        },
                        function (error) {
                            //TODO: Display error
                            console.log('Failed UserLogin department_id: "+department_id+", with error code: ' + error.message);
                        }
                    );
                } else {
                    InitDefaultDatabase();

                    //console.log("login");
                    UserLogin($scope.username, $scope.password,
                        function () {
                            var urlLink = "admin_user.html";
                            window.location.href = urlLink;
                        },
                        function (error) {
                            //TODO: Display error
                            console.log('Failed UserLogin, with error code: ' + error.message);
                        }
                    );
                }


            };
        })

    ;
