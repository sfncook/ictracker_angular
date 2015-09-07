

var app = angular.module("LoginApp", ['AdaptersModule', 'js-data', 'DepartmentModule'])

    .controller('LoginCtrl', function($scope, Department, Adapters){

            if(!Adapters.hasLogin) {
                var urlLink = "splash.html"+document.location.search;
                window.location.href = urlLink;
            }

            $scope.username="";
            $scope.password="";
            $scope.is_invalid_login = false;
            $scope.loginWithDepartment = Adapters.loginWithDepartment;

            Department.findAll().then(
                function(obj){
                    //console.log("DepartmentRes findAll success:", obj);
                    $scope.departments = obj;
                },
                function(error){
                    console.log("DepartmentRes findAll error:", error);
                }
            );
            
            // Respond to incident type button click
            $scope.login = function() {
                if(Adapters.loginWithDepartment) {
                    Adapters.setDepartment($scope.selected_department.app_key, $scope.selected_department.api_key);
                }

                Adapters.login($scope.username, $scope.password).then(
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

            //var IncidentRes = DS.defineResource('Incident');
            //
            //IncidentRes.find('gFGa4HMohQ', options).then(
            //    function(obj){
            //        console.log("IncidentRes find success:", obj);
            //    },
            //    function(error){
            //        console.log("IncidentRes find error:", error);
            //    }
            //);
            //
            //IncidentRes.findAll({}, options).then(
            //    function(obj){
            //        console.log("IncidentRes findAll success:", obj);
            //    },
            //    function(error){
            //        console.log("IncidentRes findAll error:", error);
            //    }
            //);
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
