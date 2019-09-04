const Game = {
    start: function() {
        Fighters = [];
        Player = undefined;
        Opponent = undefined;
        console.log('game starting...');
        console.log('Loading Fighter Data');
        $.ajax('assets/data/fighters.json')
        .done(function(data) {
            console.log('Fighter Data Loaded');
            data.forEach(function(fighterData) {
                var NewFighter = Object.assign({}, Fighter);
                Object.assign(NewFighter, fighterData);
                NewFighter.ap_adjusted = NewFighter.ap;
                Fighters.push(NewFighter);
            });
        })
        .fail(function(jqXHR, textStatus) {
            console.log(`Failure: ${textStatus}`);
        });
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
            Opponent.hp = 0;
            Player.status = "dead";
            this.lose();
        } else if (Opponent.hp <= 0) {
            Opponent.hp = 0;
            Opponent.status = "dead";
            this.win();
        }
        $('.player-side').html(Player.getCard());
        $('.opponent-side').html(Opponent.getCard());
    },
    win: function() {
        $('.btn-attack').remove();
        $('<div class="win">')
            .text('YOU WIN')
            .appendTo('.vs');
    },
    lose: function() {
        $('.btn-attack').remove();
        $('<div class="lose">')
            .text('YOU LOSE')
            .appendTo('.vs');
    }
};

const Fighter = {
    name: null,
    portrait: null,
    hp: null,
    ap_adjusted: null,
    stance: null,
    style: null,
    status: "alive",
    attack: function(target) {
        target.takeDamage(this.ap_adjusted);
        this.ap_adjusted += this.ap;
    },
    counterAttack: function(target) {
        target.takeDamage(this.cap);
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
        $('<dt>').append('<i class="fa fas fa-fist-raised">').appendTo($stats);
        $('<dd>').text(this.ap).appendTo($stats);
        $('<dt>').append('<i class="fa fas fa-yin-yang">').appendTo($stats);
        $('<dd>').text(this.cap).appendTo($stats);
        $('<dt>').append('<i class="fa fas fa-heart">').appendTo($stats);
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
    $('body').empty();
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
    $('<button>').addClass('btn btn-large btn-attack').text('Attack').appendTo($('.vs'));
}

$(document).ready(function() {
    Game.start();
    
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

    $(document).on('click', '.btn-attack', function() {
        console.log('attack clicked');
        Player.attack(Opponent);
        Opponent.counterAttack(Player);
        Game.endRound();
    });

    $(document).on('click', '.win', function() {
        Game.opponentSelect();
    });

    $(document).on('click', '.lose', function() {
        Game.start();
    });
});