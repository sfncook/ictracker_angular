

var app = angular.module("LoginApp", ['UserServices', 'DataServices', 'DepartmentServices'])
    .controller('LoginCtrl', function($scope, UserLogin, InitDefaultDatabase, LoadAllDepartments, AllDepartments, SetDepartment){
        $scope.username="";
        $scope.password="";
        $scope.is_invalid_login = false;

        InitDefaultDatabase();
        LoadAllDepartments().then(function(){
            $scope.departments = AllDepartments;
            $scope.$apply();
        });

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
