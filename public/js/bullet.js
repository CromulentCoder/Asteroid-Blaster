/* Bullet class

Made by Cromulent Coder (https://github.com/CromulentCoder)

*/

class Bullet {
    constructor(x, y, bulletImage) {
        this.x = x;
        this.y = y;
        this.r = 8;
        this.vel = 10;
        this.opacity = 0.9;
        this.image = bulletImage;
    }

    getDim() {
        return [this.x, this.y, this.r];
    }

    getVel() {
        return this.vel;
    }

    setDim(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }

    setVel(vel) {
        this.vel = vel;
    }

    // Check if bullet is offscreen
    offScreen() {
        if (this.y < 0)
            return true;
    }

    // Check if bullet hits the asteroid, if true update asteroid mass
    hits(asteroids) {
        for (let i = 0; i < asteroids.length; i++) {
            let x = asteroids[i].getDim()[0];
            let y = asteroids[i].getDim()[1];
            let r = asteroids[i].getDim()[2];

            let dist = sqrt(pow(x - this.x, 2) + pow(y - this.y, 2));
            if (dist < this.r / 2 + r / 2) {
                asteroids[i].updateMass();
                return true;
            }
        }
        return false;
    }

    // Update position
    update() {
        this.y -= this.vel;
    }

    // Display the bullet
    show() {
        image(this.image, this.x, this.y, this.r, this.r);
    }
}