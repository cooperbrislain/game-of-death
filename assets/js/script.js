const Game = {
    start: function() {
        console.log('game starting...');
        drawSplashScreen();
    },
    playerSelect: function(which) {
        drawFighterSelect();
    },
    opponentSelect: function(which) {
        drawFighterSelect();
    },
    fight: function() {
        drawFightArea();
    },
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
    },
    getCard: function() {
        $card = $('<div>')
            .addClass('card fighter-card');
        $('<div>')
            .addClass('card-header')
            .text(this.name)
            .appendTo($card);
        $('<div>')
            .addClass('card-body')
            .appendTo($card);
        $('<img>')
            .addClass('card-img')
            .attr('src',`assets/img/${(this.portrait? this.portrait : 'blank.jpg' )}`)
            .appendTo($card.find('.card-body'));
        $('<div>')
            .addClass('card-footer')
            .appendTo($card);

        $stats = $('<dl>')
            .addClass('stats');
        $('<dt>').text('Attack').appendTo($stats);
        $('<dd>').text(this.ap).appendTo($stats);
        $('<dt>').text('Counter').appendTo($stats);
        $('<dd>').text(this.cap).appendTo($stats);
        $('<dt>').text('HP').appendTo($stats);
        $('<dd>').text(this.hp).appendTo($stats);
        $stats.appendTo($card.find('.card-footer'));

        if (this.status == 'dead') {
            $card.addClass('dead');
            $('<div>')
                .addClass('cover x')
                .appendTo($card.find('.card-body'));
        }

        if (this === Player)
            $card.addClass('player-card');
        
        if (this === Opponent) 
            $card.addClass('opponent-card');
        
        return $card;
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
    var $screen = $('<div>').addClass('jumbotron fighter-select text-center');
    $('<h2>').text(`Choose Your ${Player === undefined? 'Fighter':'Opponent'}`).appendTo($screen);
    var $deck = $('<div>').addClass('card-deck').appendTo($screen);
    $.each(Fighters, function(index, theFighter) {
        var $fighterCard = theFighter.getCard();
        $fighterCard.data('fighter-index',index);
        $fighterCard.appendTo($deck);
    });
    $screen.appendTo($('body'));
}

function drawFightArea() {
    $('body').empty();
    var $screen = $('<div>').addClass('jumbotron fight');
    var $player_side = $('<div>').addClass('player-side col-sm-5');
    $player_side.append(Player.getCard());
    var $opponent_side = $('<div>').addClass('opponent-side col-sm-5');
    $opponent_side.append(Opponent.getCard());
    $screen.append($('<div>').addClass('row'));
    $screen.find('.row').append($player_side);
    $screen.find('.row').append($('<div>').addClass('vs col-sm-2'));
    $screen.find('.row').append($opponent_side);
    $screen.appendTo('body');
}

$(document).ready(function() {
    console.log('Loading Fighter Data');
    $.ajax('assets/data/fighters.json')
    .done(function(data) {
        console.log('Fighter Data Loaded');
        data.forEach(function(fighterData) {
            var NewFighter = Object.assign({}, Fighter);
            Object.assign(NewFighter, fighterData);
            Fighters.push(NewFighter);
        });
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
        theIndex = $(this).data('fighter-index');
        if (Player === undefined) {
            Player = Fighters[theIndex];
            console.log(`Player selected: ${theIndex}`);
            drawFighterSelect();
        } else {
            Opponent = Fighters[theIndex];
            console.log(`Opponent selected: ${theIndex}`);
            Game.fight();
        }
    });
});