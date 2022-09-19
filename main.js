function getRandomNumber(min, max) {
    return (min + Math.random() * (max - min)) | 0;
}

class Ball {
    constructor() {
        this.circle = document.createElement('div');
        this.circle.classList.add('circle');
        this.colors = ['#e74c3c', '#8c44ad', '#3498db', '#e67e22', '#2ecc71', 'pink', 'yellow'];
    }

    transfer({width, height}) {
        const size = getRandomNumber(10, 60);
        const x = getRandomNumber(0, width - size);
        const y = getRandomNumber(0, height - size);
        const index = getRandomNumber(0, this.colors.length);

        this.circle.style.width = `${size}px`;
        this.circle.style.height = `${size}px`;
        this.circle.style.top = `${y}px`;
        this.circle.style.left = `${x}px`;
        this.circle.style.backgroundColor = this.colors[index];
    }

    hide() {
        this.circle.classList.add('hide');
    }

    show() {
        this.circle.classList.remove('hide');
    }
}

class Board {
    constructor(boardElement, timerElement, time) {
        this.element = boardElement;
        this.timerDOM = timerElement;
        this.time = time;
        this.score = 0;
        this.ball = new Ball();
 
        this.createScoreDOM();
        this.element.appendChild(this.ball.circle);
        this.element.addEventListener('click', event => {
            if (event.target.classList.contains('circle')) {
                this.ball.transfer(this.element.getBoundingClientRect());
                ++this.score;
            }
        });
    }

    createScoreDOM() {
        this.header = document.createElement('h1');
        this.header.textContent = 'Ваш счёт: ';
        
        this.scoreDOM = document.createElement('span');
        this.scoreDOM.classList.add('primary');

        this.header.classList.add('hide');

        this.header.appendChild(this.scoreDOM);
        this.element.appendChild(this.header);
    }

    setTime() {
        this.timerDOM.innerHTML = `00:${this.time < 10 ? '0' : ''}${this.time}`;
    }

    startGame() {
        this.score = 0;
        this.setTime();
        this.timerDOM.parentNode.classList.remove('hide');
        this.ball.show();
        this.ball.transfer(this.element.getBoundingClientRect());

        this.timer = setInterval(this.decreaseTime.bind(this), 1000);
        this.header.classList.add('hide');
    }

    decreaseTime() {
        if (this.time === 0) {
            this.finishGame();
        } else {
            --this.time;
            this.setTime();
        }
    }

    finishGame() {
        clearInterval(this.timer);
        this.ball.hide();
        this.timerDOM.parentNode.classList.add('hide');
        
        this.scoreDOM.textContent = `${this.score}`;
        this.header.classList.remove('hide');

        setTimeout(() => {
            screens[1].classList.remove('up');
        }, 3000);
    }
}

const board = document.getElementById('board');
const timeList = document.getElementById('time-list');
const screens = document.getElementsByClassName('screen');
let boardObj = new Board(board, timeDisplay, 0);

start.addEventListener('click', function(event) {
    screens[0].classList.add('up');
    event.preventDefault();
});

timeList.addEventListener('click', function(event) {
    if(event.target.classList.contains('time-btn')) {
        const time = parseInt(event.target.getAttribute('data-time'));
        screens[1].classList.add('up');

        boardObj.time = time;
        boardObj.startGame();
    }
});