/* Cannon class

Made by Cromulent Coder (https://github.com/CromulentCoder)

*/

class Cannon {
    constructor(animation) {
        this.w = 80;
        this.h = 100;
        this.x = width / 2 - this.w / 2 ;
        this.y = height - this.h;
        this.dir = 0;
        this.shoot = false;

        this.animation = animation;
        this.index = 0;
    }

    // Return top center of the cannon
    getTop() {
        return [this.x + this.w / 2, this.y + 35];
    }

    // Return the value of shoot
    getShoot() {
        return this.shoot;
    }

    // Set the value of shoot
    setShoot() {
        this.shoot = true;
    }

    // Unset the value of shoot
    unsetShoot() {
        this.shoot = false;
    }
    
    // Update the cannon's X coordinate
    updateX(X) {
        this.x = X;
    }

    // Check if cannon hits the asteroid
    hits(asteroids) {
        for (let i = 0; i < asteroids.length; i++) {
            let circle = asteroids[i].getArgs();
            if (checkPoint(circle[0], circle[1], this.x + 20, this.y + 35,circle[2] / 2)<= 1 || 
            checkPoint(circle[0], circle[1], this.x + this.w - 40, this.y + 35,circle[2] / 2)<= 1 ||
            checkPoint(circle[0], circle[1], this.x + 20, this.y + this.h,circle[2] / 2)<= 1 ||
            checkPoint(circle[0], circle[1], this.x + this.w - 40, this.y + this.h,circle[2] / 2)<= 1) {
                return true;
            }
        }
        return false;
    }

    // Display the cannon
    show() {
        if (this.shoot == true) {
            image(this.animation[this.index % this.animation.length] , this.x, this.y, this.w, this.h);
            this.index ++;
        } else {
            image(this.animation[12], this.x, this.y, this.w, this.h);
        }

        // stroke(125);
        // noFill();
        // rect(this.x + 20, this.y + 35, this.w - 40, this.h);
    }

    // Bound the cannon within the canvas boundary
    constrain() {
        this.x = constrain(this.x, -20, width - this.w + 20);
    }

}

// Helper function to check if point lies on the ellipse or not
const checkPoint = (h, k, x, y, r) => { 
    p = (pow((x - h), 2) / pow(r, 2)) 
            + (pow((y - k), 2) / pow(r, 2)); 
    return p; 
} 