'use strict';

angular.module('UpgradeServices', ['ParseServices', 'DataServices'])

    .controller('UpgradeDlg', function($scope, DataStore){
        $scope.dataStore = DataStore;
        $scope.upgrade_secondary=1;
        $scope.displayUpgradeLabel='';

        $scope.updateUpgrade = function(whichButton) {
            alert(whichButton);
        }
        $scope.showUpgradeDlg = function() {
            $("#upgrade_dlg").dialog( "open" );
        }
        $scope.fixUpgLabelDisplay = function() {
            $scope.displayUpgradeLabel='';
            if (!DataStore.upgrade.isBalanceTo){
                if (DataStore.upgrade.isWorkingFire){
                    $scope.displayUpgradeLabel='Working Fire';
                }else if (DataStore.upgrade.is1stAlarm){
                    $scope.displayUpgradeLabel='1st Alarm';
                }else if (DataStore.upgrade.is2ndAlarm){
                    $scope.displayUpgradeLabel='2nd Alarm';
                }else if (DataStore.upgrade.is3rdAlarm){
                    $scope.displayUpgradeLabel='3rd Alarm';
                }else if (DataStore.upgrade.is4thAlarm){
                    $scope.displayUpgradeLabel='4th Alarm';
                }
            }
            $('#upgrade_btn_sub_label').html($scope.displayUpgradeLabel);
        }
        $scope.upgTogglePrim = function(prim_val) {
            DataStore.upgrade.isEnRoute = prim_val;
            DataStore.upgrade.save();
            $scope.fixUpgLabelDisplay();
        }
        $scope.upgSec = function(sec_val) {
            $scope.upgrade_secondary = sec_val;
            DataStore.upgrade.isWorkingFire = (sec_val==1);
            DataStore.upgrade.is1stAlarm =  (sec_val==2);
            DataStore.upgrade.is2ndAlarm =  (sec_val==3);
            DataStore.upgrade.is3rdAlarm =  (sec_val==4);
            DataStore.upgrade.is4thAlarm =  (sec_val==5);
            DataStore.upgrade.save();
            $scope.fixUpgLabelDisplay();
        }
        $scope.upgToggleBalance = function() {
            DataStore.upgrade.isBalanceTo=!DataStore.upgrade.isBalanceTo;
            $scope.fixUpgLabelDisplay();
            DataStore.upgrade.save();
        }
    })

    .factory('LoadUpgradeForIncident', function (ConvertParseObject, DataStore, CreateNewUpgrade) {
        return function (incident) {
            var queryUpgrade = new Parse.Query(Parse.Object.extend('Upgrade'));
            queryUpgrade.equalTo("incident", incident);
            return queryUpgrade.first().then(
                function(upgradeObject){
                    if (upgradeObject){
                        ConvertParseObject(upgradeObject, UPGRADE_DEF);
                        DataStore.upgrade = upgradeObject;
                    } else {
                        DataStore.upgrade = CreateNewUpgrade(incident);
                    }
                    return incident;
                }
            );
        }
    })

    .factory('CreateNewUpgrade', function (ConvertParseObject, DataStore) {
        return function (incident) {
            var UpgradeParseObj = Parse.Object.extend('Upgrade');
            var upgradeObject = new UpgradeParseObj();
            ConvertParseObject(upgradeObject, UPGRADE_DEF);
            upgradeObject.incident      = incident;
            upgradeObject.isWorkingFire = false;
            upgradeObject.is1stAlarm    = false;
            upgradeObject.is2ndAlarm    = false;
            upgradeObject.is3rdAlarm    = false;
            upgradeObject.is4thAlarm    = false;
            upgradeObject.isBalanceTo   = false;
            upgradeObject.isEnRoute     = false;
            return upgradeObject;
        }
    })

;