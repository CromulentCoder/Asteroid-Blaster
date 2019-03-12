/* Driver file for the game

Made by Cromulent Coder (https://github.com/CromulentCoder)

*/

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

// DOM elements for creating the table
let table;
let tbody; 
let data;

// Graphics
let cannonAnimation = [];
let asteroidImages = []; 
let backgroundImage;

// Create the type of element you pass in the parameters
function createNode(element) {
    return document.createElement(element); 
}

// Append the second parameter(element) to the first one
function appendElement(parent, el) {
return parent.appendChild(el); 
}

// Function to get data from database
const getData = async (url = ``) => {
    const response = await fetch(url);
    let rows = await response.json();
    let ctr = 1;
    let newTbody = createNode('tbody');
    rows.map((row) => {
        let tr = createNode('tr'),
            tdNumber = createNode('td'),
            tdName = createNode('td'),
            tdScore = createNode('td');
        tr.classList.add("table-content");
        tdNumber.innerHTML = `${ctr++}`;
        tdName.innerHTML = `${row.name}`;
        tdScore.innerHTML = `${row.score}`;
        appendElement(tr, tdNumber);
        appendElement(tr, tdName);
        appendElement(tr, tdScore);
        appendElement(newTbody, tr);
    });
    table.replaceChild(newTbody, tbody);
    tbody = newTbody;
}

// Function to post data to database
const postData = async (url = ``, data = {}) => {
    const response = await fetch(url, {
                        method: "POST",
                        credentials: "same-origin", 
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(data)
                    });
    const json = await response.json();
}

// Update the leaderboard with the new scores
const updateTable = async(urlget = ``,urlpost = ``, data = {}) => {
    await postData(urlpost,data);
    await getData(urlget);
}

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
    
    // Create canvas
    let canvasParent = document.getElementById("canvascontainer");
    let w = canvasParent.offsetWidth * .9;
    canvas = createCanvas(w, windowHeight*.90).addClass("col-11");
    canvas.parent(canvasParent);

    // Initialize cannon object
    cannon = new Cannon(cannonAnimation);
    
    // Add DOM elements
    scoreP = createDiv("High Score:" + highScore + "<br>Score:" + score).addClass("canvas-score");
    scoreP.parent(canvasParent);

    table = document.getElementsByTagName("table")[0];
    tbody = table.getElementsByTagName("tbody")[0];

    getData("/sendData");
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

    // If game is paused, return
    if (gamePaused) return;

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
        updateTable("/sendData", "/updateTable", {"score":highScore});
        resetGame();
    };

    // Update DOM elements
    if (score > highScore) {
        highScore = score;
    }
    scoreP.html("High Score:" + highScore + "<br>Score:" + score);
}