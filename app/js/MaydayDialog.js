'use strict';

angular.module("ictApp")

    .controller('MaydayDlg', function($scope){
        $scope.showMaydayDlg = function () {
            $("#mayday_form").show();
        }

        $scope.closeMaydayDlg = function () {
            $("#mayday_form").hide();
        }
    })

;
