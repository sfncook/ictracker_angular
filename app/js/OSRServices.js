'use strict';

angular.module('OSRServices', ['DataServices'])

    .controller('OsrDlg', function($scope, DataStore, UpdateOsrPercent){
        $scope.dataStore = DataStore;
        DataStore.showOSRDlg = function() {
            $("#osr_dlg").dialog( "open" );
        }

        $scope.showOSRDlg = function() {
            DataStore.showOSRDlg();
        }

        $scope.updateOSRPerc = function() {
            UpdateOsrPercent(DataStore.incident);
        }

        $scope.showDispatchAddressDlg = function() {
            $scope.dispatchAddress_temp = $scope.dataStore.incident.osr.dispatchAddress;
            $("#dispatch_address_dlg").dialog( "open" );
        }

        $scope.clickDispatchAddressClear = function() {
            $scope.dispatchAddress_temp = "";
        }

        $scope.clickDispatchAddressOk = function() {
            $scope.dataStore.incident.osr.dispatchAddress = $scope.dispatchAddress_temp;
            $("#dispatch_address_dlg").dialog( "close" );
        }

        $scope.clickDispatchAddressCancel = function() {
            $("#dispatch_address_dlg").dialog( "close" );
        }

        $scope.showUnitsDlgForOsr = DataStore.showUnitsDlgForOsr;
    })

    .factory('UpdateOsrPercent', function () {
        return function (incident) {
            var fullAmt=9.0;
            var amtChecked=0;
            if(incident) {
                if (incident.osr.unit){ amtChecked++; }
                if (incident.osr.dispatchAddress && incident.osr.dispatchAddress!=''){ amtChecked++; }
                if (incident.osr.conditions && incident.osr.conditions!=''){ amtChecked++; }
                if (incident.osr.isOccupancy){ amtChecked++; }
                if (incident.osr.isConstruction){ amtChecked++; }
                if (incident.osr.isAssumeCommand){ amtChecked++; }
                if (incident.osr.isAttackLine){ amtChecked++; }
                if (incident.osr.isWaterSupply){ amtChecked++; }
                if (incident.osr.accountability && incident.osr.accountability!=''){ amtChecked++; }
            }
            angular.element('#osr_perc_bar').css('width', ((amtChecked*100.0)/fullAmt) + '%');
        }
    })

;
