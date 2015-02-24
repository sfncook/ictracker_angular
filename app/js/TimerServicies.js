
angular.module('ictApp')

    .directive('timer', function() {
            function link( $scope, element, attributes ) {
                $scope.timer_text = "00:00";
                $scope.hourRollOverDone = false;
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
                        if (!$scope.hourRollOverDone) {
                            $scope.hourRollOverDone = true;
                        }
                        new_timer_text = hrStr+":"+minStr+":"+secStr;
                    } else {
                        new_timer_text = minStr+":"+secStr;
                    }
                    $scope.timer_text = new_timer_text;
                    $scope.$digest();
                }
                window.setInterval(updateTimer, 1000);
            }

            // NOTE: By setting scope to TRUE, the directive creates a new child scope
            // that separates it from the parent scope (creating a isolated part of
            // the scope chain). This is an optimization so the timer updates do
            // not cause everything in the app to re-render.
            return({
                link: link,
                restrict: "A",
                scope: true
            });
        }
    )

    .controller('UpdateFetchTimer', function($scope, $interval, DataStore, UpdateSectorsAsNeeded, UpdateMaydays){
        function updateTimer() {
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
        $interval(updateTimer, 3000);
    })

;
