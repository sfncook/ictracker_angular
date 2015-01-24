angular.module('TbarServices', [])

    .factory('GridsterOpts', function () {
        var window_width = $(window).width();
        var window_height = $(window).height();
        var tbar_width = 290;
        var tbar_height = 300;
        var header_width = 100;
        var col_count = Math.floor((window_width - header_width) / tbar_width);
        var init_row_count = Math.floor(window_height / tbar_height);
        init_row_count = Math.max(init_row_count, 3);
        var left_margin = Math.floor((window_width - (col_count * tbar_width) - header_width ) / 2);
        $("#tbar_container").css("padding-left", left_margin);

        return {
            rows: init_row_count,
            columns: col_count,
            margins: [10, 10],
            outerMargin: true,
            colWidth: tbar_width,
            rowHeight: tbar_height,
            defaultSizeX: 1,
            draggable: {enabled: false},
            resizable: {enabled: false}
        };
    })

    .factory('TbarLayout', ['GridsterOpts', function (GridsterOpts) {
        return function ($scope) {

            var rescuSector = new Sector("RESCUE");
            var rehabSector = new Sector("ReHab");
            var safetSector = new Sector("Safety");

            rescuSector.col = GridsterOpts.columns - 1;
            rescuSector.row = 0;
            rehabSector.col = GridsterOpts.columns - 1;
            rehabSector.row = 1;
            safetSector.col = GridsterOpts.columns - 1;
            safetSector.row = 2;

            $scope.tbar_sectors.push(rescuSector);
            $scope.tbar_sectors.push(rehabSector);
            $scope.tbar_sectors.push(safetSector);

            var manySectors = (GridsterOpts.rows * GridsterOpts.columns) - 3;
            for (var i = 0; i < manySectors; i++) {
                var sector = new Sector("Sector Name");
                $scope.tbar_sectors.push(sector);
            }
        }
    }])

;