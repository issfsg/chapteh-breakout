
var canvas = $('#breakout-game')[0];
var context = canvas.getContext("2d");

var canvasWidth = canvas.width;
var canvasHeight = canvas.height;

var setting = {
	ballColor : "#7f8c8d", 
	ballRadius : 10,

	paddleHeight: 10,
	paddleWidth: 120,

	frameSpeed : 10,

	paddleMoveLeft: false,
	paddleMoveRight: false,
	paddleMoveRate: 4,

	paddleX: 170,
	paddleY: 420,

	gameState: true,
	deathNumber: 0,
	deathTotal: 2,

	lostMessage: "You've lost the game. Would you like to play again?",

	currentScore: 0,
	brickScore: 20,
	paddleScore: 10
}

var x = canvasWidth/2, y = 200;
var dx = 0.5, dy = 4;

var bricks = {
	row		: 4,
	column	: 6,
	color   : "#ffc500",
	height  : 20,
	width 	: undefined,
	padding	: 2
};

var gameStart, brick, restart; 

function drawBall() {
	context.clearRect(0, 0, canvasWidth, canvasHeight);
	context.beginPath();
	context.arc(x, y, setting.ballRadius, 0, 2 * Math.PI, true);
	context.closePath();
	context.fillStyle = setting.ballColor;
	context.fill();

	x += dx;
	y += dy;
}

function drawPaddle() {
	if(setting.paddleMoveLeft && setting.paddleX >= 0) {
		setting.paddleX -= setting.paddleMoveRate;
	}
	if(setting.paddleMoveRight && setting.paddleX <= canvasWidth - setting.paddleWidth) {
		setting.paddleX += setting.paddleMoveRate;
	}

	context.fillStyle = '#2c3e50';
	context.fillRect( setting.paddleX, setting.paddleY, setting.paddleWidth, setting.paddleHeight);
}

function movePaddle() {
	$(document).on('keydown', function(e){
		if( e.keyCode == 39 ) {
			setting.paddleMoveRight = true;
		} else if( e.keyCode == 37 ) { 
			setting.paddleMoveLeft = true;			
		}
	}).on('keyup', function(e){
		if( e.keyCode == 39 ) {
			setting.paddleMoveRight = false;
		} else if( e.keyCode == 37 ) { 
			setting.paddleMoveLeft = false;			
		}
	});
}

function initBricks() {
	// http://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript
	brick = new Array(bricks.column);

	for( i = 0; i < bricks.column; i++ ) {
		brick[i] = new Array(bricks.row);
		for( j = 0; j < bricks.row; j++ ) {
			brick[i][j] = { x : 0, y : 0, state : true };
		}
	}
}

function drawBricks() {
	bricks.width = ( (canvasWidth) / bricks.column) - 2;

	for( i = 0; i < bricks.column; i++ ) {
		for( j = 0; j < bricks.row; j++ ) {

				if ( brick[i][j].state ) {

				var brickX = i * (bricks.width + bricks.padding);
				var brickY = j * (bricks.height + bricks.padding);

				brick[i][j].x = brickX;
				brick[i][j].y = brickY;

				context.beginPath();
				context.rect( brickX, brickY, bricks.width, bricks.height);
				if( j == 0) {
					context.fillStyle = '#2980b9';
				} else if( j == 1 ) {
					context.fillStyle = '#27ae60';
				} else if( j == 2 ) {
					context.fillStyle = '#ED8F03';
				} else {
					context.fillStyle = '#e74c3c';
				}
				context.fill();
				context.closePath();
			}

		}
	}
}

function brickCollision() {
	for( n = 0; n < bricks.column; n++ ) {
		for( k = 0; k < bricks.row; k++ ) {
			var currentBrick = brick[n][k];

			if(currentBrick.state) {			
				if( x > currentBrick.x && x < currentBrick.x + bricks.width && y > currentBrick.y && y < currentBrick.y + bricks.height ) {
					dy = -dy;
					currentBrick.state = false;
					setting.currentScore += setting.brickScore;
					$('.instr').text('Score : ' + setting.currentScore);
				}
			}
		}
	}
}

function boundaryCollision() {
	if( y - setting.ballRadius <= 0) {
		dy = -dy;
	} 

	else if ( y + setting.ballRadius >= canvasHeight ) {

		var fullBallLeft = x + setting.ballRadius;
		var fullBallRight = x - setting.ballRadius;


		if( fullBallLeft >= setting.paddleX && fullBallRight < setting.paddleX + setting.paddleWidth) {
			dx = 8 * ( ( x - (setting.paddleX + setting.paddleWidth/2) ) / setting.paddleWidth);
			dy = Math.sqrt( 20 - ( dx * dx) );
			dy = -dy;


			if( setting.currentScore > 0 ) {
				setting.currentScore -= setting.paddleScore;
			}
			$('.instr').text('Score : ' + setting.currentScore);
		} 
		else {
			clearInterval(gameStart);
			setting.gameState = false;
		}
	}

	if( x + setting.ballRadius >= canvasWidth || x - setting.ballRadius <= 0) {
		dx = -dx;
	}
}

function loseTurnCallback() {
	$('.life .heart').eq(setting.deathNumber).addClass('heart-o');
	
	setTimeout(function(e){ 
		$('.instr-footer small').text('Press any key to restart the game.');
		setting.deathNumber += 1;

		x = canvasWidth/2; 
		y = 200;
		setting.paddleX = 170;

		drawBall();
		drawBricks();
		drawPaddle();
		setting.gameState = true;

		$(document).on('keyup', function(e) {
				gameStart = setInterval( init , setting.frameSpeed);
				$(this).off('keyup');
		});


	}, 400);
}

function loseGameCallback() {
	$('.modal-message').text(setting.lostMessage);
	setTimeout(function(){
		$('.modal-overlay').show();
		$('body').addClass('game-over');
	}, 100);

	$('.btn-play-again').on('click', function(e){
		e.preventDefault();
		location.reload();
	});
}

function initSpacebar() {
	$(document).on('keyup', function(e) {
		if( e.keyCode == 32 && setting.deathNumber < setting.deathTotal ) {
			gameStart = setInterval( init , setting.frameSpeed);
			$('.instr-footer small').text('');

			// Only allows one-time click on document load
			$(this).off('keyup');

		}
	});
} 

function init() {
	if( setting.gameState == true ) {
		drawBall();
	}

	boundaryCollision()
	drawPaddle();
	drawBricks();
	movePaddle();
	brickCollision();

	if( setting.gameState == false && setting.deathNumber < setting.deathTotal ) {
		loseTurnCallback();
	} else if( setting.gameState == false && setting.deathNumber == setting.deathTotal ) {
		loseGameCallback();
	}
}

initBricks();
init();
initSpacebar();
