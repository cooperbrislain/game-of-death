const Game = {
    start: function() {
        console.log('game starting...');
        drawSplashScreen();
    },
    playerSelect: function(which) {

    },
    opponentSelect: function(which) {

    },
    fight: function() {},
    endRound: function() {
        if (Player.hp <= 0) {
            this.lose();
        } else if (Opponent.hp <= 0) {
            this.win();
        }
    },
    win: function() {},
    lose: function() {}
};

const Fighter = {
    name: null,
    portrait: null,
    hp: null,
    stance: null,
    attack: function() {

    },
    counterAttack: function() {

    },
    takeDamage: function(amount) {
        this.hp -= amount;
    }
};

var Fighters = [];

function drawSplashScreen() {
    var $splash = $('<div>').addClass('jumbotron');
    $('<h1>').text('WOOK FIGHT').appendTo($splash);
    $('body').append($splash);
}

function drawFighterSelect() {
    var $popup = $('<div>');
    for (var i=0; i<Fighters.length;i++) {
        var $fightercard = $('<div class="card fighter-card>');
        $('<img>').attr('src',`assets/img/${Fighters[i].portrait}`).appendTo($fighterCard);
        $('<h3>').text(Fighters[i].name).appendTo($fighterCard);
    }
}

$(document).ready(function() {
    console.log('Loading Fighter Data');
    $.ajax('assets/data/fighters.json')
        .done(function(data) {
            console.log('Fighter Data Loaded');
            Fighters = data;
            Game.start();
        })
        .fail(function(jqXHR, textStatus) {
            console.log(`Failure: ${textStatus}`);
        });
});