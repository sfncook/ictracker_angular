Sector.prototype = Object.create(MutableObject.prototype);
Sector.prototype.constructor = Sector;

function Sector(name) // Constructor
{
    // super
    this.init();

    this.set('name', name);
    this.units = [];
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

    this.addTxSwitch('name');
    this.addTxSwitch('units');
    this.addTxSwitch('acctUnit');
}

/*
 * Return true if unit was added and false if unit was removed.
 */
Sector.prototype.toggleUnit = function (unit) {
    var isFirstUnit = this.units.length == 0;

    var wasAdded;
    if (this.units.contains(unit)) {
        this.units.remByVal(unit);
        wasAdded = false;
    } else {
        this.units.push(unit);
        wasAdded = true;
    }

    if (this.units.length > 0) {
        this.parAvailable = true;
    } else {
        this.parAvailable = false;
    }

    if (isFirstUnit) {
        unit.actions = this.selectedUnit.actions.clone();
        this.selectedUnit = unit;
    }

    return wasAdded;
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