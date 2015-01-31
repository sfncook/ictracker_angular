angular.module('TbarServices', ['ParseServices', 'DataServices'])

    .factory('TbarSectors', function() {
        return new Array();
    })

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

    .factory('AddDefaultTbars', ['GridsterOpts', 'TbarSectors', 'ParseObject', 'SectorTypes', function (GridsterOpts, TbarSectors, ParseObject, SectorTypes) {
        return function () {
            var SectorParseObj = Parse.Object.extend('Sector');

            var rescuSector = new ParseObject(new SectorParseObj(), SECTOR_DEF);
            var rehabSector = new ParseObject(new SectorParseObj(), SECTOR_DEF);
            var safetSector = new ParseObject(new SectorParseObj(), SECTOR_DEF);

            rescuSector.sectorType = SectorTypes.RESCUE.data;
            rehabSector.sectorType = SectorTypes.REHAB.data;
            safetSector.sectorType = SectorTypes.SAFETY.data;

            rescuSector.col = GridsterOpts.columns - 1;
            rescuSector.row = 0;
            rehabSector.col = GridsterOpts.columns - 1;
            rehabSector.row = 1;
            safetSector.col = GridsterOpts.columns - 1;
            safetSector.row = 2;

            TbarSectors.push(rescuSector);
            TbarSectors.push(rehabSector);
            TbarSectors.push(safetSector);

            var manySectors = (GridsterOpts.rows * GridsterOpts.columns) - 3;
            for (var i = 0; i < manySectors; i++) {
                var blankSector = new ParseObject(new SectorParseObj(), SECTOR_DEF);
                blankSector.sectorType = SectorTypes.DEFAULT_SECTOR_TYPE.parseObject;
                TbarSectors.push(blankSector);
            }
        }
    }])

    .factory('AddTbar', ['TbarSectors', function (TbarSectors) {
        return function (newSector) {
            TbarSectors.push(newSector);
        }
    }])

    .factory('SaveTbars', ['TbarSectors', function (TbarSectors) {
        return function () {
            for(var i=0; i<TbarSectors.length; i++) {
                var sector = TbarSectors[i];
                sector.save();
            }
        }
    }])

;