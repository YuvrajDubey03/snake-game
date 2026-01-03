const board = document.querySelector('.board');
const startbutton = document.querySelector('.btn-start');
const restartbutton = document.querySelector('.btn-restart');
const modal = document.querySelector('.modal');
const startmodal = document.querySelector('.start-game');
const gameovermodal = document.querySelector('.game-over');

const highscoreelement = document.querySelector('#high-score');
const scoreelement = document.querySelector('#score');
const timelement = document.querySelector('#time');



const blockheight = 50;
const blockwidth = 50;

let highscore = localStorage.getItem('highscore') || 0;
let score =0;
let time =`00-00`;  
 highscoreelement.innerText = highscore;

const cols = Math.floor(board.clientWidth / blockwidth);
const rows = Math.floor(board.clientHeight / blockheight);


 const blocks =[]
 let snake = [{x:1,y:4}];
 let food = {x:Math.floor(Math.random()*rows), y:Math.floor(Math.random()*cols)};
 let intervalID = null;
 let timerintervalID = null;

let direction = 'down';

for(let row=0; row<rows; row++){
    for(let col=0; col<cols; col++){
        const block = document.createElement('div');
        block.classList.add('block');
        board.appendChild(block);
    
        blocks[`${row}-${col}`] = block;
    }
}

function render(){
      let head = null;
      blocks[`${food.x}-${food.y}`].classList.add('food');
    if(direction === 'left'){
        head = {x: snake[0].x, y: snake[0].y - 1};
    }
    else if(direction === 'right'){
        head = {x: snake[0].x, y: snake[0].y + 1};
    }
    else if(direction === 'up'){
        head = {x: snake[0].x - 1, y: snake[0].y};
    }
    else if(direction === 'down'){
        head = {x: snake[0].x + 1, y: snake[0].y};
    }
    // wall collison phase
   if(head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols){
        clearInterval(intervalID);
        modal.style.display = 'flex';
        startmodal.style.display = 'none';
        gameovermodal.style.display = 'flex';
        return;
       
    }
    // food eating phase
    if(head.x === food.x &&  head.y === food.y){
        blocks[`${food.x}-${food.y}`].classList.remove('food');
        food = {x:Math.floor(Math.random()*rows), y:Math.floor(Math.random()*cols)};
          blocks[`${food.x}-${food.y}`].classList.add('food');
          snake.unshift(head);
            score +=10;
            scoreelement.innerText = score;
            if(score > highscore){
                highscore = score;
                localStorage.setItem('highscore', highscore.toString());
            }
            

    }

    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove('fill');
    });
    snake.unshift(head);
    snake.pop();
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.add('fill');
}
)}

// start button function

startbutton.addEventListener('click', () => {
    modal.style.display = 'none';
    intervalID = setInterval(() => { render(); },300)  ;
timerintervalID = setInterval(() => { 
    let [mins, secs] = time.split('-').map(Number);

    if (secs === 59) {
        mins += 1;
        secs = 0;
    } else {
        secs += 1;
    }

    time = `${mins.toString().padStart(2,'0')}-${secs.toString().padStart(2,'0')}`;
    timelement.innerText = time;
}, 1000);

});



// restart button function
restartbutton .addEventListener('click', restartgame);

function restartgame() {

    // remove food
    blocks[`${food.x}-${food.y}`].classList.remove('food');

    // remove snake
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove('fill');
    });

    clearInterval(intervalID);

    // RESET SCORE
    score = 0;
    scoreelement.innerText = score;
    // RESET HIGHSCORE
    highscoreelement.innerText = highscore;

    // RESET TIME
    time = `00-00`;
    timelement.innerText = time;

    modal.style.display = 'none';

    // reset snake (safe way)
    snake.length = 0;
    snake.push({ x: 1, y: 4 });

    direction = 'down';

    food = {
        x: Math.floor(Math.random() * rows),
        y: Math.floor(Math.random() * cols)
    };

    intervalID = setInterval(render, 300);
}


addEventListener('keydown', (e) => {
    if(e.key === 'ArrowLeft'){
        direction = 'left';
    }
    else if(e.key === 'ArrowRight'){
        direction = 'right';
    }
    else if(e.key === 'ArrowUp'){
        direction = 'up';
    }
    else if(e.key === 'ArrowDown'){
        direction = 'down';
    }   
});



let touchStartX = 0;
let touchStartY = 0;

board.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

board.addEventListener('touchend', (e) => {
    let touchEndX = e.changedTouches[0].clientX;
    let touchEndY = e.changedTouches[0].clientY;

    let diffX = touchEndX - touchStartX;
    let diffY = touchEndY - touchStartY;

    // horizontal swipe
    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0 && direction !== 'left') {
            direction = 'right';
        } else if (diffX < 0 && direction !== 'right') {
            direction = 'left';
        }
    }
    // vertical swipe
    else {
        if (diffY > 0 && direction !== 'up') {
            direction = 'down';
        } else if (diffY < 0 && direction !== 'down') {
            direction = 'up';
        }
    }
});
