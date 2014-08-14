
var app = angular.module("ictApp");

/**
 * Returns a list of units that are in all the sectors. For units that
 * are in 2 or more sectors this will include them only once.
 * @param [sectors] The array of sectors
 * @return {array}
 *
 * Example how to use:
 * ng-repeat="sector in tbar_sectors | sector_units"
 */
app.filter('sector_units', function () {

    return function (sectors) {
        var units=[];

        sectors.forEach(function(sector) {
            sector.units.forEach(function(unit){
                if(units.indexOf(unit)<0) {
                    units.push(unit);
                }
            });
        });

        return units;
    };
});