function Unit(name, type, city) // Constructor
{
    this.name = name;
    this.type = type;
    this.city = city;
    this.par = 'P';
    this.psi = 4000;
    this.actions = [];
}

Sector.prototype.toggleAction = function(action)
{
    if(this.actions.contains(action)) {
        this.actions.remByVal(action);
    } else {
        this.actions.push(action);
    }

}