'use strict';

//angular.module('OSRServices', ['ParseServices', 'DataServices'])
angular.module('ictApp')

    .controller('OsrDlg', function($scope, DataStore){
		$scope.dataStore = DataStore;
        DataStore.showOSRDlg = function() {
            $("#osr_dlg").dialog( "open" );
        }
        $scope.showOSRDlg = function() {
            DataStore.showOSRDlg();
        }
        DataStore.updateOSRPerc = function() {
        	var fullAmt=9.0;
        	var amtChecked=0;
            if (DataStore.osr.unit!=''){ amtChecked++; }
			if (DataStore.osr.dispatchAddress!=''){ amtChecked++; }
			if (DataStore.osr.conditions!=''){ amtChecked++; }
			if (DataStore.osr.isOccupancy){ amtChecked++; }
			if (DataStore.osr.isConstruction){ amtChecked++; }
			if (DataStore.osr.isAssumeCommand){ amtChecked++; }
			if (DataStore.osr.isAttackLine){ amtChecked++; }
			if (DataStore.osr.isWaterSupply){ amtChecked++; }
			if (DataStore.osr.accountability!=''){ amtChecked++; }
			angular.element('#osr_perc_bar').css('width', ((amtChecked*100.0)/fullAmt) + '%');
        }
        $scope.updateOSRPerc = function() {
            DataStore.updateOSRPerc();
        }
    })

    .factory('LoadOSRForIncident', ['ParseQuery', 'ConvertParseObject', 'DataStore', 'CreateNewOSR',
        function (ParseQuery, ConvertParseObject, DataStore, CreateNewOSR) {
        return function ($scope, incident) {
           var queryOSR = new Parse.Query(Parse.Object.extend('OSR'));
           queryOSR.equalTo("incident", incident);
        	ParseQuery(queryOSR, {functionToCall:'first'}).then(function(osrObject){
        		if (osrObject){
        			ConvertParseObject(osrObject, OSR_DEF);
        			DataStore.osr = osrObject;
        		} else {
					DataStore.osr = CreateNewOSR(incident);
        		}
        		DataStore.updateOSRPerc();
            });
        }
    }])

    .factory('CreateNewOSR', ['ConvertParseObject', 'DataStore', function (ConvertParseObject, DataStore) {
        return function (curIncident) {
        	var OSRParseObj = Parse.Object.extend('OSR');
			var osrObject = new OSRParseObj();
			ConvertParseObject(osrObject, OSR_DEF);
			osrObject.isAddress = false;
			osrObject.isOccupancy = false;
			osrObject.isConstruction = false;
			osrObject.isAssumeCommand = false;
			osrObject.isLocation = false;
			osrObject.isStrategy = false;
			osrObject.isAttackLine = false;
			osrObject.isWaterSupply = false;
			osrObject.isIRIC = false;
			osrObject.isBasement = false;
			osrObject.isMobile = false;
			osrObject.isDefensive = false;
			
			osrObject.accountability = '';
			osrObject.accountabilityLocation = '';
			osrObject.unit = '';
			osrObject.dispatchAddress = '';
			osrObject.sizeOfBuilding = '';
			osrObject.numberOfFloors = '';
			osrObject.typeOfBuilding = '';
			osrObject.subFloors = '';
			osrObject.constructionType = '';
			osrObject.roofType = '';
			osrObject.conditions = '';

			osrObject.incident=curIncident;
            return osrObject;
        }
    }])

;
