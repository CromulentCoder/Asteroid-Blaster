/* Asteroid class

Made by Cromulent Coder (https://github.com/CromulentCoder)

*/

class Asteroid {
    constructor(args, images) {
        this.x = args[0];
        this.y = args[1]; 
        this.r = args[2];
        this.dir = args[3];
        this.mass = floor(args[4]);
        
        this.velX = 1.5 * this.dir;
        this.velY = 0;
        this.acc = 0;
        this.gravity = 0.1;

        this.orignalMass = this.mass;
        
        this.image = images[floor(random(2))]
    }
    
    // Return asteroid dimensions
    getArgs() {
        return [this.x, this.y, this.r];
    }

    // Return starting mass of asteroid
    getMass() {
        return this.orignalMass;
    }

    // Bounce off of walls and floor
    bounce() {
        if (this.y + this.r / 2 >= height) {
            this.y = height - this.r / 2;
            this.velY *= -0.99;
        }
        if (this.x - this.r / 2 <= 0 || this.x + this.r / 2 >= width) {
            this.dir *= -1;
            this.velX *= this.dir;
            if (this.x - this.r / 2 <= 0) {
                this.x = this.r / 2;
            } else {
                this.x = width - this.r / 2;
            }
        }
    }

    // Update velocities in X and Y direction 
    updateSpeed() {
        this.bounce();
        this.y += this.velY;
        this.velY += this.gravity;
        this.x += this.velX;
    }

    // Decrease mass by 1
    updateMass() {
        this.mass--;
    }

    // Check if mass is less than 0 or not
    checkMass() {
        if (this.mass <= 0) {
            return true;
        }
        return false;
    }

    // Display the asteroid
    show() {
        image(this.image, this.x - 3*this.r/4, this.y - 3*this.r/4,this.r * 1.45,this.r * 1.45);    
        fill(255);
        textAlign(CENTER);
        if (this.r / 4 > 12) {
            textSize(this.r / 4);
        } else {
            textSize(12);
        }
        text(this.mass, this.x, this.y);
        // noFill();
        // ellipse(this.x, this.y, this.r, this.r);
        
    }
}