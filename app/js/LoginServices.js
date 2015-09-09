

var app = angular.module("LoginApp", ['DataServices', 'DepartmentModule', 'AdaptersModule'])

    .controller('LoginCtrl', function($scope, Department, DataStore){

            if(!DataStore.adapter.hasLogin) {
                var urlLink = "splash.html"+document.location.search;
                window.location.href = urlLink;
            }

            $scope.username="";
            $scope.password="";
            $scope.is_invalid_login = false;
            $scope.loginWithDepartment = DataStore.adapter.loginWithDepartment;

            Department.findAll().then(
                function(obj){
                    console.log("DepartmentRes findAll success:", obj);
                    $scope.departments = obj;
                },
                function(error){
                    console.log("DepartmentRes findAll error:", error);
                }
            );
            
            // Respond to incident type button click
            $scope.login = function() {
                if(DataStore.adapter.loginWithDepartment) {
                    DataStore.adapter.setDepartment($scope.selected_department.app_key, $scope.selected_department.api_key);
                }

                DataStore.adapter.login($scope.username, $scope.password).then(
                    function(obj){
                        var urlLink = "splash.html"+document.location.search;
                        window.location.href = urlLink;
                    },
                    function(error){
                        console.log("LoginServices - Login error:", error);
                        $scope.is_invalid_login = true;
                    }
                );
            };

    })

    .directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if(event.which === 13) {
                    scope.$apply(function (){
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    })

;
