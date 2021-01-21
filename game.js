
function loadGame(){

    //board dimension in "case" numbers
    const DIM_X = 30;
    const DIM_Y = 30;

    let DIR_NONE = "";
    
    const Key_UP = 38;     // Unicode values for keyboard arrows
    const Key_RIGHT = 39;
    const Key_DOWN = 40;
    const Key_LEFT = 37;

    const restart = () => location.reload();

    const board = document.getElementById('board');

    let score = 0;

    const scoreText = document.getElementById('score');
    scoreText.innerHTML=score;

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    //player object
    let player = {
    body : [{positionX: 14, positionY: 14}, {positionX: 15, positionY: 14},],
    head : function(){return this.body[this.body.length - 1]},
    lastDirection : DIR_NONE,
    moveOnDirection : function(oneDirection){
        const apple = checkForFruit();
        if(apple){
            //remove the apple
            const allAppleCases = document.querySelectorAll(".case.apple");
			for(let a = 0; a < allAppleCases.length; a++){
                allAppleCases[a].classList.remove("apple");
            }
            //add one point
            score++;
            scoreText.innerHTML=score;
            //create a new apple
            const allCases = document.querySelectorAll('.case');
            let appleIndex = getRandomInt(1, 900);
            for(let c = 0; c < allCases.length; c++){
                if(c === appleIndex){ 
                    allCases[c].classList.add('apple')
                }
            }
        }
        let newHead = {
            positionX : this.head().positionX,
            positionY : this.head().positionY
        }
        if(this.body.length > 1 && !apple){
            this.body = this.body.slice(1)
        }

        if(oneDirection == Key_UP){
            newHead.positionX--;
        }
        else if(oneDirection == Key_DOWN){
            newHead.positionX++;
        }
        else if(oneDirection == Key_LEFT){
            newHead.positionY--;
        }
        else if(oneDirection == Key_RIGHT){
            newHead.positionY++;
        }

        this.body.push(newHead);

        this.lastDirection = oneDirection;
        updateSnakePosition();
        }
    };

    function instruction(){
        const instructions = document.getElementById('instructions');
        instructions.innerHTML = "Pour lancer le jeu déplacez le serpent avec votre clavier";

        setTimeout(function(){ instructions.classList.add('hidden'); }, 5000);
    }

    function audio(){
        const jungleAudio = new Audio('./sounds/vabsounds__jungle.wav');
        if (typeof jungleAudio.loop == 'boolean')
        {
            jungleAudio.loop = true;
        }
        else
        {
            jungleAudio.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
            }, false);
        }
        jungleAudio.play();
    }
    
    function replay(){
        const container = document.getElementById('gameContainer');

        const disabledBg = document.createElement('div');
        disabledBg.setAttribute("id", "disabledBg");
        container.appendChild(disabledBg);

        const modal = document.createElement('div');
        modal.setAttribute("id", "playModal");
        disabledBg.appendChild(modal);

        const replayButton = document.createElement('div');
        replayButton.textContent = "Replay"
        replayButton.setAttribute("id", "replay")
        modal.appendChild(replayButton);
        
        replayButton.addEventListener('click', function(){
            restart();
        });
    }

    function createBoard(){

        instruction();
     
        let appleIndex = getRandomInt(1, 900);

        for(let i = 1; i <= 900; i++){

            const square = document.createElement('div');
            square.classList.add('case'); 
            board.appendChild(square);
            // random creation of the apple
            if(i === appleIndex){ 
                square.classList.add('apple')  
            }
        }
    };

    function checkForFruit(){
        const allCases = document.querySelectorAll(".case");
        let indice = player.head().positionX * DIM_X + player.head().positionY;
        return allCases[indice].classList.contains("apple");
    };

    function updateSnakePosition(){
        const allPlayersCases = document.querySelectorAll(".case.snake");
			for(let j = 0; j < allPlayersCases.length; j++){
                allPlayersCases[j].classList.remove("snake");
            }
				                  
		const allCases = document.querySelectorAll(".case");
			for (let i =0;i < player.body.length; i++){
				let indice = player.body[i].positionX * DIM_X + player.body[i].positionY;
				allCases[indice].classList.add("snake");
            }
        checkForEnding();
    };

    function listenToEvent(e){
        if(!(e.keyCode == Key_UP ||
            e.keyCode == Key_RIGHT ||
            e.keyCode == Key_DOWN ||
            e.keyCode == Key_LEFT))
            return;

        player.lastDirection = e.keyCode;

        //debug
        //if(isMoveOk(player,e.keyCode))
		//player.moveOnDirection(e.keyCode);
    };

    function isMoveOk(player,oneDirection){

        //Check if it's possible to go backward 

		if(oneDirection === Key_UP){
            return player.head().positionX > -1;
        }
        else if(oneDirection === Key_DOWN){
            return player.head().positionX < DIM_X;
        }
        // left and right are ok
        else if(oneDirection === Key_LEFT){
            return player.head().positionY > -1;
        }
        else if(oneDirection === Key_RIGHT){
            return player.head().positionY < DIM_Y;
        }
        //no direction is ok first
        return true;
    };

    function onTick(){
        if(isMoveOk(player, player.lastDirection)){
            player.moveOnDirection(player.lastDirection);
        }
    };

    function checkForEnding(){
        
        // Check if : player head is crashed on his own body

        if(!isMoveOk(player, player.lastDirection)){
            board.classList.add('hidden')
            replay();
        }
    };

    function initGame(){
        audio();
        createBoard();
        updateSnakePosition();
        document.addEventListener("keydown", listenToEvent);
        setInterval(onTick, 100);
    };

    initGame();
}; // Fin de loadGame

document.addEventListener("DOMContentLoaded",loadGame());