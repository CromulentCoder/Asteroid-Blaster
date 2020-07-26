/* Cannon class

Made by Cromulent Coder (https://github.com/CromulentCoder)

*/

class Cannon {
    constructor(canonAnimation, bulletAnimation) {
        this.w = 0.05 * width;
        this.h = 0.12 * height;
        this.x = width / 2 - this.w / 2 ;
        this.y = height - this.h;
        this.dir = 0;
        this.shoot = false;
        this.animation = canonAnimation;
        this.explosion = bulletAnimation;
        this.animationIndex = 0;
        this.explosionIndex = 0;
    }

    getDim() {
        return [this.x, this.y, this.w, this.h];
    }
    
    // Return top center of the cannon
    getTop() {
        return [this.x + this.w / 3, this.y - 20];
    }

    getDir() {
        return this.dir;
    }

    isShoot() {
        return this.shoot;
    }

    // Update the cannon's X coordinate
    setX(x) {
        this.x = x;
    }

    setDir(dir) {
        this.dir = dir;
    }

    // Set the value of shoot
    setShoot(shoot) {
        this.shoot = shoot;
    }
    

    // Reset cannon's position to center bottom
    resetPos() {
        this.x = width / 2 - this.w / 2 ;
        this.y = height - this.h;
    }

    // Check if cannon hits the asteroid
    hits(asteroids) {
        for (let i = 0; i < asteroids.length; i++) {
            let asteroidDim = asteroids[i].getDim();
            let centerX = asteroidDim[0], centerY = asteroidDim[1];
            let x = this.x
            if (checkPoint(centerX, centerY, this.x, this.y,asteroidDim[2] / 2)<= 1 || 
            checkPoint(centerX, centerY, this.x + this.w, this.y,asteroidDim[2] / 2)<= 1 ||
            checkPoint(centerX, centerY, this.x, this.y + this.h,asteroidDim[2] / 2)<= 1 ||
            checkPoint(centerX, centerY, this.x + this.w, this.y + this.h, asteroidDim[2] / 2)<= 1) {
                return true;
            }
        }
        return false;
    }

    // Display the cannon
    show() {
        stroke(125);
        if (this.shoot == true) {
            image(this.explosion[this.explosionIndex % this.explosion.length] , this.x + this.w / 3, this.y - 20, this.w * 0.3, this.h * 0.5);
            image(this.animation[this.animationIndex % this.animation.length] , this.x, this.y, this.w, this.h);
            this.animationIndex++;
            this.explosionIndex++;
        } else {
            image(this.animation[this.animation.length - 1], this.x, this.y, this.w, this.h);
        }
    }

    // Bound the cannon within the canvas boundary
    constraint() {
        if (this.x + 20 <= 0) {
            this.x = -20;
        } else if (this.x + this.w - 3 > width) {
            this.x = width - this.w - 3;
        }
    }

}