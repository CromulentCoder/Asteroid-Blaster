/* Asteroid class

Made by Cromulent Coder (https://github.com/CromulentCoder)

*/

class Asteroid {
    constructor(args, image) {
        this.x = args[0];
        this.y = args[1];
        this.diameter = args[2];
        this.dir = args[3];
        this.mass = floor(args[4]);

        this.velX = 1.5 * this.dir;
        this.velY = 0;
        this.acc = 0;
        this.gravity = 0.3;

        this.initialMass = this.mass;

        this.image = image;
    }

    getDim() {
        return [this.x, this.y, this.diameter];
    }

    getDir() {
        return this.dir;
    }

    getMass() {
        return this.mass;
    }

    getInitialMass() {
        return this.initialMass;
    }

    getVel() {
        return [this.velX, this.velY];
    }

    getAcc() {
        return this.acc;
    }

    getGravity() {
        return this.gravity;
    }

    getImage() {
        return this.image;
    }

    setDim(x, y, d) {
        this.x = x;
        this.y = y;
        this.diameter = d;
    }

    setDir(dir) {
        this.dir = dir;
    }

    setMass(mass) {
        this.mass = mass;
    }

    setVel(velX, velY) {
        this.velX = velX;
        this.velY = velY;
    }

    setAcc(acc) {
        this.acc = acc;
    }

    setGravity(gravity) {
        this.gravity = gravity;
    }

    // Bounce off of walls and floor
    bounce() {
        if (this.y + this.diameter / 2 >= height) {
            this.y = height - this.diameter / 2;
            this.velY *= -1;
        }

        if (this.x - this.diameter / 2 <= 0 || this.x + this.diameter / 2 >= width) {
            this.dir *= -1;
            this.velX *= this.dir;
            if (this.x - this.diameter / 2 <= 0) {
                this.x = this.diameter / 2;
            } else this.x = width - this.diameter / 2;
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
        if (this.mass <= 0) return true;
        return false;
    }

    // Display the asteroid
    show() {
        stroke(0);
        image(this.image, this.x - 3 * this.diameter / 4, this.y - 3 * this.diameter / 4,
            this.diameter * 1.45, this.diameter * 1.45);
        fill(255);
        textAlign(CENTER);
        if (this.diameter / 4 > 12) {
            textSize(this.diameter / 4);
        } else {
            textSize(12);
        }
        text(this.mass, this.x, this.y);
    }
}