if (gameState.characters) {} else {
    var characters = {"id":'locations',"entries":{}};
}
if (gameState.characters) {} else {
    var characters = {"id":'events',"entries":{}};
}
if (gameState.characters) {} else {
    var characters = {"id":'encounters',"entries":{}};
}

class Location {
    constructor(id,name,x,y,desc,parent,directions,evchance) {
        this.id = id ? id : uuid();
        this.name = name;
        this.x = x;
        this.y = y;
        this.desc = desc;
        this.parent = parent;
        this.directions = directions ? directions : 'NSWE';
        this.evchance = evchance ? evchance : 10;
    }
    get store() {
        return gameState.locations.entries[this.id] = this;
    }
}

function newLoc(id,name,x,y,desc,parent,directions,evchance) {
    if (Object.keys(gameState.locations.entries).includes(id)) {
        console.log(name+' #'+id+' loaded!')
    } else {
        let c = new Location(id,name,x,y,desc,parent,directions,evchance);
        console.log(name+' #'+c.id+' created!')
        console.log(c)
        c.store;
    }
};

function loc($id) {
    if (Object.keys(gameState.locations.entries).includes($id))
    return gameState.locations.entries[$id];
}

var startDesc = `
Welcome to the Starting area!
`;

var northDesc = `
Welcome to the North!
`;

var southDesc = `
Welcome to the South!
`;

var eastDesc = `
Welcome to the East!
`;

var westDesc = `
Welcome to the West!
`;

newLoc('start','Start',0,0,startDesc,'NSEW',10)
newLoc('north','North',0,-1,northDesc,'NSEW',10)
newLoc('south','South',0,1,southDesc,'NSEW',10)
newLoc('west','West',-1,0,westDesc,'NSEW',10)
newLoc('east','East',1,0,eastDesc,'NSEW',10)

function setLoc(location) {
    console.log(location)
    mainChar.location = loc(location);
    updateLoc()
    updateUI()
}

function updateLoc() {
    console.log(mainChar.location)
    let navList = getNavLinks(mainChar.location)
    $('#textframe').empty()
    $('#textframe').append(mainChar.location.desc+'<br><br><br>')
    navList.forEach(el => {
        $('#textframe').append(el+'<br>')
    })
    $('.navlink').on('click', (el) => {
        setLoc(el.target.id)
    })
}

function getNavLinks(location) {
    let arr = [];
    coordList(location.id).forEach(el => {
        let x = `
        <div class='navlink' id=`+loc(el).id+`>`+loc(el).name+`</div>
        `
        arr.push(x)
    })
    return arr;
}

console.log(mainChar.location)
updateLoc()

class Event {
    constructor(id,name) {
        this.id = id ? id : uuid();
        this.name = name;
    }
    get store() {
        return gameState.events.entries[this.id] = this;
    }
}

function newEvent(id,name,hp,mp,race,gender) {
    if (Object.keys(gameState.characters.entries).includes(id)) {
        console.log(name+' #'+id+' loaded!')
    } else {
        let x = new Character(id,name,hp,mp,race,gender);
        console.log(name+' #'+x.id+' created!')
        console.log(x)
        x.store;
    }
};

function event($id) {
    if (Object.keys(gameState.events.entries).includes($id))
    return gameState.events.entries[$id];
}

class Encounter {
    constructor(id,name) {
        this.id = id ? id : uuid();
        this.name = name;
    }
    get store() {
        return gameState.encounters.entries[this.id] = this;
    }
}

function newEncounter(id,name,hp,mp,race,gender) {
    if (Object.keys(gameState.characters.entries).includes(id)) {
        console.log(name+' #'+id+' loaded!')
    } else {
        let x = new Character(id,name,hp,mp,race,gender);
        console.log(name+' #'+x.id+' created!')
        console.log(x)
        x.store;
    }
};

function encounter($id) {
    if (Object.keys(gameState.encounters.entries).includes($id))
    return gameState.encounters.entries[$id];
}

function coordList($id) {
    let start = loc($id);
    let arrList = [];
    Object.entries(gameState.locations.entries).forEach(el => {
        let curr = el[1];
        if (start.x == curr.x && start.y-1 == curr.y) {
            console.log(curr.id,'North')
            arrList.push(curr.id)
        } else if (start.x == curr.x && start.y+1 == curr.y) {
            console.log(curr.id,'South')
            arrList.push(curr.id)
        } else if (start.x-1 == curr.x && start.y == curr.y) {
            console.log(curr.id,'West')
            arrList.push(curr.id)
        } else if (start.x+1 == curr.x && start.y == curr.y) {
            console.log(curr.id,'East')
            arrList.push(curr.id)
        }
    })
    return arrList
}

/*coordList('start').forEach(el => {
    console.log(loc(el))
    $('#textframe').append(loc(el).name+'<br>')
})*/