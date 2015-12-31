'use strict';

angular.module("ictApp")

    .factory('Maydays', [function () {
        return new Array();
    }])

    .controller('MaydayDlg', function($scope, $interval, Maydays, SaveAllMaydays, DeleteMayday, DataStore, OpenMaydayDlgForMayday, SaveSelectedMayday){
        DataStore.maydays = new Array();

        $scope.channels = [
            {channelname:"Channel"},
            {channelname:"Channel 1"},
            {channelname:"Channel 2"},
            {channelname:"Channel 3"},
            {channelname:"Channel 4"},
            {channelname:"Channel 5"},
            {channelname:"Channel 6"},
            {channelname:"Channel 7"},
            {channelname:"Channel 8"},
            {channelname:"Channel 9"},
            {channelname:"Channel 10"},
            {channelname:"Channel 11"},
            {channelname:"Channel 12"},
            {channelname:"Channel 13"},
            {channelname:"Channel 14"},
            {channelname:"Channel 15"},
            {channelname:"Channel 16"}
        ];
        $scope.incidentSectorTypes = [];
        $scope.incidentUnitTypes = [];
        $scope.selectedMayday;
        $scope.dataStore = DataStore;

        $scope.openMaydayDlgForMayday = OpenMaydayDlgForMayday;
        $scope.dataStore.saveSelectedMayday = SaveSelectedMayday;

        $scope.clearMayday = function (method) {
            if(method) {
                switch(method) {
                    case 'slfrs':
                        // TODO: log event for report
                        DeleteMayday($scope.selectedMayday);
                        break;
                    case 'rescu':
                        // TODO: log event for report
                        DeleteMayday($scope.selectedMayday);
                        break;
                    case 'ffmia':
                        // TODO: log event for report
                        DeleteMayday($scope.selectedMayday);
                        break;
                    case 'cancl':
                        break;
                }
                $("#clear_mayday_dlg").dialog( "close" );
            } else {
                $("#clear_mayday_dlg").dialog( "open" );
            }
        }

        $scope.openPsiDialog = function () {
            DataStore.showPsiDlg($scope.setPsiSelectedMayday);
        }

        $scope.setPsiSelectedMayday = function (psi) {
            $scope.selectedMayday.psi = psi;
        }

        $scope.click_new_mayday = function () {
            $scope.dataStore.choosing_unit_for_new_mayday = true;
        }
        document.addEventListener('click', function (event) {
            if($scope.dataStore.choosing_unit_for_new_mayday) {
                if(!$(event.target).hasClass("unit_tbar_btn")) {
                    //console.log("MaydayDlg document.addEventListener - Cancelling choosing_unit_for_new_mayday");
                    $scope.dataStore.choosing_unit_for_new_mayday = false;
                }
            }
        }, true);

        function updateSelectedMaydayTimer() {
            DataStore.maydays.forEach(function(mayday) {
                mayday.timerText = "00:00";
                var t0 = (new Date(mayday.startDate)).getTime();

                var t1 = (new Date()).getTime();
                var elapsed = parseInt(t1-t0);
                var elapsedSec = parseInt((elapsed/1000)%60);
                var elapsedMin = parseInt((elapsed/(1000*60))%60);
                var elapsedHr = parseInt((elapsed/(1000*60*60))%60);

                var secStr = (elapsedSec<10)?("0"+elapsedSec):elapsedSec;
                var minStr = (elapsedMin<10)?("0"+elapsedMin):elapsedMin;
                var hrStr = (elapsedHr<10)?("0"+elapsedHr):elapsedHr;

                var new_timer_text = "";
                if (elapsedHr>0) {
                    new_timer_text = hrStr+":"+minStr+":"+secStr;
                } else {
                    new_timer_text = minStr+":"+secStr;
                }
                mayday.timerText = new_timer_text;
            });
        }
        $interval(updateSelectedMaydayTimer, 1000);

    })

    .factory('OpenMaydayDlgForMayday', function (DataStore) {
        return function (mayday) {
            DataStore.selectedMayday = mayday;
            $("#mayday_dlg").dialog("open");
            $('#mayday_dlg').dialog('option', 'title', 'Mayday #'+mayday.number+" - "+mayday.sector.sectorType.name+" - "+mayday.unit.type.name);
        }
    })

    .factory('AddNewMayday', function (AdapterStore, DataStore, OpenMaydayDlgForMayday, GetNextMaydayId) {
        return function (sector, unit) {
            unit.hasMayday = true;
            var mayday = AdapterStore.adapter.CreateNewMayday();
            mayday.number               = GetNextMaydayId();
            mayday.sector               = sector;
            mayday.unit                 = unit;
            mayday.startDate            = new Date();
            mayday.isOnHoseline         = true;
            mayday.isUnInjured          = true;
            mayday.isLost               = false;
            mayday.isTrapped            = false;
            mayday.isOutOfAir           = false;
            mayday.isRegulatorIssue     = false;
            mayday.isLowAir             = false;
            mayday.isPackIssue          = false;
            mayday.nameFFighter         = "";
            mayday.psi                  = 4000;
            mayday.channel              = "";
            mayday.rank                 = "";
            DataStore.maydays.push(mayday);
            OpenMaydayDlgForMayday(mayday);
        }
    })

    .factory('SaveSelectedMayday', function (DataStore, AdapterStore) {
        return function () {
            return AdapterStore.adapter.SaveMayday(DataStore.selectedMayday);
        }
    })

    .factory('GetNextMaydayId', function (DataStore) {
        return function () {
            return DataStore.maydays.length + 1;
        }
    })

    .factory('SaveAllMaydays', ['Maydays', 'DefaultErrorLogger', function (Maydays, DefaultErrorLogger) {
        return function () {
            for(var m=0; m<Maydays.length; m++) {
                var mayday = Maydays[m];
                mayday.save(null, DefaultErrorLogger);
            }
        }
    }])

    .factory('LoadAllMaydaysForIncident', function ($q, Maydays, ParseQuery, ConvertParseObject, FetchUnitTypeForMayday, FetchSectorTypeForMayday) {
        return function (incident) {
            var deferred = $q.defer();
            var promises = [];
            var queryMaydays = new Parse.Query(Parse.Object.extend('Mayday'));
            queryMaydays.equalTo("incident", incident);
            queryMaydays.include('unitType');
            queryMaydays.include('sectorType');
            queryMaydays.find({
                success: function(maydays) {
                    for(var i=0; i<maydays.length; i++) {
                        var mayday = maydays[i];
                        ConvertParseObject(mayday, MAYDAY_DEF);
                        Maydays.push(mayday);
                        promises.push(FetchUnitTypeForMayday(mayday));
                        promises.push(FetchSectorTypeForMayday(mayday));
                    }
                },
                error: function(error) {
                    console.log('Failed to LoadActionTypes, with error code: ' + error.message);
                }
            });
            $q.all(promises)
                .then(
                function(results) {
                    deferred.resolve(results);
                },
                function(errors) {
                    deferred.reject(errors);
                },
                function(updates) {
                    deferred.update(updates);
                });
            return deferred.promise;
        }
    })

    .factory('UpdateMaydays', [
        'Maydays', 'FetchUnitTypeForMayday', 'FetchSectorTypeForMayday', 'ConvertParseObject',
        function (Maydays, FetchUnitTypeForMayday, FetchSectorTypeForMayday, ConvertParseObject) {
            return function ($scope) {
                for(var i=0; i<Maydays.length; i++) {
                    var mayday = Maydays[i];
                    mayday.fetch({
                        success:function(mayday){
                            if(mayday.unitType) {
                                mayday.unitType.fetch({
                                    success: function(unitType) {
                                        $scope.$apply(function(){
                                            mayday.unitType = unitType;
                                        });
                                    },
                                    error: function(error) {
                                        console.log('Failed to UpdateMaydays(unitType), with error code: ' + error.message);
                                    }
                                });
                            }
                            if(mayday.sectorType) {
                                mayday.sectorType.fetch({
                                    success: function(sectorType) {
                                        $scope.$apply(function(){
                                            mayday.sectorType = sectorType;
                                        });
                                    },
                                    error: function(error) {
                                        console.log('Failed to UpdateMaydays(sectorType), with error code: ' + error.message);
                                    }
                                });
                            }
                        },
                        error: function(error) {
                            console.log('Failed to UpdateMaydays (mayday), with error code: ' + error.message);
                        }
                    });
                }
            }
        }])

    .factory('FetchUnitTypeForMayday', function (ConvertParseObject) {
        return function (mayday) {
            if(mayday.unitType) {
                return mayday.unitType.fetch().then(
                    function(unitType) {
                        ConvertParseObject(unitType, UNIT_TYPE_DEF);
                        mayday.unitType = unitType;
                    },
                    function(error) {
                        console.log('Failed to FetchUnitTypeForMayday, with error code: ' + error.message);
                    }
                );
            }
        }
    })

    .factory('FetchSectorTypeForMayday', function (ConvertParseObject) {
        return function (mayday) {
            if(mayday.sectorType) {
                return mayday.sectorType.fetch().then(
                    function(sectorType) {
                        ConvertParseObject(sectorType, SECTOR_TYPE_DEF);
                        mayday.sectorType = sectorType;
                    },
                    function(error) {
                        console.log('Failed to FetchSectorTypeForMayday, with error code: ' + error.message);
                    }
                );
            }
        }
    })

    .factory('DeleteMayday', ['Maydays', function (Maydays) {
        return function (mayday) {
            Maydays.remByVal(mayday);
            mayday.destroy(null, DefaultErrorLogger);
        }
    }])

;
