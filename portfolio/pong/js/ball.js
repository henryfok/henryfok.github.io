// window size
var gameWidth = 1280;
var gameHeight = 720;

// ball size and move speed
var ballWidth = 30;
var ballHeight = 30;
var ballSpeedStart = 8;
var ballSpeed = ballSpeedStart;
var ballRotateSpeed = 3;

var ball = {
	// starting ball position and speed
	// vx : horizontal velocity
	// vy : vertical velocity
	elem: document.querySelector('.ball'),
	x: gameWidth / 2 - ballWidth / 2,
	y: gameHeight / 2 - ballHeight / 2,
	vx: ballSpeed,
	vy: ballSpeed,
	r: 0,
	vr: ballRotateSpeed,
	width: ballWidth,
	height: ballHeight
};

function startBall() {
	ball.x = gameWidth / 2 - ballWidth / 2;
	ball.y = gameHeight / 2 - ballHeight / 2;
	ball.vx = 0;
	ball.vy = 0;
	ball.vx = ballSpeed;
	ball.vy = ballSpeed;
}

function moveBall() {
	// move ball location diagonally
	ball.x += ball.vx;
	ball.y += ball.vy;
}

function rotateBall() {
	ball.r += ball.vr;
}

function containBall() {
	if (ball.y <= 0) {
		// top wall of the ball hit the top border, reverse vertical velocity (down)
		ball.y = 0;
		ball.vy = -ball.vy;
		playWallHitSound();
	} else if (ball.y + ball.height >= gameHeight) {
		// bottom wall of the ball hit the bottom border, reverse vertical velocity (up)
		ball.y = gameHeight - ball.height;
		ball.vy = -ball.vy;
		playWallHitSound();
	}

	if (ball.x <= 0) {
		// left wall of the ball hit the left border, reverse horizontal velocity (right)
		scoreAddOne(scoreEnemy);
		// ball.ballSpeed += 1;
		if (scoreEnemy.value !== scoreMax) {
			playEnemyScoreSound();
			resetBall();
		}
		// ball.x = 0;
		// ball.vx = -ball.vx;
	} else if (ball.x + ball.width >= gameWidth) {
		// right wall of the ball hit the right border, reverse horizontal velocity (left)
		scoreAddOne(scorePlayer);
		// ball.ballSpeed += 1;
		if (scorePlayer.value !== scoreMax) {
			playPlayerScoreSound();
			resetBall();
		}
		// ball.x = gameWidth - ball.width;
		// ball.vx = -ball.vx;
	}
}

function checkCollisions() {
	if (aabbCollisionDetect(ball, paddlePlayer)) {
		ball.x = paddlePlayer.x + paddlePlayer.width;
		ball.vx = -ball.vx;
		ball.vr = -ball.vr;
		playPaddleHitSound();
	}

	if (aabbCollisionDetect(ball, paddleEnemy)) {
		ball.x = paddleEnemy.x - ball.width;
		ball.vx = -ball.vx;
		ball.vr = -ball.vr;
		playPaddleHitSound();
	}
}

function resetBall() {
	ball.x = gameWidth / 2 - ballWidth / 2;
	ball.y = gameHeight / 2 - ballHeight / 2;
	ball.vx = 0;
	ball.vy = 0;
	ball.r = 0;
	ball.vr = 0;
	setTimeout(function() {
		ball.vx = ballSpeed;
		ball.vy = ballSpeed;
		ball.vr = ballRotateSpeed;
	}, 1000);
}

function stopBall() {
	ball.x = gameWidth / 2 - ballWidth / 2;
	ball.y = gameHeight / 2 - ballHeight / 2;
	ball.vx = 0;
	ball.vy = 0;
}