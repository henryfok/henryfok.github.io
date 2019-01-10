// paddle size and move speed
var paddleWidth = 30;
var paddleHeight = 120;
var paddleSpeed = 16;

var scoreMax = 3;

var screen = {
	elem: document.querySelector('.pong'),
	rx: 0,
	ry: 0
}

function rotateScreen() {
	screen.rx = scale(ball.y, 0, 720, -10, 10);
	screen.ry = scale(ball.x, 0, 1280, -10, 10);
	// console.log(screen.rx + ":" + screen.ry);
}

function scale(num, in_min, in_max, out_min, out_max) {
	return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

var paddlePlayer = {
	// default player1 paddle position data
	elem: document.querySelector('.paddle-player'),
	x: 0,
	y: gameHeight / 2 - paddleHeight / 2,
	width: paddleWidth,
	height: paddleHeight,
	speed: paddleSpeed,
	moveUp: false,
	moveDown: false
};

var paddleEnemy = {
	// default player2 paddle position data
	elem: document.querySelector('.paddle-enemy'),
	x: gameWidth - paddleWidth,
	y: gameHeight / 2 - paddleHeight / 2,
	width: paddleWidth,
	height: paddleHeight,
	speed: paddleSpeed,
	moveUp: false,
	moveDown: false,
	difficulty: 0.5
};

function addEventListeners() {
	window.addEventListener('keydown', function(keycode) {
		if (keycode.code === 'ArrowUp' || keycode.code === 'KeyW') {
			paddlePlayer.moveUp = true;
			// console.log('up');
		}
		if (keycode.code === 'ArrowDown' || keycode.code === 'KeyS') {
			paddlePlayer.moveDown = true;
			// console.log('down');
		}
	});

	window.addEventListener('keyup', function(keycode) {
		if (keycode.code === 'ArrowUp' || keycode.code === 'KeyW') { paddlePlayer.moveUp = false; }
		if (keycode.code === 'ArrowDown' || keycode.code === 'KeyS') { paddlePlayer.moveDown = false; }
	});
}

function movePlayer() {
	if (paddlePlayer.moveUp) {
		paddlePlayer.y -= paddlePlayer.speed;
	} else if (paddlePlayer.moveDown) {
		paddlePlayer.y += paddlePlayer.speed;
	}
}

function moveEnemy() {
	if (Math.random() < paddleEnemy.difficulty) {
		paddleEnemy.moveUp = false;
		paddleEnemy.moveDown = false;
		if (ball.y + ballHeight < paddleEnemy.y + paddleEnemy.height / 2) {
			paddleEnemy.moveUp = true;
		} else if (ball.y > paddleEnemy.y + paddleEnemy.height / 2) {
			paddleEnemy.moveDown = true;
		}
		
		if (paddleEnemy.moveUp) {
			paddleEnemy.y -= paddleEnemy.speed;
		} else if (paddleEnemy.moveDown) {
			paddleEnemy.y += paddleEnemy.speed;
		}
	}
}

function containPaddles() {
	// top
	paddlePlayer.y = Math.max(0, paddlePlayer.y);
	// bottom
	paddlePlayer.y = Math.min(gameHeight - paddlePlayer.height, paddlePlayer.y);

	paddleEnemy.y = Math.max(0, paddleEnemy.y);
	paddleEnemy.y = Math.min(gameHeight - paddleEnemy.height, paddleEnemy.y);
}

function checkWinState() {
	if (scorePlayer.value === scoreMax) {
		playPlayerWinSound();
		console.log('Player win');
		resetGame();
	} else if (scoreEnemy.value === scoreMax) {
		playEnemyWinSound();
		console.log('Enemy win');
		resetGame();
	}
}

function resetGame() {
	cancelAnimationFrame(loopReq);
	ballSpeed = ballSpeedStart;
	scorePlayer.value = 0;
	scoreEnemy.value = 0;
	stopBall();
	init();
}

var gameStarted = false;
var musicStarted = false;

function init() {
	document.querySelector('.menu').style.visibility = 'visible';
	if (!musicStarted) {
		musicStarted = true;
		playMusic();
	}
	gameStarted = false;
	render();
	window.addEventListener('keydown', function(keycode) {
		if ((keycode.code === 'ArrowUp' || keycode.code === 'KeyW' ||
			keycode.code === 'ArrowDown' || keycode.code === 'KeyS') && !gameStarted) {
			start();
		}
	});
}

function start() {
	console.log("start");
	document.querySelector('.menu').style.visibility = 'hidden';
	lowerVolMusic();
	gameStarted = true;
	addEventListeners();
	startBall();
	loop();
}

var loopReq;

function loop() {
	loopReq = requestAnimationFrame(loop);
	update();
	render();
}

function update() {
	// console.log("update");
	moveBall();
	rotateBall();
	ballParticles.spawn(ball.x + ball.width/2, ball.y + ball.height/2);
	// rotateScreen()
	movePlayer();
	moveEnemy();
	containBall();
	containPaddles();
	checkCollisions();
	checkWinState();
}

function render() {
	paddlePlayer.elem.style.transform =
		'translate3d(' + paddlePlayer.x + 'px, ' + paddlePlayer.y + 'px, 1px)';

	paddleEnemy.elem.style.transform =
		'translate3d(' + paddleEnemy.x + 'px, ' + paddleEnemy.y + 'px, 1px)';

	ball.elem.style.transform =
		'translate3d(' + ball.x + 'px, ' + ball.y + 'px, 2px) rotateZ(' + ball.r + 'deg)';

	screen.elem.style.transform =
		'scale(0.85) rotateX(' + screen.rx + 'deg) rotateY(' + screen.ry + 'deg)';

	scorePlayer.elem.innerHTML = scorePlayer.value;
	scoreEnemy.elem.innerHTML = scoreEnemy.value;
}

init();