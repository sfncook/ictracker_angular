

var app = angular.module("LoginApp", ['UserServices', 'DataServices', 'DepartmentServices', 'js-data'])
    //.config(function (DSProvider, DSHttpAdapterProvider) {
    //        var defaults = {idAttribute : 'objectId'};
    //        angular.extend(DSProvider.defaults, defaults);
    //
    //})

    .controller('LoginCtrl', function($scope, $http, DS, UserLogin, InitDefaultDatabase, LoadAllDepartments, AllDepartments, SetDepartment){
            $scope.username="";
            $scope.password="";
            $scope.is_invalid_login = false;

            //var req = {
            //    method: 'GET',
            //    url: 'https://api.parse.com/1/users/me',
            //    headers : {
            //        'X-Parse-Application-Id' : 'Rx2vAi13xDnzOpbSCPZr3nAQycuQ7eA7k9JLhkxR',
            //        'X-Parse-REST-API-Key': 'EZZN6UZkmQrf8NKElL7JH6Pq5IWIUzAqFXLwHWp9',
            //        'X-Parse-Session-Token': 'r:zrjhRxYSWwgUO42hqStMjV5za'
            //    }
            //};
            //$http(req).then(
            //    function(obj){
            //        console.log("Me success:", obj);
            //    },
            //    function(error){
            //        console.log("Me error:", error);
            //    });
            //
            //
            //
            //var req = {
            //    method: 'GET',
            //    url: 'https://api.parse.com/1/classes/Incident/gFGa4HMohQ',
            //    headers : {
            //        'X-Parse-Application-Id' : 'Rx2vAi13xDnzOpbSCPZr3nAQycuQ7eA7k9JLhkxR',
            //        'X-Parse-REST-API-Key': 'EZZN6UZkmQrf8NKElL7JH6Pq5IWIUzAqFXLwHWp9',
            //        'X-Parse-Session-Token': 'r:zrjhRxYSWwgUO42hqStMjV5za'
            //    }
            //};
            //$http(req).then(
            //    function(obj){
            //        console.log("Incident success:", obj);
            //    },
            //    function(error){
            //        console.log("Incident error:", error);
            //    }
            //);


            //DS.defaults.idAttribute = 'objectId';

            var options = {
                basePath: 'https://api.parse.com/1/classes',
                headers : {
                    //'X-Parse-Session-Token':    'r:zrjhRxYSWwgUO42hqStMjV5za',
                    //'X-Parse-Application-Id' :  'Rx2vAi13xDnzOpbSCPZr3nAQycuQ7eA7k9JLhkxR',
                    //'X-Parse-REST-API-Key':     'EZZN6UZkmQrf8NKElL7JH6Pq5IWIUzAqFXLwHWp9',
                    'X-Parse-Application-Id' :  'rGT3rpOCdLiXBniennYMpIr77IzzDAlTmGHwy1fO',
                    'X-Parse-REST-API-Key' :    'gmvXdV5g0vFu3VnOR1Dg48oLf6M77uOUMwDfJKJ7'
                },
                deserialize: function (resourceConfig, data) {
                    if(data.data) {
                        var normalizedObj = data.data;

                        if('results' in normalizedObj) {
                            normalizedObj = normalizedObj.results;
                            for(var i in normalizedObj) {
                                normalizedObj[i].id = normalizedObj[i].objectId;
                            }
                        } else {
                            normalizedObj.id = normalizedObj.objectId;
                        }

                        return normalizedObj;
                    }
                }
            };

            var DepartmentRes = DS.defineResource('Department');
            DepartmentRes.findAll({}, options).then(
                function(obj){
                    console.log("DepartmentRes findAll success:", obj);
                    $scope.departments = obj;
                },
                function(error){
                    console.log("DepartmentRes findAll error:", error);
                }
            );

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

            //InitDefaultDatabase();
            //LoadAllDepartments().then(function(){
            //    $scope.departments = AllDepartments;
            //    $scope.$apply();
            //});
            //
            //// Respond to incident type button click
            //$scope.login = function() {
            //    SetDepartment($scope.selected_department);
            //    UserLogin($scope.username, $scope.password,
            //        function () {
            //            var urlLink = "splash.html";
            //            window.location.href = urlLink;
            //        },
            //        function (error) {
            //            console.log('Failed UserLogin department_id: "+department_id+", with error code: ' + error.message);
            //            $scope.is_invalid_login = true;
            //            $scope.$apply();
            //        }
            //    );
            //};
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
