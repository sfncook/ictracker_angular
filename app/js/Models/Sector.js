function Sector(name) // Constructor
{
    this.name = name;
    this.units = new Array();
    this.selectedUnit = new Unit();
    this.acctUnit = {'name': '@acct'};
    this.parAvailable = false;
    this.hasPar = false;

    // Formatting attributes
    this.hasClock = false;
    this.hasAcctBtn = true;
    this.hasPsiBtn = true;
    this.hasActions = true;

    // Benchmarks
    this.bnch = 0;
    this.unable_primary = false;
    this.unable_secondary = false;
}

Sector.model = ['name', 'incident', 'units', 'row', 'col'];

/*
 * Return true if unit was added and false if unit was removed.
 */
Sector.prototype.toggleUnit = function (catalogUnit) {
    var isFirstUnit = this.units.length == 0;

    var wasAdded;
    var unit = this.findUnitByName(catalogUnit.name);
    if (unit!=null) {
        this.units.remByVal(unit);
        wasAdded = false;
    } else {
        var newUnit = new Unit(catalogUnit.name, catalogUnit.type, catalogUnit.city, true);
        this.units.push(newUnit);
        wasAdded = true;

        if (isFirstUnit) {
            newUnit.actions = this.selectedUnit.actions.clone();
            this.selectedUnit = newUnit;
        }
    }

    if (this.units.length > 0) {
        this.parAvailable = true;
    } else {
        this.parAvailable = false;
    }

    return wasAdded;
}

// Utility method for above
Sector.prototype.findUnitByName = function (unitName) {
    for(var i=0; i<this.units.length; i++) {
        var unit = this.units[i];
        if(unit.name==unitName) {
            return unit;
        }
    }
    return null;
}

Sector.prototype.setAcctUnit = function (unit) {
    this.acctUnit = unit;
}


Sector.prototype.addUnit = function (unit) {
    if (!this.units.contains(unit)) {
        this.units.push(unit);
    }

    if (this.units.length > 0) {
        this.parAvailable = true;
    }
}

Sector.prototype.toggleHasPar = function () {
    this.hasPar = !this.hasPar;
}

Sector.prototype.toggleBnch = function (newBnch) {
    if (this.bnch >= newBnch) {
        this.bnch = newBnch - 1;
    } else {
        this.bnch = newBnch;
    }

    if (this.bnch >= 1) {
        this.unable_primary = false;
    }

    if (this.bnch >= 9) {
        this.unable_secondary = false;
    }
}
Sector.prototype.toggleUnablePrimary = function () {
    this.unable_primary = !this.unable_primary;
    if (this.unable_primary) {
        this.bnch = 0;
    }
}
Sector.prototype.toggleUnableSecondary = function () {
    this.unable_secondary = !this.unable_secondary;
    if (this.unable_secondary) {
        this.bnch = 7;
    }
}

Sector.prototype.toggleAction = function (action) {
    this.selectedUnit.toggleAction(action);
}

Sector.prototype.selectUnit = function (unit) {
    this.selectedUnit = unit;
}