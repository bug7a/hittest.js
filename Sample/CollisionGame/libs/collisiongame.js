/**
 *
 * Created with JetBrains WebStorm.
 *
 * Code     : Collision Game Sample
 * Version  : 1.0
 *
 * User     : Bugra OZDEN
 * Site     : http://www.bugraozden.com
 * Mail     : bugra.ozden@gmail.com
 *
 * Date     : 08 Aug 2013
 * Time     : 12:06 AM
 *
 */

var CollisionGame = function(){};

CollisionGame.MAIN_ELEMENT_ID               = "main-window";
CollisionGame.CIRCULAR_ELEMENT_ID           = "game-circular";

CollisionGame.GAME_AREA_OBJECT_ELEMENT_ID   = "game-background-up";
CollisionGame.STAR_OBJECT_ELEMENT_ID        = "star-object";
CollisionGame.KEY_OBJECT_ELEMENT_ID         = "key-object";
CollisionGame.WALL_OBJECT_ELEMENT_ID        = "wall-object";
CollisionGame.FINISH_OBJECT_ELEMENT_ID      = "finish-object";

CollisionGame.GAME_SCORE_TEXT_ELEMENT_ID    = "game-score-text";
CollisionGame.GAME_LIFE_TEXT_ELEMENT_ID     = "game-life-text";
CollisionGame.GAME_COUNT_TEXT_ELEMENT_ID    = "game-count-text";

CollisionGame.DEFAULT_X_POINT               = "67";
CollisionGame.DEFAULT_Y_POINT               = "210";
CollisionGame.DEFAULT_GAME_TIME             = 0;
CollisionGame.DEFAULT_SCORE                 = 6650;
CollisionGame.DEFAULT_LIFE                  = 4;

CollisionGame.init = function(){

    CollisionGame.gameTime = CollisionGame.DEFAULT_GAME_TIME;
    CollisionGame.score = CollisionGame.DEFAULT_SCORE;
    CollisionGame.life = CollisionGame.DEFAULT_LIFE;

    CollisionGame.circularElement = document.getElementById(CollisionGame.CIRCULAR_ELEMENT_ID);
    CollisionGame.circularHitTest = new HitTest( CollisionGame.circularElement );

    CollisionGame.gameAreaElement = document.getElementById( CollisionGame.GAME_AREA_OBJECT_ELEMENT_ID );
    CollisionGame.starObjectElement = document.getElementById( CollisionGame.STAR_OBJECT_ELEMENT_ID );
    CollisionGame.keyObjectElement = document.getElementById( CollisionGame.KEY_OBJECT_ELEMENT_ID );
    CollisionGame.wallObjectElement = document.getElementById( CollisionGame.WALL_OBJECT_ELEMENT_ID );
    CollisionGame.finishObjectElement = document.getElementById( CollisionGame.FINISH_OBJECT_ELEMENT_ID );

    CollisionGame.gameScoreTextElement = document.getElementById( CollisionGame.GAME_SCORE_TEXT_ELEMENT_ID );
    CollisionGame.gameLifeTextElement = document.getElementById( CollisionGame.GAME_LIFE_TEXT_ELEMENT_ID );
    CollisionGame.gameCountTextElement = document.getElementById( CollisionGame.GAME_COUNT_TEXT_ELEMENT_ID );

    CollisionGame.startGame();
    CollisionGame.timerTrigger();
	CollisionGame.allowDragging();

    $( "#" + CollisionGame.MAIN_ELEMENT_ID ).mousemove( function(event) {

            //Area
            if( CollisionGame.circularHitTest.toArea( CollisionGame.gameAreaElement ) ) {

                CollisionGame.startGame();

            }

            //Star
            if( CollisionGame.circularHitTest.toObject( CollisionGame.starObjectElement ) ) {

                CollisionGame.score += 2500;
                document.getElementById( CollisionGame.GAME_SCORE_TEXT_ELEMENT_ID ).innerHTML = CollisionGame.score;
                $( "#" + CollisionGame.STAR_OBJECT_ELEMENT_ID).hide();

            }

            //Key
            if( CollisionGame.circularHitTest.toObject( CollisionGame.keyObjectElement ) ) {

                $( "#" + CollisionGame.KEY_OBJECT_ELEMENT_ID).hide();
                $( "#" + CollisionGame.WALL_OBJECT_ELEMENT_ID).hide();

            }

            //Wall
            if( CollisionGame.circularHitTest.toObject( CollisionGame.wallObjectElement ) ) {
                CollisionGame.startGame();
            }

            //Finish
            if( CollisionGame.circularHitTest.toObject( CollisionGame.finishObjectElement ) ) {
                CollisionGame.gameFinished(0);
            }

    });

};

CollisionGame.startGame = function(){

    CollisionGame.stopDragging();

    if( CollisionGame.life == 0 ){

        CollisionGame.gameFinished();

    }else{

        CollisionGame.life--;
        CollisionGame.gameLifeTextElement.innerHTML = CollisionGame.life;

        CollisionGame.score -= 250;
        CollisionGame.gameScoreTextElement.innerHTML = CollisionGame.score;

        CollisionGame.circularElement.style.left = CollisionGame.DEFAULT_X_POINT + "px";
        CollisionGame.circularElement.style.top = CollisionGame.DEFAULT_Y_POINT + "px";

        CollisionGame.allowDragging();

    }

};

CollisionGame.gameFinished = function( gameOver ){

    $( "#" + CollisionGame.MAIN_ELEMENT_ID ).off("mousemove");
    CollisionGame.stopDragging();
    CollisionGame.timerClear();

    setTimeout(function(){

        if(gameOver == 1){
            alert("Time out");
        }else{
            alert("Fin");
        }

    }, 200);

};

CollisionGame.timerTrigger = function() {

    CollisionGame.gameTime++;

    var zero = (CollisionGame.gameTime < 10) ? "0" : "";
    CollisionGame.gameCountTextElement.innerHTML = "00:" + zero + CollisionGame.gameTime;

    CollisionGame.score -= 100;
    CollisionGame.gameScoreTextElement.innerHTML = CollisionGame.score;

    if(CollisionGame.gameTime < 59) {

        CollisionGame.timer = setTimeout( "CollisionGame.timerTrigger();", 1000);

    }else{

        CollisionGame.gameFinished(1);

    }

};

CollisionGame.timerClear = function() {

    clearTimeout( CollisionGame.timer );

};

CollisionGame.allowDragging = function() {

	$( "#" + CollisionGame.CIRCULAR_ELEMENT_ID).draggable({
      start: function( event, ui ) {
      CollisionGame.dragging = 1;
    } } );
    
    $( "#" + CollisionGame.CIRCULAR_ELEMENT_ID).draggable({
      stop: function( event, ui ) { 
      CollisionGame.dragging = 0;
    } } );
	
};

CollisionGame.stopDragging = function() {

	$( "#" + CollisionGame.CIRCULAR_ELEMENT_ID).draggable( "destroy" );

};

window.addEventListener( "load", CollisionGame.init, false );