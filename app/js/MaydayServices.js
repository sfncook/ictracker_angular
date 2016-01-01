
angular.module('MaydayServices', ['DataServices', 'AdapterServices'])

    .controller('MaydayDlg', function($scope, $interval, DataStore, OpenMaydayDlgForMayday, SaveSelectedMayday, DeleteMayday){
        $scope.dataStore = DataStore;
        DataStore.maydays = new Array();
        $scope.openMaydayDlgForMayday = OpenMaydayDlgForMayday;
        $scope.dataStore.saveSelectedMayday = SaveSelectedMayday;

        $scope.clearMayday = function (method) {
            if(method) {
                switch(method) {
                    case 'slfrs':
                        // TODO: log event for report
                        DeleteMayday(DataStore.selectedMayday);
                        $("#mayday_dlg").dialog( "close" );
                        break;
                    case 'rescu':
                        // TODO: log event for report
                        DeleteMayday(DataStore.selectedMayday);
                        $("#mayday_dlg").dialog( "close" );
                        break;
                    case 'ffmia':
                        // TODO: log event for report
                        DeleteMayday(DataStore.selectedMayday);
                        $("#mayday_dlg").dialog( "close" );
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
            DataStore.selectedMayday.unit.psi = psi;
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

    .factory('DeleteMayday', function (AdapterStore) {
        return function (mayday) {
            return AdapterStore.adapter.DeleteMayday(mayday);;
        }
    })

;

