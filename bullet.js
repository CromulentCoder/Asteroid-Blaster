class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.r = 8;
        this.vel = 10;

        // this.image = image;
        // console.log(this.image);
    }
    offScreen() {
        if (this.y < 0) 
            return true;
    }

    hit(asteroids) {
        for (let i = 0; i < asteroids.length; i++) {
            let x = asteroids[i].getArgs()[0];
            let y = asteroids[i].getArgs()[1];
            let r = asteroids[i].getArgs()[2];
            let d = sqrt(pow(x - this.x, 2) + pow(y - this.y, 2));
            if (d < this.r / 2 + r / 2) {
                asteroids[i].updateMass();
                return true;
            }
        }
        return false;
    }

    update() {
        this.y -= this.vel;
    }
    
    show() {
        stroke(125);
        fill(0);
        ellipse(this.x, this.y, this.r, this.r);
        // image(this.image, this.x, this.y, this.r, this.r);
    }
}