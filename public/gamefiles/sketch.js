/* Driver file for the game

Made by Cromulent Coder (https://github.com/CromulentCoder)

*/

(function(){
    // Create a socket
    let socket;

    // Start and pause game
    let gamePaused = false;
    let start = false;

    // Game objects
    let cannon;
    let asteroids = [];
    let powerups = [];
    let counter = 0;
    let bullets = [];

    // DOM elements for score
    let canvas; 
    let scoreP;
    let highScore;
    let score;
    let scoreToSend = 0;

    // Graphics
    let cannonAnimation = [];
    let asteroidImages = []; 
    let backgroundImage;

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

    // Load the images
    window.preload = () => {
        for (let i = 0; i < 13; i++) {
            cannonAnimation.push(loadImage("pics/frame" + i + ".png"));
        }
        backgroundImage = loadImage("pics/background.jpg");
        asteroidImages[0] = loadImage("pics/asteroid_black.png");
        asteroidImages[1] = loadImage("pics/asteroid_blue.png");
        
        updateTable("/sendData");

        socket = io.connect("localhost:3000");
        // socket = io.connect("https://asteroid-blaster.herokuapp.com/");
        socket.on("setScore", (data) => {
            score = data.score;
            highScore = data.highScore;
            scoreToSend = data.highScore;  
        });

    }

    // Initialize objects
    window.setup =  () => {

        // Create canvas
        let canvasParent = document.getElementById("canvascontainer");
        let w = canvasParent.offsetWidth * .9;
        canvas = createCanvas(w, windowHeight*.90).addClass("col-11");
        canvas.parent(canvasParent);

        frameRate(60);
        setInterval(() => {
            socket.emit("updateScore", {"score": scoreToSend});
            updateTable("/sendData");
          }, 3000); 

        // Initialize cannon object
        cannon = new Cannon(cannonAnimation);
        
        // Add DOM elements
        scoreP = createDiv("High Score:" + highScore + "<br>Score:" + score).addClass("canvas-score");
        scoreP.parent(canvasParent);
    }

    // If it is a touch screen, use touches to play 
    if (isTouchScreen()) {
        window.touchMoved = () => {
        if (touches[0].x >0 && touches[0].x < width && touches[0].y > 0 && touches[0].y < height){ // Check if touches within canvas
                if (start == false) {
                    start = true;
                    unpauseGame();
                }
                cannon.updateX(touches[0].x);
                cannon.setShoot();
                return false;
            }
        }
        window.touchEnded = () => {
            cannon.unsetShoot();
            return false;
        }
    } else { // Else use mouse to play
        window.mouseDragged = () => {
            if (mouseX >0 && mouseX < width && mouseY > 0 && mouseY < height){ // Check if mouse within canvas
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
    }

    // Resize canvas whenever window is resized
    window.windowResized = () =>{
        let canvasParent = document.getElementById("canvascontainer");
        let w = canvasParent.offsetWidth * .9;
        resizeCanvas(w, windowHeight*.90);
        if (cannon) {
            cannon.resetPos();
        }
    }

    window.draw = () => {

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

        cannon.show();
        cannon.constraint();

        // If game is paused, return
        if (gamePaused) return;

        if (random() < 0.01) {
            powerups.push(new Bubble());
        }

        if (powerups.length > 0) {
            for (let i = powerups.length - 1; i >= 0; i--) {
                powerups[i].show();
                powerups[i].update();

                if ((powerups[i].offScreen())) {
                    powerups.splice(i,1);
                    // console.log(powerups.length);
                    continue;
                }
            }     
        }

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

        // Update DOM elements
        if (score > highScore) {
            highScore = score;
            scoreToSend = score;
        }

        scoreP.html("High Score:" + highScore + "<br>Score:" + score);
    }
})();