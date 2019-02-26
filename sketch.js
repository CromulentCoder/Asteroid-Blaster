// Start and pause game
let gamePaused = false;
let start = false;


let cannon;
let asteroids = [];
let counter = 0;
let bullets = [];

let canvas;
let highScoreDiv;
let highScoreP;
let highScore = 0;

let scoreDiv;
let scoreP;
let score = 0;

let cannonAnimation = [];
let backgroundImage;

window.preload = () => {
    for (let i = 0; i < 13; i++) {
        cannonAnimation.push(loadImage("pics/frame" + i + ".png"));
    }
    backgroundImage = loadImage("pics/background.jpg");
}


window.setup =  () => {
    canvas = createCanvas(600, windowHeight);
    canvas.parent('canvascontainer');
    cannon = new Cannon(cannonAnimation);
    
    scoreP = createP("High Score:" + highScore + "<br>Score:" + score).addClass("score");
    scoreP.parent("canvascontainer");
    scoreP.position(width - width / 3,10);
}

window.keyPressed = () => {
    if (start == false) {
        start = true;
        unpauseGame();
    }
    if (keyCode == LEFT_ARROW) {
        cannon.updateDir(-1);
        cannon.setShoot(true);
    } else if (keyCode == RIGHT_ARROW) {
        cannon.updateDir(1);
        cannon.setShoot(true);
    }
}

window.keyReleased = () => {
    if (keyCode == LEFT_ARROW || keyCode == RIGHT_ARROW) {
        cannon.updateDir(0);
        cannon.unsetShoot(false);
    } 
}

const pauseGame = () =>{
    gamePaused = true; 
}

const unpauseGame = () => {
    gamePaused = false;
}

// Start the game over
const resetGame = () =>{
    start = false;
    cannon = new Cannon(cannonAnimation);
    asteroids = [];
    bullets = [];
    counter = 0;
    score = 0;
}


window.draw = () => {
    if (gamePaused) return;

    image(backgroundImage, 0, 0, width, height);

    // Pause game until started
    if (start == false) {
        pauseGame();
        fill(255);
        textAlign(CENTER);
        textSize(24);
        text("Press any key to start", width / 2, height / 2);
    }

    cannon.constrain();
    if (cannon.getShoot()) {
        bullets.push(new Bullet(cannon.getTop()[0], cannon.getTop()[1]));
    }
    if (bullets.length > 0) {
        for (let i = bullets.length - 1; i >= 0; i--) {
            bullets[i].show();
            bullets[i].update();
            if ((asteroids.length > 0 && bullets[i].hit(asteroids))) {
                score += 1;
            }
            if ((bullets[i].offScreen()) || (asteroids.length > 0 && bullets[i].hit(asteroids))) {
                bullets.splice(i,1);
                continue;
            }
        }
    }

    if ((counter % 500 == 0 && counter!= 0) || counter == 2) {
        let rand = floor(random(2));
        let x, dir;
        let y = random(50,150);
        let r = floor(random(50,100));
        if (rand == 0) {
            x = -r / 2;
            dir = 1;
        } else {
            x = width + r / 2 ;
            dir = -1;
        }
        asteroids.push(new Asteroid([x, y, r, dir, r + random(0,200)]));
    }
    counter++;

    if (asteroids.length > 0) {
        for (let i = asteroids.length - 1; i >= 0; i--) {
            asteroids[i].updateSpeed();
            asteroids[i].show();
            if (asteroids[i].checkMass()) {
                let x = asteroids[i].getArgs()[0];
                let y = asteroids[i].getArgs()[1];
                let r = asteroids[i].getArgs()[2];
                let mass = asteroids[i].getMass();
                asteroids.splice(i,1);
                if (r / 2 >= 30) {
                    asteroids.push(new Asteroid([x - r / 2, min(y, width/2), r / 2, -1, mass / 2]));
                    asteroids.push(new Asteroid([x + r / 2, min(y, width/2), r / 2, 1, mass / 2]));
                }
            }
            if (asteroids.length <= 0) {
                break;
            }
        }
    }

    if (cannon.hits(asteroids)) {
        resetGame();
    };

    cannon.show();
    cannon.update();

    if (score > highScore) {
        highScore = score;
    }
    scoreP.html("High Score:" + highScore + "<br>Score:" + score);
}