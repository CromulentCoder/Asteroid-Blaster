
class Bubble {
    constructor() {
        this.x = random(30, width - 30);
        this.y = height / 2;
        this.r = 30;
    }

    offScreen() {
        if (this.y <= 0) {
            return true;
        }
        return false;
    }

    update() {
        this.y--;
    }

    show() {
        stroke(255);
        noFill();
        ellipse(this.x, this.y, this.r, this.r);
    }
}