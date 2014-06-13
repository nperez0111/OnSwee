var turns = 0;
var cheat = false;
var resetty = false;
var a = 0;
var b = 0;
var pad = parseInt($('.drop').css('padding-top').replace('px', ''), 10);
var triangle;
var lastclicked = null;


function resizer() {
    if ($(window).height() < 768 && $(window).height() < $(window).width()) {
        $('.cont').css({
            'max-width': $(window).height() - 75 + "px"
        });
    }
    
    var wid = $('.drop').width();
    var outwid = $('.drop').outerWidth();
    triangle = '0 ' + ((outwid / 2) - pad) + 'px ' + (((wid) - 2) - pad) + 'px ' + ((outwid / 2) - pad) + 'px;';
    

    $('<style>  .draggable,.helperPick{line-height:' + (wid) + 'px;height:' + (wid) + 'px;}.drop,.helperPick{height:' + (outwid) + 'px; }.helperPick{width:' + (wid) + 'px}</style>').appendTo('head');
}

$(window).resize(resizer).trigger("resize");
addToHomescreen();

function updateHud() {

    $('#turn').html(getName((turns % 2) + 1) + "'s turn...");
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
        } else if ($(this).children(".draggable").size() === 0 && lastclicked !== null) {

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
            if ($(this).text() !== getName((turns % 2) + 1)) {
                return "<div></div>";
            }
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
        $('#P2').html(getName(2) + " has won:" + b + 'times.');
    }
    $('#turn').html("Player1's turn...");
    $('#round').html("Round: 1");
    $('#info').html("New Game, Let's Go!");
    if(x == getName(1)||x == getName(2)){
    	saveNamesForScores(x == getName(1));
    }
}
//drop is the one you are moving to drag is the one being moved
function moveWithRules(drop, drag,determin) {

    turns++;
    updateHud();

    var curr = parseInt(drag.parent().attr("data-row"), 10);
    var curc = parseInt(drag.parent().attr("data-col"), 10);
    var dragr = parseInt(drop.attr("data-row"), 10);
    var dragc = parseInt(drop.attr("data-col"), 10);

    if (Math.abs(curr - dragr) < 2 && Math.abs(curc - dragc) < 2) {
        if ((curr === 1 && curc === 2 && (dragr === 2 && (dragc === 1 || dragc === 3))) || (curr === 3 && curc === 2 && (dragr === 2 && (dragc === 1 || dragc === 3))) || (curr === 2 && curc === 1 && (dragc === 2 && (dragr === 1 || dragr === 3))) || (curr === 2 && curc === 3 && (dragc === 2 && (dragr === 1 || dragr === 3)))) {
            turns--;
            updateHud();
            return false;
        } else {
            if(determin===false||(drag.parent().hasClass('centr') === false&&!drop.hasClass('centr'))){//if we are draggin do it this way
                drag.clone().appendTo(drop);
                checkWin(turns > 12);
            }
            else{//if we are clickin do it this way

            drag.appendTo(drop);
            checkWin(turns > 12);

            }
            if (cheat && !resetty) {
                drop.empty();
                cheat = false;

                reset(getName(((turns % 2) + 1)));

            } else {
                drop.empty();
                if (!resetty || turns === 7) {
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
        }
        else if(index==1){
        	curry = $('#' + val.replace('#to', ''));
        	if(setName()===false){$('#options').append("<div>You can't have the same names</div>");return;}
        }
        else if(index==2){
        	curry = $('#' + val.replace('#to', ''));
        	var data=localStorage.getObj('TotalStats');
        	if(data!==null){
        		var str='<ul id="Scores">';
        		for(var i=0,x=data.length;i<x;i++){
        			str+='<li>'+data[i][0]+' VS '+data[i][1]+' <span class="tally">('+data[i][2]+' to '+data[i][3]+')</span></li>';
        		}
        		str+='</ul><button type="submit" id="rstscr">Reset Highscores</button>'
        		$('#highscore').append(str);
        		$('#rstscr').click(function(){
                    if (confirm('Are you sure you want to save delete all Highscores?')) {
                        $('#Scores').slideUp();
                        localStorage.clear();   
                    } else {
                        return false;
                    }
									
				});
        	}
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
	if(i===0){
		nameOne=$(this).val();
	}
	else{
		nameTwo=$(this).val();
	}
});
if(nameOne===nameTwo){
	return false;
}
saveNames();
return true;
}

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
	var randName=['Jose','Pepe','Pene','Weirdo','Kid','Who?','Ugh','Selfie','Stalker','Awkward','That thing','Loser','Winner'];
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

function saveNames(){
    if (!supportsLocalStorage()) { return; }
    
    var data={'Player1':nameOne,'Player2':nameTwo};

    if(localStorage.getItem('LastStats')===null){//first timers psh
    	localStorage.setObj('LastStats',data);
    	return;
    }
    localStorage.setObj('LastStats',data);
    
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
			return false;
		}
		else{
			return JSON.parse(localStorage.getItem('LastStats'));
		}
	}

function saveNamesForScores(bool){
	if (!supportsLocalStorage()) { return; }

	var data=[nameOne,nameTwo,a,b];

	if(localStorage.getItem('TotalStats')===null){

		localStorage.setObj('TotalStats',[data]);
		return;
	}
	
	var dat=localStorage.getObj('TotalStats');
	
	for(var i=0; i<dat.length;i++){
		if(dat[i][0]==data[0]&&dat[i][1]==data[1]){

			dat[i][2]+=bool?1:0;
			dat[i][3]+=bool?0:1;

		}

		else if(((i+1)<dat.length)==false){

			dat.push(data);

		}
	}
	localStorage.setObj('TotalStats',dat);
	//	var ret = localStorage.getObj('TotalStats');
    
}
function canWin(x){
    var pos=[[0,8],[1,7],[2,6],[3,5],[0,4],[4,8],[1,4],[4,7],[2,4],[4,6],[3,4],[4,5]];
    var check=[[1,2,3,4,5,6,7],[0,2,3,4,5,6,8],[0,1,3,4,5,7,8],[0,1,2,4,6,7,8],[5,7],[1,3],[6,8],[0,2],[3,7],[1,5],[2,8],[0,6]];
    for(var i=0,l=pos.length;i<l;i++){console.log(i);
        if(hasIt(pos[i][0],x)&&hasIt(pos[i][1],x)){//There are 2 in a row..
        	if(i<4&&isEmpty(4)){//auto return if it is two pieces on either side of center with center empty
        		console.log(getName(x)+' Can Move to Win!!');

        		for(var t=0,f=check[i].length;t<f;t++){
        			if(hasIt(check[i][t],x)){
        				moveWithRules($('#centr'),$($('.drop').get(check[i][t])).children('.draggable'),false);
        				return true;
        			}
        		}

            	return true;
        	}
        	else if(i>3){  var w;
        	if(i%2==0){w=pos[i+1][1]}
        	else{w=pos[i-1][0]} 
        		//console.log("I is at:%s, W is at:%s first check is %s second check is %s third check is %s",i,w,hasIt(check[i][0],x),hasIt(check[i][1],x),isEmpty(w));     		
        		if(isEmpty(w)){//the place where it should be empty it is
        			if(hasIt(check[i][0],x)){//now check if we happen to have a piece that can move into that empty place
        				moveWithRules($($('.drop').get(w)),$($('.drop').get(check[i][0])).children('.draggable'),false);
        			}
        			else if(hasIt(check[i][1],x)){
        			moveWithRules($($('.drop').get(w)),$($('.drop').get(check[i][1])).children('.draggable'),false);
        			return true;
        			}
        		}
        	}
        }
    }
}

function hasIt(index,x){    
        return ($($('.drop').get(index)).children().text()==getName(x));    
}
function isEmpty(index){
	return ($($('.drop').get(index)).children().size()==0);
}