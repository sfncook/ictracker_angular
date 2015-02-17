angular.module('TbarServices', ['ParseServices', 'DataServices', 'SectorServices'])

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

    .factory('AddDefaultTbars', ['GridsterOpts', 'TbarSectors', 'ConvertParseObject', 'SectorTypes', function (GridsterOpts, TbarSectors, ConvertParseObject, SectorTypes) {
        return function (incident) {
            var SectorParseObj = Parse.Object.extend('Sector');

            var rescuSector = new SectorParseObj()
            var rehabSector = new SectorParseObj()
            var safetSector = new SectorParseObj()

            new ConvertParseObject(rescuSector, SECTOR_DEF);
            new ConvertParseObject(rehabSector, SECTOR_DEF);
            new ConvertParseObject(safetSector, SECTOR_DEF);

            rescuSector.sectorType = SectorTypes.RESCUE;
            rehabSector.sectorType = SectorTypes.REHAB;
            safetSector.sectorType = SectorTypes.SAFETY;

            rescuSector.col = GridsterOpts.columns - 1;
            rescuSector.row = 0;
            rehabSector.col = GridsterOpts.columns - 1;
            rehabSector.row = 1;
            safetSector.col = GridsterOpts.columns - 1;
            safetSector.row = 2;

            rescuSector.incident = incident;
            rehabSector.incident = incident;
            safetSector.incident = incident;

            TbarSectors.push(rescuSector);
            TbarSectors.push(rehabSector);
            TbarSectors.push(safetSector);

//            var manySectors = (GridsterOpts.rows * GridsterOpts.columns) - 3;
//            for (var i = 0; i < manySectors; i++) {
            for(var col=0; col<GridsterOpts.columns; col++) {
                for(var row=0; row<GridsterOpts.rows; row++) {
                    if(
                        (row==rescuSector.row && col==rescuSector.col) ||
                            (row==rehabSector.row && col==rehabSector.col) ||
                            (row==safetSector.row && col==safetSector.col)
                        ) {
                    } else {
                        var blankSector = new SectorParseObj();
                        ConvertParseObject(blankSector, SECTOR_DEF);
                        blankSector.sectorType = SectorTypes.DEFAULT_SECTOR_TYPE;
                        blankSector.row = row;
                        blankSector.col = col;
                        blankSector.incident = incident;
                        TbarSectors.push(blankSector);
                    }
                }
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

    .factory('CreateBlankSectorType', ['ConvertParseObject', function (ConvertParseObject) {
        return function () {
            var SectorTypeParseObj = Parse.Object.extend('SectorType');
            var BLANK_SECTOR_TYPE = new SectorTypeParseObj();
            ConvertParseObject(BLANK_SECTOR_TYPE, SECTOR_TYPE_DEF);
            BLANK_SECTOR_TYPE.isVisible = false;
            return BLANK_SECTOR_TYPE;
        }
    }])

    .factory('ToggleUnitTypeForSector', ['CreateNewUnit', function (CreateNewUnit) {
        return function (sector, unitType) {
            if(sector.units) {
                // search for unitType already in sector
                for(var i=0; i<sector.units.length; i++) {
                    var unit = sector.units[i];
                    if(unit.type.name==unitType.name) {
                        sector.units.remByVal(unit);
                        unit.destroy();
                        return false;
                    }
                }//for
                var newUnit = CreateNewUnit(sector, unitType);
                return true;
            } else {
                // Add unit to sector
                sector.units = new Array();
                var newUnit = CreateNewUnit(sector, unitType);
                return true;
            }
        }
    }])

    .factory('ToggleActionTypeForUnit', [function () {
        return function (unit, actionType) {
            var addedAction = false;
            if(unit.actions) {
                if(unit.actions.indexOf(actionType)>=0) {
                    unit.actions.remByVal(actionType);
                    addedAction = false;
                } else {
                    unit.actions.push(actionType);
                    addedAction = true;
                }
            } else {
                // Add unit to sector
                unit.actions = new Array();
                unit.actions.push(actionType);
                addedAction = true;
            }
            unit.save(null, {error: function(object, error) {
                console.log('Failed to create new object, with error code: ' + error.message);
            }});
            return addedAction;
        }
    }])

    /*
     * This is a getter, do not count on the array to be updated dynamically.
     */
    .factory('GetIncidentUnits', ['TbarSectors', function (TbarSectors) {
        return function () {
            var incidentUnits = new Array();
            for(var t=0; t<TbarSectors.length; t++) {
                var sector = TbarSectors[t];
                for(var u=0; u<sector.units.length; u++) {
                    var unit = sector.units[u];
                    incidentUnits.push(unit);
                }
            }//for
            return incidentUnits;
        }
    }])

;
