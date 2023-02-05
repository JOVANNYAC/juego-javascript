const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');
const btnReinicio = document.querySelector('.reset');
const ocultaDivBtns = document.querySelector('.btns');

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart = undefined;
let timePlayer;
let timeInterval; 

const playerPosition = {
    x : undefined,
    y : undefined 
};

const giftPosition = {
    x : undefined,
    y : undefined
}

let enemyPositions = [];



window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);

function setCanvasSize(){
    
    if(window.innerHeight > window.innerWidth){
        canvasSize = window.innerWidth * 0.7;
    } else {
        canvasSize = window.innerHeight * 0.7;
    }

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);
 
    elementsSize = Math.floor((canvasSize / 10)*0.94);
    startGame();

}



function startGame(){
   
    game.font = (elementsSize-5) + 'px Verdana';
    game.textAlign = 'center';

    const map = maps[level]; 
if(!map){
    gameWin();
    return;
}


    if(!timeStart){
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100);
        sohwRecord();
    }


    const mapRows = map.trim().split('\n');
    const mapsRowsCols = mapRows.map(row => row.trim().split(''));
    console.log(map, mapRows, mapsRowsCols);
    
    showLives();

    enemyPositions = [];
   game.clearRect(0,0,canvasSize,canvasSize);

    mapsRowsCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col];
            const posX = elementsSize * (colI + 1);
            const posY = elementsSize * (rowI + 1);

            if (col == 'O'){
                if (!playerPosition.x && !playerPosition.y){
                    playerPosition.x = posX;
                    playerPosition.y = posY;
                    console.log({playerPosition});
                }
                }else if (col == 'I'){
                    giftPosition.x = posX;
                    giftPosition.y = posY; 
                
            } else if (col == 'X'){
                enemyPositions.push({
                    x: Math.floor(posX),
                    y: Math.floor(posY)
                });
            }
            game.fillText(emoji, posX, posY);
          
        });
    });
   movePlayer() ;
}
alert('Inicia el juego, 😎 muevete en los mapas sin tocar las bombas💣 tienes tres vidas💚 para alcanzar un nuevo record🏆');

function movePlayer() {
    const giftCollisionX = playerPosition.x.toFixed() == giftPosition.x.toFixed();
    const giftCollisionY = playerPosition.y.toFixed() == giftPosition.y.toFixed();
    const giftCollision = giftCollisionX && giftCollisionY;
    
    if (giftCollision) {
        subirNivel();
      
    }
 const enemyCollision = enemyPositions.find(enemy =>{
    const enemyCollisionX = enemy.x.toFixed() == playerPosition.x.toFixed()
    const enemyCollisionY = enemy.y.toFixed() == playerPosition.y.toFixed()
    return enemyCollisionX && enemyCollisionY
 });


 if (enemyCollision){
    game.fillText(emojis['BOMB_COLLISION'],playerPosition.x+elementsSize, playerPosition.y+elementsSize);
    game.fillText(emojis['BOMB_COLLISION'],playerPosition.x-elementsSize, playerPosition.y-elementsSize);
    game.fillText(emojis['BOMB_COLLISION'],playerPosition.x+elementsSize, playerPosition.y-elementsSize);
    game.fillText(emojis['BOMB_COLLISION'],playerPosition.x-elementsSize, playerPosition.y+elementsSize);
    game.fillText(emojis['PLAYER_COLISION'],playerPosition.x, playerPosition.y);
     setTimeout(() => leveFail(), 400) ;
    
 }


    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

function subirNivel(){
    level++;
    console.log('Subiste de nivel!');
    startGame();
}

 function gameWin(){
    console.log("GANASTE, FIN DEL JUEGO");
    clearInterval(timeInterval);
    ocultarMostarBtns ();
    
    const recordTime = localStorage.getItem('record_time');
    const playerTime = Date.now() - timeStart;

    if(recordTime){
       
        if (recordTime >= playerTime){
            localStorage.setItem('record_time', playerTime);
            pResult.innerHTML = 'SUPERASTE EL RECORD 🤩👏👏🏆';
        } else {
            pResult.innerHTML = 'lo siento, no superaste el record 😅';
        }
    } else {
        localStorage.setItem('record_time', playerTime);
        pResult.innerHTML = 'Primera vez? Muy bien, intenta superar tu tiempo 👏🏆';
    }
    console.log({recordTime, playerTime});
   

 } 


function ocultarMostarBtns(){
    btnReinicio.classList.remove('inactive');
    ocultaDivBtns.classList.add('inactiveBtns');
    
}

 function leveFail(){
    lives--;
    if (lives <= 0){
        level = 0;
        lives = 3;
        timeStart = undefined;

    }
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
   
    console.log(lives);
   
 }

 function showLives(){
    const heartsArray = Array(lives).fill(emojis['HEART']);
    spanLives.innerHTML = "";
    heartsArray.forEach(heart => spanLives.append(heart));
    
 }

 function showTime(){
    
        spanTime.innerHTML = Date.now() - timeStart;
    
   
 }

 function sohwRecord(){
    spanRecord.innerHTML = localStorage.getItem('record_time');
 }


window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function moveByKeys (event){
    if (event.key == 'ArrowDown') moveDown();
    else if (event.key == 'ArrowUp') moveUp();
    else if (event.key == 'ArrowLeft') moveLeft();
    else if (event.key == 'ArrowRight') moveRight();
}

function moveUp () {
    console.log("muevo arriba");
    if ((playerPosition.y - elementsSize) < elementsSize){
        console.log('you can not out');
    } else {
        playerPosition.y -= elementsSize ;
        startGame();
    }
} 
function moveLeft () {
    console.log("muevo izquierda");
    if ((playerPosition.x - elementsSize) < elementsSize){
        console.log('you can not out');
    } else{
        playerPosition.x -= elementsSize;
        startGame();}
    
} 
function moveRight () {
    console.log("muevo derecha");
    if ((playerPosition.x - elementsSize) > (canvasSize - (elementsSize*2))){
        console.log('you can not out');
    } else{
        playerPosition.x += elementsSize;
        startGame();
    }
   
} 
function moveDown () {
    console.log("muevo abajo");
    if ((playerPosition.y - elementsSize) > (canvasSize - (elementsSize*2))){
        console.log('you can not out');
    } else{
        playerPosition.y += elementsSize;
        startGame();
    }
    
} 