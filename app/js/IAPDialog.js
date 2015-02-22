'use strict';

angular.module("ictApp")

    .factory('IAP', [function () {
        return new Array();
    }])

    .controller('IapDlg', function($scope, DataStore){

        DataStore.showIapDlg = function($scope, DataStore) {
        	/*$scope.iap_acte = $scope.iap.isActionEffect;
			$scope.iap_arrg = $scope.iap.isArrangement;
			$scope.iap_bldg = $scope.iap.isBuilding;
			$scope.iap_fire = $scope.iap.isFire;
			$scope.iap_hazd = $scope.iap.isLifeHazard;
			$scope.iap_occu = $scope.iap.isOccupancy;
			$scope.iap_rsrc = $scope.iap.isResources;
			$scope.iap_spec = $scope.iap.isSpecial;
			$scope.iap_sprinkler = $scope.iap.isSprinkler;
			$scope.iap_vent = $scope.iap.isVent;
			$scope.iap_str_firecontrol = $scope.iap.fireControl;
			$scope.iap_str_firefighter_safety = $scope.iap.firefighterSafety;
			$scope.iap_str_property_people = $scope.iap.propertyPeople;
			$scope.iap_str_rescue = $scope.iap.rescue;

			/// TO-DO with Parse?
			$scope.iap_evlc_show = false
			$scope.iap_str_evac_loc = "Evacuation location"; */
            $("#iap_dlg").dialog( "open" );
        }
        $scope.showIapDlg = function() {
            DataStore.showIapDlg();
        }
    })

    .factory('LoadIAPForIncident', ['ParseQuery', 'ConvertParseObject', 'DataStore', 'CreateNewIap',
        function (ParseQuery, ConvertParseObject, DataStore, CreateNewIap) {
        return function ($scope, incident) {
           var queryIap = new Parse.Query(Parse.Object.extend('Iap'));
           queryIap.equalTo("incident", incident);
        	ParseQuery(queryIap, {functionToCall:'first'}).then(function(iapObject){
        		if (iapObject){
        			ConvertParseObject(iapObject, IAP_DEF);
        			DataStore.iap = iapObject;
        		} else {
					DataStore.iap = CreateNewIap(incident);
        		}
            });
        }
    }])

    .factory('CreateNewIap', ['ConvertParseObject', 'DataStore', function (ConvertParseObject, DataStore) {
        return function (curIncident) {
        	var IapParseObj = Parse.Object.extend('Iap');
			var iapObject = new IapParseObj();
			ConvertParseObject(iapObject, IAP_DEF);
			iapObject.isActionEffect=false;
			iapObject.isArrangement=false;
			iapObject.isBuilding=false;
			iapObject.isFire=false;
			iapObject.isLifeHazard=false;
			iapObject.isOccupancy=false;
			iapObject.isResources=false;
			iapObject.isSpecial=false;
			iapObject.isSprinkler=false;
			iapObject.isVent=false;
			iapObject.fireControl="";
			iapObject.firefighterSafety="";
			iapObject.propertyPeople="";
			iapObject.rescue="";
			iapObject.incident=curIncident;
            return iapObject;
        }
    }])

;
