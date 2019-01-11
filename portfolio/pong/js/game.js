var scoreMax = 3;

var screen = {
	elem: document.querySelector('.pong'),
	rx: 0,
	ry: 0
}

function rotateScreen() {
	screen.rx = scale(ball.y, 0, 720, -15, 15);
	screen.ry = scale(ball.x, 0, 1280, -15, 15);
	// console.log(screen.rx + ":" + screen.ry);
}

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
	if ((Math.random() < paddleEnemy.difficulty) && !paddleEnemy.hasHit) {
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
		console.log('Player win');
		playPlayerWinSound();
		cancelAnimationFrame(loopReq);
		stopBall();
		
		document.querySelector('.results-title').innerHTML = "You win!";
		document.querySelector('.results-title').style.color = "#33FF55";
		document.querySelector('.results-player').innerHTML = scorePlayer.value;
		document.querySelector('.results-enemy').innerHTML = scoreEnemy.value;
		document.querySelector('.results').style.visibility = 'visible';

		setTimeout(function() {
			resetGame();
		}, 3000);
	} else if (scoreEnemy.value === scoreMax) {
		console.log('Enemy win');
		playEnemyWinSound();
		cancelAnimationFrame(loopReq);
		stopBall();
		
		document.querySelector('.results-title').innerHTML = "You lose";
		document.querySelector('.results-title').style.color = "#33BBFF";
		document.querySelector('.results-player').innerHTML = scorePlayer.value;
		document.querySelector('.results-enemy').innerHTML = scoreEnemy.value;
		document.querySelector('.results').style.visibility = 'visible';
		
		setTimeout(function() {
			resetGame();
		}, 3000);
	}
}

function resetGame() {
	ballSpeed = ballSpeedStart;
	scorePlayer.value = 0;
	scoreEnemy.value = 0;
	init();
}

var gameStarted = false;
var musicStarted = false;

function init() {
	document.querySelector('.results').style.visibility = 'hidden';
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
	preGameParticles();
}

var preGameReq;

function preGameParticles() {
	ballParticles.spawn(Math.floor(Math.random() * gameWidth), Math.floor(Math.random() * gameHeight));
	preGameReq = requestAnimationFrame(preGameParticles);
	
}

function start() {
	console.log("start");
	cancelAnimationFrame(preGameReq);
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
	// rotateScreen();
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