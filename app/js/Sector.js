
function Sector(name) // Constructor
{
    this.name = name;
    this.units = [];
    this.parAvailable = false;
    this.haspar = false;
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

Sector.prototype.addUnit = function(unit)
{
    if(!this.units.contains(unit)) {
        this.units.push(unit);
    }

    if(this.units.length>0) {
        this.parAvailable = true;
    }
}
