// Start and pause game
let gamePaused = false;
let start = false;

// Game objects
let cannon;
let asteroids = [];
let counter = 0;
let bullets = [];

// DOM elements for score
let canvas;
let scoreDiv;
let scoreP;
let highScore = 0;
let score = 0;

// Graphics
let cannonAnimation = [];
let asteroidImages = []; 
let backgroundImage;

// Load the images
window.preload = () => {
    for (let i = 0; i < 13; i++) {
        cannonAnimation.push(loadImage("pics/frame" + i + ".png"));
    }
    backgroundImage = loadImage("pics/background.jpg");
    asteroidImages[0] = loadImage("pics/asteroid.png");
    asteroidImages[1] = loadImage("pics/asteroid1.png");
}

// Initialize objects
window.setup =  () => {
    
    // Responsiveness 
    let w;
    if (windowWidth <= 500) {
        w = windowWidth;
    } else {
        w = 500;
    }

    // Create canvas
    canvas = createCanvas(w, windowHeight);
    canvas.parent("canvascontainer");

    // Initialize cannon object
    cannon = new Cannon(cannonAnimation);
    
    // Add DOM elements
    scoreP = createP("High Score:" + highScore + "<br>Score:" + score).addClass("score");
    scoreP.parent("canvascontainer");
    scoreP.position(windowWidth / 2 - w / 2,10);
}

// Check if it is a touch screen or not
const isTouchScreen = () => {
    return (('ontouchstart' in window)
        || (navigator.MaxTouchPoints > 0)
        || (navigator.msMaxTouchPoints > 0));
}

// If it is a touch screen, use touches to play 
if (isTouchScreen()) {
    window.touchMoved = () => {
        if (start == false) {
            start = true;
            unpauseGame();
        }
        cannon.updateX(touches[0].x);
        cannon.setShoot();
        return false;
    }
    window.touchEnded = () => {
        cannon.unsetShoot();
        return false;
    }
} else { // Else use mouse to play
    window.mouseDragged = () => {
        if (start == false) {
            start = true;
            unpauseGame();
        }
        cannon.updateX(mouseX);
        cannon.setShoot();
        return false;
    }
    window.mouseReleased = () => {
        cannon.unsetShoot();
        return false;
    }
}

// Stop shooting once the keys are released
window.keyReleased = () => {
    if (keyCode == LEFT_ARROW || keyCode == RIGHT_ARROW || keyCode == UP_ARROW) {
        cannon.updateDir(0);
        cannon.unsetShoot(false);
    } 
}

// Pause game
const pauseGame = () =>{
    gamePaused = true; 
}

// Unpause game
const unpauseGame = () => {
    gamePaused = false;
}

// Start the game over and reinitialize everything
const resetGame = () =>{
    start = false;
    cannon = new Cannon(cannonAnimation);
    asteroids = [];
    bullets = [];
    counter = 0;
    score = 0;
}


window.draw = () => {
    // If game is paused, return
    if (gamePaused) return;

    // Background image
    image(backgroundImage, 0, 0, width, height);

    // Pause game until started
    if (start == false) {
        pauseGame();
        fill(255);
        textAlign(CENTER);
        textSize(24);
        text("Drag mouse / Slide to start", width / 2, height / 2);
    }

    cannon.constrain();

    // If cannon is shooting, add new bullets
    if (cannon.getShoot()) {
        bullets.push(new Bullet(cannon.getTop()[0], cannon.getTop()[1]));
    }

    // Manage bullets
    if (bullets.length > 0) {
        for (let i = bullets.length - 1; i >= 0; i--) {
            bullets[i].show();
            bullets[i].update();

            // Update score if bullet hits
            if ((asteroids.length > 0 && bullets[i].hits(asteroids))) {
                score += 1;
            }

            // Remove bullets when off screen or they hit
            if ((bullets[i].offScreen()) || (asteroids.length > 0 && bullets[i].hits(asteroids))) {
                bullets.splice(i,1);
                continue;
            }
        }
    }

    // Keep adding asteroids every so often OR if no asteroids on screen
    if ((counter % 300 == 0 || asteroids.length == 0) && counter!= 0) {
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
        asteroids.push(new Asteroid([x, y, r, dir, r + random(0,200)], asteroidImages));
        counter = 0;
    }
    counter++;

    // Manage asteroids
    if (asteroids.length > 0) {
        for (let i = asteroids.length - 1; i >= 0; i--) {
            asteroids[i].updateSpeed();
            asteroids[i].show();

            // If mass is 0, remove the asteroid and add two smaller ones
            if (asteroids[i].checkMass()) {
                let x = asteroids[i].getArgs()[0];
                let y = asteroids[i].getArgs()[1];
                let r = asteroids[i].getArgs()[2];
                let mass = asteroids[i].getMass();
                asteroids.splice(i,1);
                if (r / 2 >= 30) {
                    asteroids.push(new Asteroid([x - r / 2, min(y, 3 * cannon.getTop()[1]), r / 2, -1, mass / 2], asteroidImages));
                    asteroids.push(new Asteroid([x + r / 2, min(y, 3 * cannon.getTop()[1]), r / 2, 1, mass / 2], asteroidImages));
                }
            }

            if (asteroids.length <= 0) {
                break;
            }
        }
    }

    // If cannon is hit, game over
    if (cannon.hits(asteroids)) {
        resetGame();
    };

    cannon.show();
    cannon.update();

    // Update DOM elements
    if (score > highScore) {
        highScore = score;
    }
    scoreP.html("High Score:" + highScore + "<br>Score:" + score);
}