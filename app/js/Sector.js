
const BNCH_OFF=0;
const BNCH_ON=1;
const BNCH_ERR=2;

function Sector(name) // Constructor
{
    this.name = name;
    this.units = [];
    this.actions = [];
    this.acctUnit = {'name':'@acct'};
    this.parAvailable = false;
    this.hasPar = false;

    // Formatting attributes
    this.hasClock = false;
    this.hasAcctBtn = true;
    this.hasPsiBtn = true;
    this.hasActions = true;

    // Benchmarks
    this.bnch_primaryAlClear = BNCH_OFF;
    this.bnch_underCtl = BNCH_OFF;
    this.bnch_secondaryAlClear = BNCH_OFF;
    this.bnch_lossStop = BNCH_OFF;

    // Secondary Benchmarks
    this.bnch_primaryAlClear_par = BNCH_OFF;
    this.bnch_primaryAlClear_notify = BNCH_OFF;
    this.bnch_primaryAlClear_challenge = BNCH_OFF;

    this.bnch_underCtl_par = BNCH_OFF;
    this.bnch_underCtl_notify = BNCH_OFF;
    this.bnch_underCtl_obtain = BNCH_OFF;

    this.bnch_secondaryAlClear_par = BNCH_OFF;
    this.bnch_secondaryAlClear_notify = BNCH_OFF;

    this.bnch_lossStop_par = BNCH_OFF;
    this.bnch_lossStop_notify = BNCH_OFF;
}

/*
 * Return true if unit was added and false if unit was removed.
 */
Sector.prototype.toggleUnit = function(unit)
{
    var wasAdded;
    if(this.units.contains(unit)) {
        this.units.remByVal(unit);
        wasAdded = false;
    } else {
        this.units.push(unit);
        wasAdded = true;
    }

    if(this.units.length>0) {
        this.parAvailable = true;
    } else {
        this.parAvailable = false;
    }
    return wasAdded;
}

Sector.prototype.setAcctUnit = function(unit)
{
    this.acctUnit = unit;
}


Sector.prototype.addUnit = function(unit)
{
    if(!this.units.contains(unit)) {
        this.units.push(unit);
    }

    if(this.units.length>0) {
        this.parAvailable = true;
    }
}

Sector.prototype.toggleHasPar = function() {
    this.hasPar = !this.hasPar;
}

Sector.prototype.toggle_bnch_primary = function() {
    if(this.bnch_primaryAlClear) {
        this.bnch_primaryAlClear = BNCH_OFF;
        this.bnch_underCtl = BNCH_OFF;
        this.bnch_secondaryAlClear = BNCH_OFF;
        this.bnch_lossStop = BNCH_OFF;

        // Secondary Benchmarks
        this.bnch_primaryAlClear_par = BNCH_OFF;
        this.bnch_primaryAlClear_notify = BNCH_OFF;
        this.bnch_primaryAlClear_challenge = BNCH_OFF;

        this.bnch_underCtl_par = BNCH_OFF;
        this.bnch_underCtl_notify = BNCH_OFF;
        this.bnch_underCtl_obtain = BNCH_OFF;

        this.bnch_secondaryAlClear_par = BNCH_OFF;
        this.bnch_secondaryAlClear_notify = BNCH_OFF;

        this.bnch_lossStop_par = BNCH_OFF;
        this.bnch_lossStop_notify = BNCH_OFF;
    } else {
        this.bnch_primaryAlClear = BNCH_ON;
        this.bnch_primaryAlClear_par = BNCH_OFF;
        this.bnch_primaryAlClear_notify = BNCH_OFF;
        this.bnch_primaryAlClear_challenge = BNCH_OFF;
    }
}
Sector.prototype.toggle_bnch_underctl = function() {
    if(this.bnch_underCtl) {
        this.bnch_underCtl = BNCH_OFF;
        this.bnch_secondaryAlClear = BNCH_OFF;
        this.bnch_lossStop = BNCH_OFF;

        // Secondary Benchmarks
        this.bnch_primaryAlClear_par = BNCH_OFF;
        this.bnch_primaryAlClear_notify = BNCH_OFF;
        this.bnch_primaryAlClear_challenge = BNCH_OFF;

        this.bnch_underCtl_par = BNCH_OFF;
        this.bnch_underCtl_notify = BNCH_OFF;
        this.bnch_underCtl_obtain = BNCH_OFF;

        this.bnch_secondaryAlClear_par = BNCH_OFF;
        this.bnch_secondaryAlClear_notify = BNCH_OFF;

        this.bnch_lossStop_par = BNCH_OFF;
        this.bnch_lossStop_notify = BNCH_OFF;
    } else {
        this.bnch_underCtl = BNCH_ON;
        this.bnch_underCtl_par = BNCH_OFF;
        this.bnch_underCtl_notify = BNCH_OFF;
        this.bnch_underCtl_obtain = BNCH_OFF;
    }
}
Sector.prototype.toggle_bnch_secondary = function() {
    if(this.bnch_secondaryAlClear) {
        this.bnch_secondaryAlClear = BNCH_OFF;
        this.bnch_lossStop = BNCH_OFF;

        // Secondary Benchmarks
        this.bnch_primaryAlClear_par = BNCH_OFF;
        this.bnch_primaryAlClear_notify = BNCH_OFF;
        this.bnch_primaryAlClear_challenge = BNCH_OFF;

        this.bnch_underCtl_par = BNCH_OFF;
        this.bnch_underCtl_notify = BNCH_OFF;
        this.bnch_underCtl_obtain = BNCH_OFF;

        this.bnch_secondaryAlClear_par = BNCH_OFF;
        this.bnch_secondaryAlClear_notify = BNCH_OFF;

        this.bnch_lossStop_par = BNCH_OFF;
        this.bnch_lossStop_notify = BNCH_OFF;
    } else {
        this.bnch_secondaryAlClear = BNCH_ON;
        this.bnch_secondaryAlClear_par = BNCH_OFF;
        this.bnch_secondaryAlClear_notify = BNCH_OFF;
    }
}
Sector.prototype.toggle_bnch_lossstop = function() {
    if(this.bnch_lossStop) {
        this.bnch_lossStop = BNCH_OFF;

        // Secondary Benchmarks
        this.bnch_primaryAlClear_par = BNCH_OFF;
        this.bnch_primaryAlClear_notify = BNCH_OFF;
        this.bnch_primaryAlClear_challenge = BNCH_OFF;

        this.bnch_underCtl_par = BNCH_OFF;
        this.bnch_underCtl_notify = BNCH_OFF;
        this.bnch_underCtl_obtain = BNCH_OFF;

        this.bnch_secondaryAlClear_par = BNCH_OFF;
        this.bnch_secondaryAlClear_notify = BNCH_OFF;

        this.bnch_lossStop_par = BNCH_OFF;
        this.bnch_lossStop_notify = BNCH_OFF;
    } else {
        this.bnch_lossStop = BNCH_ON;
        this.bnch_lossStop_par = BNCH_OFF;
        this.bnch_lossStop_notify = BNCH_OFF;
    }
}

Sector.prototype.toggle_bnch_primary_par = function() {
    if(this.bnch_primaryAlClear_par) {
        this.bnch_primaryAlClear_par = BNCH_OFF;
        this.bnch_primaryAlClear_notify = BNCH_OFF;
        this.bnch_primaryAlClear_challenge = BNCH_OFF;
    } else {
        this.bnch_primaryAlClear_par = BNCH_ON;
        this.bnch_primaryAlClear_notify = BNCH_OFF;
        this.bnch_primaryAlClear_challenge = BNCH_OFF;
    }
}
Sector.prototype.toggle_bnch_primary_notify = function() {
    if(this.bnch_primaryAlClear_notify) {
        this.bnch_primaryAlClear_notify = BNCH_OFF;
        this.bnch_primaryAlClear_challenge = BNCH_OFF;
    } else {
        this.bnch_primaryAlClear_notify = BNCH_ON;
        this.bnch_primaryAlClear_challenge = BNCH_OFF;
    }
}
Sector.prototype.toggle_bnch_primary_challenge = function() {
    if(this.bnch_primaryAlClear_challenge) {
        this.bnch_primaryAlClear_challenge = BNCH_OFF;
    } else {
        this.bnch_primaryAlClear_challenge = BNCH_ON;
    }
}

Sector.prototype.toggle_bnch_underctl_par = function() {
    if(this.bnch_underCtl_par) {
        this.bnch_underCtl_par = BNCH_OFF;
        this.bnch_underCtl_notify = BNCH_OFF;
        this.bnch_underCtl_obtain = BNCH_OFF;

    } else {
        this.bnch_underCtl_par = BNCH_ON;
        this.bnch_underCtl_notify = BNCH_OFF;
        this.bnch_underCtl_obtain = BNCH_OFF;
    }
}
Sector.prototype.toggle_bnch_underctl_notify = function() {
    if(this.bnch_underCtl_notify) {
        this.bnch_underCtl_notify = BNCH_OFF;
        this.bnch_underCtl_obtain = BNCH_OFF;

    } else {
        this.bnch_underCtl_notify = BNCH_ON;
        this.bnch_underCtl_obtain = BNCH_OFF;
    }
}
Sector.prototype.toggle_bnch_underctl_obtain = function() {
    if(this.bnch_underCtl_obtain) {
        this.bnch_underCtl_obtain = BNCH_OFF;

    } else {
        this.bnch_underCtl_obtain = BNCH_ON;
    }
}

Sector.prototype.toggle_bnch_secondary_par = function() {
    if(this.bnch_lossStop) {
        this.bnch_secondaryAlClear_par = BNCH_OFF;
        this.bnch_secondaryAlClear_notify = BNCH_OFF;
    } else {
        this.bnch_secondaryAlClear_par = BNCH_ON;
        this.bnch_secondaryAlClear_notify = BNCH_OFF;
    }
}
Sector.prototype.toggle_bnch_secondary_notify = function() {
    if(this.bnch_secondaryAlClear_notify) {
        this.bnch_secondaryAlClear_notify = BNCH_OFF;
    } else {
        this.bnch_secondaryAlClear_notify = BNCH_ON;
    }
}

Sector.prototype.toggle_bnch_lossstop_par = function() {
    if(this.bnch_lossStop_par) {
        this.bnch_lossStop_par = BNCH_OFF;
        this.bnch_lossStop_notify = BNCH_OFF;
    } else {
        this.bnch_lossStop_par = BNCH_ON;
        this.bnch_lossStop_notify = BNCH_OFF;
    }
}

Sector.prototype.toggle_bnch_lossstop_notif = function() {
    if(this.bnch_lossStop_notify) {
        this.bnch_lossStop_notify = BNCH_OFF;
    } else {
        this.bnch_lossStop_notify = BNCH_ON;
    }
}

