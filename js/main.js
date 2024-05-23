    $('document').ready(function() {
        $('body').css('display','block')
    })

    var gameState = JSON.parse(localStorage.getItem('current'));

    if (localStorage.getItem('current')) {
        gameState = Introspected(JSON.parse(localStorage.getItem('current')),
        (root, path) => {
            console.log(gameState)
            stateSave()
            updateUI()
        });
    } else {
        gameState = Introspected({},
        (root, path) => {
            console.log(gameState)
            stateSave()
            updateUI()
        });
    }

    if (gameState.creatures) {} else {
        var creatures = {"id":'creatures',"entries":{}};
    }

    if (gameState.characters) {} else {
        var characters = {"id":'characters',"entries":{}};
    }
    
    function stateSave() {
        localStorage.setItem('current',JSON.stringify(gameState))
    }

    function uuid() {
        return Math.floor(Math.random() * Date.now()).toString(16)+"-"+Math.floor(Math.random() * Date.now()).toString(16);
    }

    class Creature {
        constructor(id,name,hp,mp,race) {
            this.id = id ? id : uuid();
            this.name = name;
            this.hp = hp;
            this.maxhp = hp;
            this.mp = mp;
            this.maxmp = mp;
            this.race = race;
        }
        get store() {
            return gameState.creatures.entries[this.id] = this;
        }
    }

    class Character {
        constructor(id,name,hp,mp,race,gender,location) {
            this.id = id ? id : uuid();
            this.name = name;
            this.hp = hp;
            this.maxhp = hp;
            this.mp = mp;
            this.maxmp = mp;
            this.race = race;
            this.gender = gender;
            this.location = location;
        }
        get store() {
            return gameState.characters.entries[this.id] = this;
        }
    }

    function newCreature(id,name,hp,mp,race) {
        if (Object.keys(gameState.creatures.entries).includes(id)) {
            console.log(name+' #'+id+' loaded!')
        } else if (id != 'mainChar') {
            let x = new Creature(id,name,hp,mp,race);
            console.log(name+' #'+x.id+' created!')
            console.log(x)
            x.store;
        } else if (id == 'mainChar') {

        }
    };

    function creature($id) {
        if (Object.keys(gameState.creatures.entries).includes($id))
        return gameState.creatures.entries[$id];
    }

    function newCharacter(id,name,hp,mp,race,gender,location) {
        if (Object.keys(gameState.characters.entries).includes(id)) {
            console.log(name+' #'+id+' loaded!')
        } else {
            let x = new Character(id,name,hp,mp,race,gender,location);
            console.log(name+' #'+x.id+' created!')
            x.store;
        }
    };

    function char($id) {
        if (Object.keys(gameState.characters.entries).includes($id))
        return gameState.characters.entries[$id];
    }

    const rootCSS = $(":root");
    const varToString = varObj => Object.keys(varObj)[0];
    const damageButton = document.getElementById('damagetest');
    var navChecks = Array.from(document.getElementsByClassName('navcheck'));
    var classTest = $(".navcheck");
    var hpBar = $("#hpbar");

    document.getElementById('createfinish').addEventListener('click', () => {
        let name = document.getElementById('nameselect').value;
        let gender = document.querySelector('input[name="genderselect"]:checked').value;
        let race = document.querySelector('input[name="raceselect"]:checked').value;
        newCharacter('mainChar',name,10,0,race,gender,loc('start'))
        $('.createtop').css('display','none');
        mainChar = char('mainChar')
        updateUI()
        updateLoc()
        location.reload()
        //console.log(mainChar)
    })

    if (char('mainChar')) {} else {
        $('.createtop').css('display','flex');
    }

    var mainChar = char('mainChar');

    newCreature(null,'Anonymous',10,0);

    function get(obj) {
        return JSON.parse(localStorage.getItem(obj))
    }

    updateUI()

    function dealDamage(target,amount) {
        damage = target.hp>0 ? amount : 0;
        target.hp -= damage;
        //console.log(damage)
        updateHP()
        deathCheck(target)
        //stateSave()
    }

    function deathCheck(target) {
        if (target.hp <= 0) {
            //console.log(target.name+" is DEAD!")
        }
    }
    
    navChecks.forEach(el => {
        el.addEventListener('change', () => {
            navChecks.forEach(el2 => {
                if (el.checked && el2 != el && el2.checked) {
                    el2.checked = false            }
            })
        })
    })

    damageButton.addEventListener("click", () => {
        dealDamage(char('mainChar'),2)
    });

    $("span").html(function(index, html){
        if (char('mainChar')) {
            return html.replace('${NAME}', mainChar.name);
        }
    });

    function updateHP () {
        if (mainChar) {
            let currHP = mainChar.hp/mainChar.maxhp*100;
            if (currHP <= mainChar.maxhp/mainChar.maxhp*100) {
                if (currHP <= 0) {
                    currHP = 0;
                    mainChar.hp = 0;
                } else {
                    currHP = mainChar.hp/mainChar.maxhp*100;
                }
            } else {
                currHP = mainChar.maxhp/mainChar.maxhp*100;
                mainChar.hp = mainChar.maxhp
            }
            //console.log(mainChar.hp+"/"+mainChar.maxhp,currHP+"%")
            rootCSS.css('--hpfill',currHP+"%")
            hpBar[0].title = mainChar.hp+" / "+mainChar.maxhp;
        }
    }

    function updateUI (a,b,c) {
        $("span").html(function(index, html){
            if (mainChar) {
                return html.replace('${NAME}', mainChar.name);
            }
        });
        updateHP()
    }




    //for ( var i = 0, len = localStorage.length; i < len; ++i ) {
    //    console.log(JSON.parse(localStorage.getItem(localStorage.key(i))) );
    //}
      console.log(localStorage)