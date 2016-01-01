angular.module('TbarServices', ['DataServices', 'SectorServices', 'AdapterServices'])

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

    .factory('LoadDefaultTbars', function (AdapterStore, GridsterOpts, SectorTypes) {
        return function (incident) {

            var rescuSector = AdapterStore.adapter.CreateNewSector();
            var rehabSector = AdapterStore.adapter.CreateNewSector();
            var safetSector = AdapterStore.adapter.CreateNewSector();

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

            rescuSector.initialized = true;
            rehabSector.initialized = true;
            safetSector.initialized = true;

            incident.sectors = new Array();
            incident.sectors.push(rescuSector);
            incident.sectors.push(rehabSector);
            incident.sectors.push(safetSector);

            for(var col=0; col<GridsterOpts.columns; col++) {
                for(var row=0; row<GridsterOpts.rows; row++) {
                    if(
                        (row==rescuSector.row && col==rescuSector.col) ||
                            (row==rehabSector.row && col==rehabSector.col) ||
                            (row==safetSector.row && col==safetSector.col)
                        ) {
                    } else {
                        var blankSector = AdapterStore.adapter.CreateNewSector();
                        blankSector.sectorType = SectorTypes.DEFAULT_SECTOR_TYPE;
                        blankSector.row = row;
                        blankSector.col = col;
                        blankSector.incident = incident;
                        incident.sectors.push(blankSector);
                    }
                }
            }//for
        }
    })

    .factory('AddTbar', ['TbarSectors', function (TbarSectors) {
        return function (newSector) {
            TbarSectors.push(newSector);
        }
    }])

    .factory('SaveTbars', ['TbarSectors', 'DefaultErrorLogger', function (TbarSectors, DefaultErrorLogger) {
        return function () {
            for(var i=0; i<TbarSectors.length; i++) {
                var sector = TbarSectors[i];
                sector.save(null, DefaultErrorLogger);
            }
        }
    }])

    .factory('CreateBlankSectorType', function (AdapterStore) {
        return function () {
            var BLANK_SECTOR_TYPE = AdapterStore.adapter.CreateNewSectorType();
            BLANK_SECTOR_TYPE.isVisible = false;
            return BLANK_SECTOR_TYPE;
        }
    })

    .factory('ToggleUnitTypeForSector', [
        'CreateNewUnit', 'ReportFunctions', 'DefaultErrorLogger',
        function (CreateNewUnit, ReportFunctions, DefaultErrorLogger) {
        return function (sector, unitType) {
            if(sector.units) {
                // search for unitType already in sector
                for(var i=0; i<sector.units.length; i++) {
                    var unit = sector.units[i];
                    if(unit.type.name==unitType.name) {
                        sector.units.remByVal(unit);
                        unit.destroy(null, DefaultErrorLogger);
                        return false;
                    }
                }//for
                var newUnit = CreateNewUnit(sector, unitType);
                sector.units.push(newUnit);
                ReportFunctions.addEvent_unit_to_sector(sector, newUnit);
                return true;
            } else {
                // Add unit to sector
                sector.units = new Array();
                var newUnit = CreateNewUnit(sector, unitType);
                sector.units.push(newUnit);
                ReportFunctions.addEvent_unit_to_sector(sector, newUnit);
                return true;
            }
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
