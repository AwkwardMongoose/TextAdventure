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
        //console.log(name+' #'+id+' loaded!')
    } else {
        let c = new Location(id,name,x,y,desc,parent,directions,evchance);
        //console.log(name+' #'+c.id+' created!')
        //console.log(c)
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

newLoc('start','Start',0,0,startDesc,null,'NSEW',10)
newLoc('north','North',0,-1,northDesc,null,'NSEW',10)
newLoc('south','South',0,1,southDesc,null,'NSEW',10)
newLoc('west','West',-1,0,westDesc,null,'NSEW',10)
newLoc('east','East',1,0,eastDesc,null,'NSEW',10)

function generateCells() {
    let exists = {};
    for(var x = -10; x < 11; x++) {
        for(var y = -10; y < 11; y++) {
            let obj = {
                'x': x,
                'y': y
            }
            exists[uuid()] = obj
        }
    }
    //console.log(exists)
    Object.entries(exists).forEach(el => {
        let nx = el[1];
        let nxid = el[0];
        if (coordCheck(nx.x,nx.y) == false) {
            console.log(nx)
            let desc = 'Welcome to cell '+nx.x+','+nx.y+'.';
            newLoc(nxid,nxid,nx.x,nx.y,desc,null,'NSEW',10)
        }
    })
}
generateCells()

function setLoc(location,ev) {
    console.log(location)
    mainChar.location = loc(location);
    let chance = ev != undefined ? ev : mainChar.location.evchance
    updateLoc(chance)
    updateUI()
}
ctx.translate(120,120)
function updateLoc(ch) {
    console.log(mainChar.location)
    let loca = mainChar.location;
    ctx.clearRect(-125, -125, canvas.width, canvas.height)
    Object.entries(gameState.locations.entries).forEach(el => {
        let eloc = el[1];
        ctx.fillStyle = "gray";
        ctx.fillRect(eloc.x*12,eloc.y*12, 10, 10);
    })
    ctx.fillStyle = 'yellow';
    console.log(loca)
    ctx.fillRect(loca.x*12,loca.y*12, 10, 10);

    console.log(mainChar.location)
    let evChance = ch != undefined ? ch : mainChar.location.evchance;
    console.log(evChance)
    if (roll(100) <= evChance) {
        $('#textframe').empty()
        $('#navframe').empty()
        $('#childframe').empty()
        $('#textframe').append(`
        EVENT
        `)
        let ex = `<div class='navlink' id=`+mainChar.location.id+`>`+mainChar.location.name+` (`+mainChar.location.direction+`)</div>`
        $('#navframe').append(ex+'<br>')
        $('.navlink').on('click', (el) => {
            setLoc(el.target.id)
        })
    } else {
        //let navList = getNavLinks(mainChar.location)
        $('#textframe').empty()
        $('#navframe').empty()
        $('#childframe').empty()
        $('#textframe').append(mainChar.location.desc+'<br><br><br>')
        //console.log(coordList(mainChar.location.id))
        coordList(mainChar.location.id).forEach(el => {
            let eloc = loc(el);
            console.log(eloc.id,eloc.direction)
            if (eloc.direction == 'North') {
                $('.dirup').off('click')
                $('.dirup').on('click', (el) => {
                    setLoc(eloc.id)
                })
            } else if (eloc.direction == 'South') {
                $('.dirdown').off('click')
                $('.dirdown').on('click', (el) => {
                    setLoc(eloc.id)
                })
            } else if (eloc.direction == 'West') {
                $('.dirleft').off('click')
                $('.dirleft').on('click', (el) => {
                    setLoc(eloc.id)
                })
            } else if (eloc.direction == 'East') {
                $('.dirright').off('click')
                $('.dirright').on('click', (el) => {
                    setLoc(eloc.id)
                })
            }
        })
    }
}

function getNavLinks(location) {
    let arr = [];
    coordList(location.id).forEach(el => {


        let x = `
        <div class='navlink' id=`+loc(el).id+`>`+loc(el).name+` (`+loc(el).direction+`)</div>
        `
        arr.push(x)
    })
    return arr;
}

//console.log(mainChar.location)
updateLoc(0)

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
            //console.log(curr.id,'North')
            curr.direction = 'North';
            arrList.push(curr.id)
        } else if (start.x == curr.x && start.y+1 == curr.y) {
            //console.log(curr.id,'South')
            curr.direction = 'South';
            arrList.push(curr.id)
        } else if (start.x-1 == curr.x && start.y == curr.y) {
            //console.log(curr.id,'West')
            curr.direction = 'West';
            arrList.push(curr.id)
        } else if (start.x+1 == curr.x && start.y == curr.y) {
            //console.log(curr.id,'East')
            curr.direction = 'East';
            arrList.push(curr.id)
        } else {
            curr.direction = ''
        }
    })
    return arrList
}

function coordCheck(x,y) {
    let result = false;
    Object.entries(gameState.locations.entries).forEach(el => {
        let ex = el[1];
        if (ex.x == x && ex.y == y) {
            result = true;
        }
    })
    return result
}

/*coordList('start').forEach(el => {
    console.log(loc(el))
    $('#textframe').append(loc(el).name+'<br>')
})*/