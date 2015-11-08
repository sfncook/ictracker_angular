'use strict';

angular.module('IapServices', ['ParseServices', 'DataServices'])

    .controller('IapDlg', function($scope, DataStore){
        $scope.dataStore = DataStore;
        DataStore.showIapDlg = function() {
            $("#iap_dlg").dialog( "open" );
        }
        $scope.showIapDlg = function() {
            DataStore.showIapDlg();
        }
        $scope.updateIapData = function() {
        	DataStore.iap.save();
        }
    })

;
