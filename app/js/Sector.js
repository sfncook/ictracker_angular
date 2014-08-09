
function Sector(name) // Constructor
{
    this.name = name;
    this.units = [];
}

Sector.prototype.toggleUnit = function(unit)
{
    if(this.units.contains(unit)) {
        this.units.remByVal(unit);
    } else {
        this.units.push(unit);
    }
}
