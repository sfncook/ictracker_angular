
function Sector(name) // Constructor
{
    this.name = name;
    this.units = [];
    this.actions = [];
    this.acctUnit = {'name':'@acct'};
    this.parAvailable = false;
    this.haspar = false;

    // Formatting attributes
    this.hasClock = false;
    this.hasAcctBtn = true;
    this.hasPsiBtn = true;
    this.hasActions = true;
}

Sector.prototype.toggleUnit = function(unit)
{
    if(this.units.contains(unit)) {
        this.units.remByVal(unit);
    } else {
        this.units.push(unit);
    }

    if(this.units.length>0) {
        this.parAvailable = true;
    } else {
        this.parAvailable = false;
    }
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

Sector.prototype.toggleAction = function(action)
{
    if(this.actions.contains(action)) {
        this.actions.remByVal(action);
    } else {
        this.actions.push(action);
    }
}
