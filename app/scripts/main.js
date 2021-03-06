var turns = 0,
 cheat = false,
 resetty = false,
 a = 0,
 b = 0,
 pad = parseInt($('.drop').css('padding-top').replace('px', ''), 10),
 triangle,
 lastclicked = null,
 AI=false;


function resizer() {
    if ($(window).height() < 768 && $(window).height() < $(window).width()) {
        $('.conte').css({
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


$('.drop').click(function () {console.log('Was clicked! With turns at:'+turns);
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
            if(turns!==0&&AI){
				aiTurn();
			}

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
				if(turns!==0&&AI){
					aiTurn();
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
            top: $('.drop').height()/2
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
                if(turns!==0&&AI){
					aiTurn();
				}

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
    $('#turn').html(getName(1) + " turn...");
    $('#round').html("Round: 1");
    $('#info').html("New Game, Let's Go!");

    prior=[];
    
    if(x == getName(1)||x == getName(2)){
    	if(!AI){
    	alert(x + ' Won!!');
    	saveNamesForScores(x == getName(1));
    	}
    	else{
    	saveAI(x==getName(1));
    	}
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

var buttons = ['.tomenu', '#togame', '#tohighscore', '#toinstructions', '#tocredits', '#tooptions','#tocpu'], current = $('#startpage');
$.each(buttons, function (index, val) {
    $(val).click(function () {
        var curry;
        if (index === 0) {
            curry = $('#menu');
        }
        else if(index==1){
        	curry = $('#' + val.replace('#to', ''));
        	if(setName()===false){alert("You can't have the same names");return;}
        	updateHud();
        	if(AI){
        		if (confirm('Click OK to continue playing with another player and CANCEL to continue playing the CPU')) {
                         reset(null);$('#P1').html("");$('#P2').html("");updateHud();a=0;b=0;setAI(null);
                    } else {
                        curry=$('#game');
                    }
        	}
        	else if(AI==false){
        		setAI(null);
        	}
        	
        }
        else if(index==2){
        	curry = $('#' + val.replace('#to', ''));
        	var data=localStorage.getObj('TotalStats');
        	if(data!==null){
        		var str='<ul id="Scores">',air=localStorage.getObj('AIStats');
        		if(air!==null){
        			str+='<li>You VS AI <span class="tally">('+air.You+' to '+air.AI+')</span></li>';
        		}

        		for(var i=0,x=data.length;i<x;i++){
        			str+='<li>'+data[i][0]+' VS '+data[i][1]+' <span class="tally">('+data[i][2]+' to '+data[i][3]+')</span></li>';
        		}
        		str+='</ul><button type="submit" id="rstscr">Reset Highscores</button>'
        		$('#hcont').html(str);
        		$('#rstscr').click(function(){
                    if (confirm('Are you sure you want to save delete all Highscores?')) {
                        $('#Scores').slideUp();
                        localStorage.clear(); 
                        $('#P1').html("");$('#P2').html(""); reset(null);
                    } else {
                        return false;
                    }
									
				});
        	}
        }
        else if(index == 6){
        	if(AI==null){
        		if (confirm('Click OK to continue playing with the CPU and CANCEL to continue playing with the other player')) {
                         reset(null);
                         $('#P1').html("");
                         $('#P2').html("");
                         updateHud();
                         a=0;
                         b=0;
                         curry=$('#game');
                         setAI(true);
                         names[0] = "You";
                         names[1] = "AI";
                         updateHud();
                    } 
                    else {
                       curry=$('#game');
                    }
        	}
        	else if(AI==false){
        		curry=$('#game');
        		setAI(true);
        		names[0] = "You";
        		names[1] = "AI";
        	}
        }
         else {
            curry = $('#' + val.replace('#to', ''));
        }
        current.fadeOut('slow');

        curry.fadeIn('slow');
        
        current = curry;
    });
    if (index === 0) {

        $('#' + val.replace('.to', '')).hide();
    } else {

        $('#' + val.replace('#to', '')).hide();
    }
});

var names=["You","AI"];

function getName(number) {
    if (number == 1) {
        return names[0];
    } else if (number == 2) {
        return names[1];
    }
}
function setName(){

$('.in').each(function(i){
	if(i===0){
		names[0]=$(this).val();
	}
	else{
		names[1]=$(this).val();
	}
});
if(names[0]===names[1]){
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function randNaame(){
	var randName=['Jose','Pepe','Pene','Weirdo','Kid','Who?','Ugh','Selfie','Stalker','Awkward','That thing','Loser','Winner'],nam1=randName[parseInt(Math.random()*randName.length)],nam2=randName[parseInt(Math.random()*randName.length)];
	$('.in').each(function(i){
		if(1==i){$(this).val(nam1);}
		else{$(this).val(nam1);}
	});
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$('.ico').on('swipeleft',function(){
	alert("l");
		nextIcon($(this).index(),true);
});

$('.ico').on('swiperight',function(){
	alert("r");
		nextIcon($(this).index(),false);
});

function nextIcon(Which,bool){
	// func to change to the next Icon that isnt on the other side
	var arrofIcos=['Fire','Water','Wind','Earth'],curcon=g$('.ico').get(Which).css('background-image'),icol=arrofIcos[0];//strip url off curcon or put full urls in arr
	curcon=curcon.substring(curcon.lastIndexOf('/')+1,curcon.lastIndexOf('.'));
	for(var i =(bool?0:1),l=arrofIcos.length-(bool?1:0);i<l;i++){//sets icol to next icon
		if(curcon==arrofIcos[i]){
			icol=arrofIcos[i+(bool?1:-1)];
		}
	}
	$('.ico').get(Which).css('background-image',icol);//sets background to icol

}

function saveNames(){
    if (!supportsLocalStorage()) { return; }
    
    var data={'Player1':names[0],'Player2':names[1]};

    if(localStorage.getItem('LastStats')===null){//first timers psh
    	localStorage.setObj('LastStats',data);
    	return;
    }
    localStorage.setObj('LastStats',data);
    
}
function setAI(b){
	AI = b;
}
function supportsLocalStorage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
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

	var data=[names[0],names[1],a,b];

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
}
function saveAI(bool){//bool is true then add one to 'You'
	if (!supportsLocalStorage()) { return; }

	if(localStorage.getItem('AIStats')===null){

		localStorage.setObj('AIStats',{'You':bool?1:0,'AI':bool?0:1});
		return;
	}

	var dat=localStorage.getObj('AIStats');

	dat.You+=bool?1:0;

	dat.AI+=bool?0:1;

	localStorage.setObj('AIStats',dat);
}
function aiTurn(){console.time("AI Turn");

    if(turns<7){
        placeInPreffered();
    }
     else if(turns<13){
            chooseBestLoc(turns<13);
    }
    else{
        if(canWin(2)){
            console.log('AI Won...');
        }
        else if(canWin(1)){
            console.log('AI Blocked...');
        }
        else{
            chooseBestLoc(turns<13);
        }
    }
    console.timeEnd("AI Turn");

}
function canWin(x){//returns true if (x) can win and if X==2 itll try to move into that position
    var pos=[[0,8],[1,7],[2,6],[3,5],[0,4],[4,8],[1,4],[4,7],[2,4],[4,6],[3,4],[4,5]];
    var check=[[1,2,3,4,5,6,7],[0,2,3,4,5,6,8],[0,1,3,4,5,7,8],[0,1,2,4,6,7,8],[5,7],[1,3],[6,8],[0,2],[3,7],[1,5],[2,8],[0,6]];
    for(var i=0,l=pos.length;i<l;i++){
        if(hasIt(pos[i][0],x)&&hasIt(pos[i][1],x)){//There are 2 in a row..
        	if(i<4&&isEmpty(4)){//auto return if it is two pieces on either side of center with center empty
        		console.log(getName(x)+' Can Move to Win!!');

        		for(var t=0,f=check[i].length;t<f;t++){
        			if(hasIt(check[i][t],2)){
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
        			if(hasIt(check[i][i%2],2)){//now check if we happen to have a piece that can move into that empty place
        				console.log('We are changing from %s to %s',check[i][0],w);
        				moveWithRules($($('.drop').get(w)),$($('.drop').get(check[i][0])).children('.draggable'),false);
        				return true;
        			}
        		}
        	}
        }
    }
    return false;
}

function hasIt(index,x){    
        return ($($('.drop').get(index)).children().text()==getName(x));    
}
function hasItIn(index,x,arr){    
        return arr[index]==(x==2);    
}
function isEmpty(index){
	return ($($('.drop').get(index)).children().size()==0);
}
function isEmptyIn(index,arr){
	return (arr[index]==null);
}

function getPosOf(x){//returns an array of all the pos that (x) has in the current board
	var pos=[], c=0;
    $('.drop').each(function(i){
       if($(this).children('.draggable').text()==getName(x)){
       	pos[c]=i;
       	c++;
       }
    });	
    return pos;
}
function getPosOfIn(x,arr){//returns an array of all the pos that (x) has
	var pos=[], c=0;
    for(var i=0,l=arr.length;i<l;i++){
       if(arr[i]==(x==2)){
       	pos[c]=i;
       	c++;
       }
    }	
    return pos;
}
function getAllPos(){//returns an array of current board true for ai false for player and null if empty

    var all=[];
    $('.drop').each(function(i){
        all[i]=$(this).children('.draggable').text()==getName(2)?true:$(this).children('.draggable').text()==getName(1)?false:null;
    });
    return all;

}
function canMove(pos){//returns true if it can possile move on current gameboard
	if(pos==4){return true;}
    var allmovelocationspossible=[[1,3,4],[0,2,4],[1,4,5],[1,4,6],[0,1,2,3,5,6,7,8],[2,4,8],[3,4,7],[4,6,8],[4,5,7]];
    for(var p=allmovelocationspossible[pos].length;p>0;p--){
        if(isEmpty(allmovelocationspossible[pos][p])){return true;}
    }
    return false;
}
function canMoveIn(pos,arr){//returns true if it can possile move in array
	if(pos==4){return true;}
    var allmovelocationspossible=[[1,3,4],[0,2,4],[1,4,5],[0,4,6],[0,1,2,3,5,6,7,8],[2,4,8],[3,4,7],[4,6,8],[4,5,7]];
    for(var p=allmovelocationspossible[pos].length;p>0;p--){
        if(isEmptyIn(allmovelocationspossible[pos][p],arr)){return true;}
    }
    return false;
}
function canMoveTo(pos,topos){//returns true if the topos is an empty position and is within the bounds of the game to move to false if otherwise
	if(isEmpty(topos)==false){return false;}
	var allmovelocationspossible=[[1,3,4],[0,2,4],[1,4,5],[1,4,6],[0,1,2,3,5,6,7,8],[2,4,8],[3,4,7],[4,6,8],[4,5,7]];
	for(var p=allmovelocationspossible[pos].length;p>0;p--){
        if(allmovelocationspossible[pos][p]==topos){return true;}
    }
    return false;
}
function canMoveToIn(pos,topos,arr){//returns true if the topos is an empty position and is within the bounds of the game to move to false if otherwise
	if(isEmptyIn(topos,arr)==false){return false;}
	var allmovelocationspossible=[[1,3,4],[0,2,4],[1,4,5],[0,4,6],[0,1,2,3,5,6,7,8],[2,4,8],[3,4,7],[4,6,8],[4,5,7]];
	for(var p=allmovelocationspossible[pos].length;p>0;p--){
        if(allmovelocationspossible[pos][p-1]==topos){return true;}
    }
    return false;
}

function completeALine(poss,locs){//returns true if (poss) completes a line within locs
if(turns<5){return false;}
var pos=[[0,8],[1,7],[2,6],[3,5],[0,4],[4,8],[1,4],[4,7],[2,4],[4,6],[3,4],[4,5]];
for(var i =0,l=pos.length;i<l;i++){
	if(pos[i][0]==locs[0]&&pos[i][1]==locs[1]){
		if(i<4){
			return (poss==4);
		}
		else{
			var w;
        	if(i%2==0){w=pos[i+1][1]}
        	else{w=pos[i-1][0]}
        		return (w==poss);
		}
	}
}
}
function placeInPreffered(){//places pieces in the preffered positions
	if(((turns%2)+1)==1){
		return;
	}
	var possibles=[4,0,2,6,8,3,1,7,5];
	var board =getPosOf(2);
    var pos=parseInt(Math.random()*possibles.length,10);
	//for(var pos=0,l=possibles.length;pos<l;pos++){
		if(isEmpty(possibles[pos])&&!completeALine(possibles[pos],board)){
			placeInPrefferred(possibles[pos]);
			return;
		}
        else{
            placeInPreffered();
        }
	//}
}
function placeInPrefferred(pos){//actually places the pieces on the board
	$($('.drop').get(pos)).append('<div class="draggable P2" style="border-width:' + triangle + '">' + getName(2) + '</div>');
            checkWin(false);
            turns++;
			updateHud();
}
var prior=[];
function chooseBestLoc(turnbool){
	var allPossible=getPossibleForIn(2,getAllPos()),highes=0,highest=0,storet=[],store=[],arrOfRanks=new Array(new Array()),arrOfNextRanks=[],dingDing=null;console.log(allPossible);

	for(var i=0,l=allPossible.length;i<l;i++){//loop to go through all possible choice the player can make now

		var rankOfStem=rankingOf(allPossible[i]);//ranking of current possible choice
		if (!arrOfRanks[i]) arrOfRanks[i] = [];
		arrOfRanks[i][0]=turnbool && isAWinIn(2,allPossible[i])?0:rankOfStem;
		if(!turnbool&&isAWinIn(2,allPossible[i])){
			dingDing=allPossible[i];//store the automagic winner and just play that board;
			break;
		}
		if(rankOfStem>0){
			var cur = getPossibleForIn(1,allPossible[i]);//next possible choices

				for(var c=0,cl=cur.length;c<cl;c++){//go through next possibles

				var curry = getPossibleForIn(2,cur[c]);//next possibles

				for(var r=0,rl=curry.length;r<rl;r++){//go through next possibles
					
					var rank=rankingOf(curry[r]);// rank of next next possibles

					arrOfRanks[i][r+1]=rank;

					/*if(rank>highest){//if the rank is bigger than the highest we have save it to a store array
						var changer = changeInFrom(getAllPos(),allPossible[i]);
	                    if(turnbool && isAWinIn(2,allPossible[i])){
	                        //dont save the score if it will be a win
	                        console.log("We could've Won we chose not to" );
	                    } 
	                    else if(prior.length>1&&changer[0]==prior[prior.length-2][0]&&changer[1]==prior[prior.length-2][1]){
	                        //dont move back to the last position you were 
	                        console.log('we blocked something');
	                    }
	                    else{
		                    storet=changer;
							console.log('New Highest of the second level at:'+rank);
							highest=rank;
							console.log(storet);
						}
						trackcurrent(allPossible[i]);
						console.log('To get to:');
						trackcurrent(curry[r]);
					}*/

				}

			}
		}
/*

		if(ranky>highes){//if the rank is bigger than the highest we have save it to a store array
					var change = changeInFrom(getAllPos(),allPossible[i]),rand=Math.random();
                    if(turnbool && isAWinIn(2,allPossible[i])){
                        //dont save the score if it will be a win
                        console.log("We could've Won we chose not to" );
                    } 
                    else if(prior.length>1&&change[0]==prior[prior.length-2][0]&&change[1]==prior[prior.length-2][1]){
                        //dont move back to the last position you were with an 80% chance of not moving
                        console.log('we blocked something');
                    }
                    else{
                        store=change;
    					console.log('New Highest at:'+ranky);
                        console.log(store);
    					highes=ranky;
                    }
                    trackcurrent(allPossible[i]);
				} 
		*/
		

	}

	if(dingDing!==null){
		//use dingDing
		var change = changeInFrom(getAllPos(),dingDing);
		moveAndRecord(change[0],change[1]);
	}
	else{
		var greatestAvg=0,posOf=0;

		for(var r=0,lr=arrOfRanks.length;r<lr;r++){

			if(arrOfRanks[r]>0){
				var sum=0;

				for(var c=0,lc=arrOfRanks[r].length;c<lc;c++){

					if(c+1!==lc){
						sum+=arrOfRanks[r][c+1];
					}
					else{

						sum=(sum/(arrOfRanks-2));

					}

				}
				arrOfRanks[r][0]=sum;
				if(sum>greatestAvg){
					greatestAvg=sum;
					posOf=r;
				}



			}

		}

			var change = changeInFrom(getAllPos(),allPossible[posOf]);
			moveAndRecord(change[0],change[1]);


			
			/*if(Math.abs(highest-highes)<15){
				prior.push([store[0],store[1]]);
				trackcurrent(getAllPos());
				leMoveTo(store[0],store[1],store[0]==4||store[1]==4?true:false);
				trackcurrent(getAllPos());
			}
			else{
				prior.push([storet[0],storet[1]]);
				console.log('is else');
				trackcurrent(getAllPos());
				leMoveTo(storet[0],storet[1],store[0]==4||store[1]==4?true:false);
				trackcurrent(getAllPos());
			}*/
		}
			
}

function moveAndRecord(a,b){
	prior.push([a,b]);
	trackcurrent(getAllPos());
	leMoveTo(a,b,a==4||b==4?true:false);
	trackcurrent(getAllPos());
}

function trackcurrent(bo){
	var bro="",brt="",br="";
	for(var i=0,l=bo.length;i<l;i++){
		if(i/3<1){
		bro+=bo[i]?' X ':bo[i]==null?' _ ':' O ';
		}
		else if(i/3<2){
			brt+=bo[i]?' X ':bo[i]==null?' _ ':' O ';
		}
		else{
			br+=bo[i]?' X ':bo[i]==null?' _ ':' O ';
		}
	}
	console.log('_________');
	console.log(bro);
	console.log(brt);
	console.log(br);
	console.log('_________');
}
function rankingOf(x){//x is the board we need to rank
	var curRank=0,
	 r={
	 	center:10,
	 	twoInLine:3,
	 	oneInLine:2,
	 	canmove:3,
	 	cantmove:-6,
	 	allCanMove:6,
	 	abouttowin:5,
	 	win:8
	 },
	 allX=getPosOfIn(2,x), 
	 allY=getPosOfIn(1,x);

	 for(var i=0,l=allX.length>allY.length?allX.length:allY.length,y=x;i<l;i++){
		if(allX[i]==4){
			curRank+=r.center;
		}
		if(allY[i]==4){
			curRank-=r.center;
		}

		if(typeof allX[i] !=="undefined"&&canMoveIn(allX[i],y)){
			curRank+=r.canmove;
		}
		else{
			curRank+=r.cantmove;
		}

		if(typeof allY[i] !=="undefined"&&canMoveIn(allY[i],y)){
			curRank-=r.canmove;
		}
		else{
			curRank-=r.cantmove;
		}
		
	}
	if(areTwoInALine(allX[0],allX[1])){
		curRank+=r.twoInLine;
	}
	if(areTwoInALine(allX[1],allX[2])){
		curRank+=r.twoInLine;
	}
	if(areTwoInALine(allX[0],allX[2])){
		curRank+=r.twoInLine;
	}
	if(areTwoInALine(allY[0],allY[1])){
		curRank-=r.twoInLine;
	}
	if(areTwoInALine(allY[1],allY[2])){
		curRank-=r.twoInLine;
	}
	if(areTwoInALine(allY[0],allY[2])){
		curRank-=r.twoInLine;
	}
	if(canMoveIn(allX[0],x)&&canMoveIn(allX[1],x)&&canMoveIn(allX[2],x)){
		curRank+=r.allCanMove;
	}
	if(isAboutToWinIn(2,x)){
		curRank+=r.abouttowin;
	}
	else if(isAboutToWinIn(1,x)){
		curRank-=r.abouttowin;
	}
	if(isAWinIn(2,x)){
		curRank+=r.win;
	}
	else if(isAWinIn(1,x)){
		return -1;
	}

	return curRank;

}
function areTwoInALine(x,y){
	var pos=[[0,8],[1,7],[2,6],[3,5],[0,4],[4,8],[1,4],[4,7],[2,4],[4,6],[3,4],[4,5],[6,8],[2,8],[0,2],[0,6]];
	if(y<x){
		var t=x;
		x=y;
		y=t;
	}
	for(var i=0,l=pos.length;i<l;i++){
		if(pos[i][0]==x&&pos[i][1]==y){
			return true;
		}
	}
	return false;
}
function getPossibleForIn(x,arr){//returns all possible board orientations for X
	var board=arr, all=getPosOfIn(x,board),re=[];
	for(var i=0,l=all.length;i<l;i++){
		if(canMoveIn(all[i],board)===false){
			all[i].splice(i, 1);i--;
		}
	}
	for(var b=0,bl=board.length;b<bl;b++){
		for(var a=0,al=all.length;a<al;a++){
			if(canMoveToIn(all[a],b,board)){
				var copy=board.slice();
				copy[all[a]]=null;
				copy[b]=(x==2);
				
				re.push(copy);
			}
		}
	}

	return re;
}

function leMoveTo(x,y,boolfer){

moveWithRules($($('.drop').get(x)),$($('.drop').get(y)).children('.draggable'),boolfer);

}
function changeInFrom(prev,newy){
	var re=[];
	for(var p=0,pl=prev.length;p<pl;p++){
		
			if(prev[p]==null&&prev[p]!==newy[p]){
				re[0]=p;
			}
			if(prev[p]&&prev[p]!==newy[p]){
				re[1]=p;
			}
		
	}
	return re;
}
function isAboutToWinIn(x,arr){//returns true if is one of the board orientaions to win
    var pos=[[0,8],[1,7],[2,6],[3,5],[0,4],[4,8],[1,4],[4,7],[2,4],[4,6],[3,4],[4,5]];
    var check=[[1,2,3,4,5,6,7],[0,2,3,4,5,6,8],[0,1,3,4,5,7,8],[0,1,2,4,6,7,8],[5,7],[1,3],[6,8],[0,2],[3,7],[1,5],[2,8],[0,6]];
    for(var i=0,l=pos.length;i<l;i++){
        if(hasItIn(pos[i][0],x,arr)&&hasItIn(pos[i][1],x,arr)){//There are 2 in a row..
            if(i<4&&isEmpty(4)){//auto return if it is two pieces on either side of center with center empty
                return true;
            }
            else if(i>3){  var w;
            if(i%2==0){w=pos[i+1][1]}
            else{w=pos[i-1][0]} 
                         
                if(isEmptyIn(w,arr)){//the place where it should be empty it is
                    if(hasItIn(check[i][0],x,arr)){//now check if we happen to have a piece that can move into that empty place
                        
                        return true;
                    }
                    else if(hasItIn(check[i][1],x,arr)){
                    
                    return true;
                    }
                }
            }
        }
    }
    return false;


}
function isAWinIn(x,arr){//returns true if there is a line through the center
	var Wins = [[0,4,8],[1,4,7],[2,4,6],[3,4,5]], all=getPosOfIn(x,arr).sort();
	if(all[0]>3){
	    return false;
	}
	var cur=Wins[all[0]];
	if(cur[1]==all[1]&&cur[2]==all[2]){
	    return true;
	}
}