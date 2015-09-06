

var app = angular.module("LoginApp", ['AdaptersModule', 'js-data', 'DepartmentModule'])

    .controller('LoginCtrl', function($scope, Department){
            $scope.username="";
            $scope.password="";
            $scope.is_invalid_login = false;

            //Department.findAll().then(
            //    function(obj){
            //        console.log("DepartmentRes findAll success:", obj);
            //        $scope.departments = obj;
            //    },
            //    function(error){
            //        console.log("DepartmentRes findAll error:", error);
            //    }
            //);

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

            // Respond to incident type button click
            $scope.login = function() {
                SetDepartment($scope.selected_department);
                UserLogin($scope.username, $scope.password,
                    function () {
                        var urlLink = "splash.html";
                        window.location.href = urlLink;
                    },
                    function (error) {
                        console.log('Failed UserLogin department_id: "+department_id+", with error code: ' + error.message);
                        $scope.is_invalid_login = true;
                        $scope.$apply();
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
