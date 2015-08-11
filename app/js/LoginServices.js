

var app = angular.module("LoginApp", ['UserServices', 'DataServices', 'DepartmentServices'])
    .controller('LoginCtrl', function($scope, UserLogin, InitDbForDepartment, InitDefaultDatabase, LoadAllDepartments, AllDepartments){
            $scope.username="";
            $scope.password="";
            $scope.selected_department = {"id":getHttpRequestByName('department_id')};

            if(!$scope.selected_department.id) {
                InitDefaultDatabase();

                LoadAllDepartments().then(function(){
                    $scope.departments = AllDepartments;
                    $scope.$apply();
                });
            }

            // Respond to incident type button click
            $scope.login = function() {
                InitDbForDepartment($scope.selected_department);

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
            };

            $scope.select_department = function(department) {
                $scope.department_id = department.id;
                $scope.department = department;
            };
        })

    ;
