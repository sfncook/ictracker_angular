

var app = angular.module("LoginApp", ['UserServices', 'DataServices', 'DepartmentServices'])
    .controller('LoginCtrl', function($scope, UserLogin, InitDefaultDatabase, LoadAllDepartments, AllDepartments, SetDepartment){
            $scope.username="";
            $scope.password="";
            $scope.selected_department = {"id":getHttpRequestByName('department_id')};

            InitDefaultDatabase();
            LoadAllDepartments().then(function(){
                $scope.departments = AllDepartments;
                $scope.$apply();
            });

            // Respond to incident type button click
            $scope.login = function() {
                SetDepartment($scope.selected_department);

                //console.log("login");
                UserLogin($scope.username, $scope.password,
                    function () {
                        var urlLink = "splash.html?department_id=" + $scope.selected_department.id;
                        window.location.href = urlLink;
                    },
                    function (error) {
                        //TODO: Display error
                        console.log('Failed UserLogin department_id: "+department_id+", with error code: ' + error.message);
                    }
                );
            };
        })

    ;
