
angular.module('ictApp')

    .controller('UpdateFetchTimer', function($scope, $interval, DataStore, UpdateSectorsAsNeeded, UpdateMaydays){
        function updateIncidentData() {
            var prevTxId = DataStore.incident.txid;
            DataStore.incident.fetch({
                success:function(incident){
                    if(incident.get('txid')!=prevTxId) {
                        UpdateSectorsAsNeeded($scope);
                        UpdateMaydays($scope);
                    }
                },
                error: function(obj, error) {
                    console.log('Failed to create new object, with error code: ' + error.message);
                }
            });
        }
        $interval(updateIncidentData, 3000);



        DataStore.timer_text = "00:00";
        DataStore.hourRollOverDone = false;
        var t0 = (new Date()).getTime();
        function updateTimer() {
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
                if (!DataStore.hourRollOverDone) {
                    DataStore.hourRollOverDone = true;
                }
                new_timer_text = hrStr+":"+minStr+":"+secStr;
            } else {
                new_timer_text = minStr+":"+secStr;
            }
            DataStore.timer_text = new_timer_text;
        }
        $interval(updateTimer, 1000);
    })

;
