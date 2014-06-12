function aiTurn(){

    if(turns<7){
        //place in preffered coordinates
        //check to make sure that it is not making a line
    }
    else if(turns<13){//only worry if the other player can win when its the last two rounds
        if(canWin()){
            blockWin();
        }
        else if(canMakeFork()){//if ai can make a fork then make it
            makeFork();
        }
        else if(canFork()){//if other player can make a fork block it
            blockFork();
        }
        else{
            chooseBestLoc();
        }
    }
    else{
        if(winningMove()){
            takeWin();
        }
        else if(canWin()){
            blockWin();
        }
        else if (canMakeFork()){
            makeFork();
        }
        else if(canFork()){//if other player can make a fork block it
            blockFork();
        }
        else{
            chooseBestLoc();
        }
    }

}
function moveablePieces(){
    var arr=[];var count=0;
    $('.drop').each(function(){
        if($(this).children('.draggable').size()>0){
            arr[count]=$(this).children('.draggable').text()=="Player 2"? true: $(this).children('.draggable').text()=="Player 1"? false:null;
            count++;
        }
        return arr;
    });
}
function winningMove(){
    var pieces=moveablePieces();
    var pairs = allThatAreTwoInALineForAny(true);
    for(var i=0;i<pairs.length;i++){

    }
}
function thisCanMove(pos){//will return true if the index of the element(pos) has an option to move somewhere else cuz its empty
var pieces= moveablePieces();
var check=[
[[1,2],[2,2],[2,1]],
[[1,1],[1,3],[2,2]],
[[1,2],[2,2],[2,3]],
[[1,1],[2,2],[3,1]],
[[1,1],[1,2],[1,3]],[[2,1],[2,3],[3,1]],[3,2],[3,3]],
[[1,3],[2,2],[3,3]],
[[2,1],[2,2],[3,2]],
[[3,1],[2,2],[3,3]],
[[2,2],[3,1],[3,3]],
[[2,2],[2,3],[3,2]],
]
//double for loop to go through these and check if all are empty where needed
for(var i=0;i<check[pos].length;i++){
    if($('[data-row='+check[pos][i][0]+']').each(function(i){if(i==check[pos][i][1]){return $(this);}}).is(":empty")){
        return true;
    }
}
return false;
}
function thiscanMoveTo(pos){if(thisCanmove(pos)){

}}
function allThatAreTwoInALineForAny(determining){
    var pieces=moveablePieces(), pairs=[], count=0;
    if(compareFor(0,9,pieces)===determining){
        pairs[count]=[0,9];count++;
    }
    if(compareFor(0,4,pieces)===determining){
        pairs[count]=[0,9];count++;
    }
    if(compareFor(4,9,pieces)===determining){
        pairs[count]=[4,9];count++;
    }
    if(compareFor(1,7,pieces)===determining){
        pairs[count]=[1,7];count++;
    }
    if(compareFor(1,4,pieces)===determining){
        pairs[count]=[1,4];count++;
    }
    if(compareFor(4,7,pieces)===determining){
        pairs[count]=[4,7];count++;
    }
    if(compareFor(2,6,pieces)===determining){
        pairs[count]=[2,6];count++;
    }
    if(compareFor(2,4,pieces)===determining){
        pairs[count]=[2,4];count++;
    }
    if(compareFor(4,6,pieces)===determining){
        pairs[count]=[4,6];count++;
    }
    if(compareFor(3,5,pieces)===determining){
        pairs[count]=[3,5];count++;
    }
    if(compareFor(3,4,pieces)===determining){
        pairs[count]=[3,4];count++;
    }
    if(compareFor(4,5,pieces)===determining){
        pairs[count]=[4,5];count++;
    }
    return pairs;
}
function compareFor(index,indexer,pieces){
    if(pieces[index]==pieces[indexer]){
        return pieces[index];//these are the same but can both be null,true,false
    }
    else{
        return;
    }
}