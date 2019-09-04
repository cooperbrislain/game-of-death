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
    style: null,
    status: "alive",
    attack: function() {

    },
    counterAttack: function() {

    },
    takeDamage: function(amount) {
        this.hp -= amount;
    }
};

var Fighters = [];

var Player;
var Opponent;

function drawSplashScreen() {
    var $splash = $('<div>').addClass('jumbotron splash');
    $('<h1>').text('GAME OF DEATH').appendTo($splash);
    $('<img>').attr('src',`assets/img/game-of-death.png`).appendTo($splash);
    $('body').append($splash);
}

function drawFighterSelect() {
    $('body').empty();
    var $screen = $('<div>').addClass('jumbotron fighter-select')
    var $deck = $('<div>').addClass('card-deck').appendTo($screen);
    for (var i=0; i<Fighters.length;i++) {
        var $fighterCard = $('<div>')
            .addClass('card fighter-card')
            .data('fighter-index',i);
        if (Fighters[i] == Player) {
            $fighterCard.addClass('player-card');
        }
        $('<img>')
            .addClass('card-img')
            .attr('src',`assets/img/${(Fighters[i].portrait? Fighters[i].portrait : 'blank.jpg' )}`)
            .appendTo($fighterCard);
        $('<h3>')
            .addClass('text-center')
            .text(Fighters[i].name)
            .appendTo($fighterCard);
        $fighterCard.appendTo($deck);
    }
    $screen.appendTo($('body'));
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
    
    $(document).on('click', '.splash', function() {
        $(this).remove();
        drawFighterSelect();
    });

    $(document).on('click', '.fighter-select .fighter-card:not(.player-card):not(.dead)', function() {
        theIndex = $('.fighter-card').data('fighter-index');
        if (Player === undefined) {
            Player = Fighters[theIndex];
            console.log(`Player selected: ${theIndex}`);
            drawFighterSelect();
        } else {
            Opponent = Fighters[theIndex];
            console.log(`Opponent selected: ${theIndex}`);
        }
    });
});