var turns = 0;
var cheat = false;
var resetty = false;
var a = 0;
var b = 0;
var pad = parseInt($('.drop').css('padding-top').replace('px', ''), 10);
var triangle;
var lastclicked = null;


function resizer() {
    /*if ($(window).height() < 768 && $(window).height() < $(window).width()) {
        $('.cont').css({
            'max-width': $(window).height() - 200 + "px"
        });
    }*/
    
    var wid = $('.drop').width();
    var outwid = $('.drop').outerWidth();
    triangle = '0 ' + ((outwid / 2) - pad) + 'px ' + (((wid) - 2) - pad) + 'px ' + ((outwid / 2) - pad) + 'px;';
    

    $('<style>  .draggable,.helperPick{line-height:' + (wid) + 'px;height:' + (wid) + 'px;}.drop,.helperPick{height:' + (outwid) + 'px; }.helperPick{width:' + (wid) + 'px}</style>').appendTo('head');
}

$(window).resize(resizer).trigger("resize");
addToHomescreen();

function updateHud() {

    $('#turn').html('Player' + ((turns % 2) + 1) + "'s turn...");
    $('#round').html("Round: " + (parseInt(turns / 2, 10) + 1));
    if (turns < 6) {
        $('#info').html(Math.abs(turns - 6) + ' Turns until you can move the pieces.');
    } else if (turns < 12) {
        $('#info').html(Math.abs(turns - 12) + ' more turns until you can make a line.');
    } else {
        $('#info').html('Start making lines people.');
    }
}


$('.drop').click(function () {
    if (turns < 6) {
        if ($(this).children().length === 0) {

            if (((turns % 2) + 1) == 2) {

                $(this).append('<div class="draggable P2" style="border-width:' + triangle + '">' + getName(2) + '</div>');

            } else {

                $(this).append('<div class="draggable P1">' + getName(1) + '</div>');

            }

            checkWin(false);
            turns++;

            if ($('#info').html() == "New Game Let's Go!") {

                cheat = false;
            }

            if (cheat) {

                reset(getName((turns % 2) + 1) == 2);

            }

            updateHud();

        }
    }
    if (turns > 5) {

        if (turns == 6) {

            makeEm();
        }



        if (resetty && turns == 6) {

            resetty = false;
            lastclicked = null;
            $('.drop').each(function () {
                $(this).removeClass('selected');
            });
            return false;

        }




        if (lastclicked === null && $(this).children(".draggable").size() > 0 && $(this).children(".draggable").text() == getName((turns % 2) + 1)) {
            $(this).addClass('selected');
            lastclicked = $(this);
        } else if ($(this).children(".draggable").size() === 0) {

            var bmoved = lastclicked.children(".draggable")[0];

            if ($(bmoved).text() == getName((turns % 2) + 1)) {

                moveWithRules($(this), $(bmoved),true); //makemvewithrules a boolean so if it cant move then dont move

                if (lastclicked !== null) {
                    lastclicked.removeClass('selected');
                    lastclicked = null;
                }

            }
        } else if ($(this).is(lastclicked)) { //how to deselect self

            $(this).removeClass('selected');
            lastclicked = null;

        } else {
            if (lastclicked !== null) {
                lastclicked.removeClass('selected');
                $(this).addClass('selected');
                lastclicked = $(this);
            }
        }

    }
});

function makeEm() {

    $('.draggable').draggable({
        helper: function (ev, ui) {
            /*if ($(this).text() !== getName((turns % 2) + 1)) {
                return false;
            }*/
            return "<span class='helperPick'>" + $(this).html() + "</span>";

        },
        cursor: "pointer",
        cursorAt: {
            left: $('.drop').width()/2,
            top: $('.drop').width()/2
        }
    });
    
    $(".drop").droppable({
        accept: ".draggable",
        drop: function (event, ui) {

            if ($(this).children(".draggable").size() > 0 || $(ui.draggable).text() !== getName((turns % 2) + 1)) {

                //cant aready something there
                return false;

            } else {

                moveWithRules($(this), $(ui.draggable),false);

            }

        }
    });

}

function checkWin(bool) {
    if ($('.centr').html() === "") {
        return false;
    }
    $('.drop').each(function (i) {
        var curr = parseInt($(this).attr("data-row"), 10);
        var curc = parseInt($(this).attr("data-col"), 10);
        var dragr = parseInt($(this).children().attr("data-row"), 10);
        var dragc = parseInt($(this).children().attr("data-col"), 10);
        if ($(this).is('.centr') === false) {

            if ($('.centr').text() == $(this).text()) {
                var x;
                if (curr == 1 && curc == 1) {


                    $("[data-row='3']").each(function (i) {
                        if ($(this).is("[data-col='3']")) {
                            x = this;
                        }
                    });
                    if ($(x).text() == $(this).text()) {
                        if (bool) {
                            reset($(this).text());
                            return;
                        } else {
                            cheat = true;
                            return;
                        }
                    }
                } else if (curr == 1 && curc == 2) {


                    $("[data-row='3']").each(function (i) {
                        if ($(this).is("[data-col='2']")) {
                            x = this;
                        }
                    });
                    if ($(x).text() == $(this).text()) {
                        if (bool) {
                            reset($(this).text());
                            bool = false;
                            return;
                        } else {
                            cheat = true;
                            return;
                        }
                    }
                } else if (curr == 1 && curc == 3) {


                    $("[data-row='3']").each(function (i) {
                        if ($(this).is("[data-col='1']")) {
                            x = this;
                        }
                    });
                    if ($(x).text() == $(this).text()) {
                        if (bool) {
                            reset($(this).text());
                            return;
                        } else {
                            cheat = true;
                            return;
                        }
                    }
                } else if (curr == 2 && curc == 1) {


                    $("[data-row='2']").each(function (i) {
                        if ($(this).is("[data-col='3']")) {
                            x = this;
                        }
                    });
                    if ($(x).text() == $(this).text()) {
                        if (bool) {
                            reset($(this).text());
                            return;
                        } else {
                            cheat = true;
                            return;
                        }
                    }
                }
            }

        }
    });
    return false;
}

function reset(x) {
    $('.drop').each(function () {
        $(this).removeClass('selected');
        $(this).empty();
    });
    lastclicked = null;
    if (x !== "") {
        alert(x + ' Won!!');
    }
    cheat = false;
    turns = 0;
    resetty = true;
    if (x == getName(1)) {
        a++;
        $('#P1').html(getName(1) + " has won:" + a + 'times.');
    } else if (x == getName(2)) {
        b++;
        $('#P2').html(getName(1) + " has won:" + b + 'times.');
    }
    $('#turn').html("Player1's turn...");
    $('#round').html("Round: 1");
    $('#info').html("New Game Let's Go!");
}

function moveWithRules(drop, drag,determin) {

    turns++;
    updateHud();

    var curr = parseInt(drag.parent().attr("data-row"), 10);
    var curc = parseInt(drag.parent().attr("data-col"), 10);
    var dragr = parseInt(drop.attr("data-row"), 10);
    var dragc = parseInt(drop.attr("data-col"), 10);

    if (Math.abs(curr - dragr) < 2 && Math.abs(curc - dragc) < 2) {
        if ((curr == 1 && curc == 2 && (dragr == 2 && (dragc == 1 || dragc == 3))) || (curr == 3 && curc == 2 && (dragr == 2 && (dragc == 1 || dragc == 3))) || (curr == 2 && curc == 1 && (dragc == 2 && (dragr == 1 || dragr == 3))) || (curr == 2 && curc == 3 && (dragc == 2 && (dragr == 1 || dragr == 3)))) {
            turns--;
            updateHud();
            return false;
        } else {
            if(determin==false){//if we are draggin do it this way
                drag.clone().appendTo(drop);
                checkWin(turns > 12);
            }
            else{//if we are clickin do it this way
            if (drag.parent().hasClass('centr') === false&&!drop.hasClass('centr')) {
                                        drag.clone().appendTo(drop);
                                        checkWin(turns > 12);//lets see if anyone won
                                    }
                                    else{ 
                                    	
                                    	drag.appendTo(drop);
                                        checkWin(turns > 12);
                                        
                                    }
            }
            if (cheat && !resetty) {
                drop.empty();
                cheat = false;

                reset(getName(((turns % 2) + 1)));

            } else {
                drop.empty();
                if (!resetty || turns == 7) {
                    drop.append(drag);
                }
                resetty = false;
            }
        }

    } else {
        turns--;
        updateHud();
        return false;
    }


}

var buttons = ['.tomenu', '#togame', '#tohighscore', '#toinstructions', '#tocredits', '#tooptions'];
var current = $('#startpage');
$.each(buttons, function (index, val) {
    $(val).click(function () {
        var curry;
        if (index === 0) {
            curry = $('#menu');
        } else {
            curry = $('#' + val.replace('#to', ''));
        }
        current /*.css('position','absolute')*/
        .fadeOut('slow');

        curry /*.css('position','relative')*/
        .fadeIn('slow');
        //current.delay(1000).css('position','relative');
        current = curry;
    });
    if (index === 0) {

        $('#' + val.replace('.to', '')).hide();
    } else {

        $('#' + val.replace('#to', '')).hide();
    }
});
var nameOne = "Player1",
nameTwo = "Player 2";

function getName(number) {
    if (number == 1) {
        return nameOne;
    } else if (number == 2) {
        return nameTwo;
    }
}
function setName(){

$('.in').each(function(i){
	if(i==0){nameOne=$(this).val();}
	else{nameTwo=$(this).val();}
});
saveGameState(0);
}
var randName=['Jose','Pepe','Pene','Weirdo','Kid','Who?','Ugh','Selfie'];
if(!getLastGame()){
	randNaame();
	
}
else{
	$('.in').each(function(i){
		if(i===0)
			{
				$(this).val(getLastGame().Player1);
			}
		else
		{
			$(this).val(getLastGame().Player2);
		}
		});
}
function randNaame(){
	$('.in').each(function(){
		$(this).val(randName[parseInt(Math.random()*randName.length)]);
	});
}
function supportsLocalStorage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}
var totTime=0;
function saveGameState(curTime) {
    if (!supportsLocalStorage()) { return false; }
    totTime+= curTime;
    var data={'Player1':nameOne,'Player2':nameTwo,'TimePlayed':totTime,'P1won':a+' times','P2won':a+' times'};

    if(localStorage.getItem('LastStats')===null){//first timers psh
    	localStorage.setObj('LastStats',data);
    	var ret = localStorage.getObj('Stats');
    	console.log('it work?');
    	console.log(ret);
    	return false;
    }
    localStorage.setObj('LastStats',data);
    var ret = localStorage.getObj('LastStats');
    	console.log('it work?');
    	console.log(ret);

    //localStorage["key"]="val"
}
Storage.prototype.setObj = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObj = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}
function getLastGame(){
	if(localStorage.getItem('LastStats')===null){
		console.log('was empty so lets choose random names');
		return false;
	}
	else{
		console.log('let me remember your name...');
		return JSON.parse(localStorage.getItem('LastStats'));
	}
}
//saveGameState();