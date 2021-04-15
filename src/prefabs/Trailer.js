class Trailer extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, parent, offsetX, offsetY, followY=false, wiggly=false) {
        super(scene, x, y, texture, frame);
        this.parent = parent;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.y = this.parent.y + this.offsetY;
        this.x = this.parent.x + this.offsetX;
        this.followY = followY;
        this.wiggly = wiggly;
        scene.add.existing(this);
    }

    update() {
        if (!this.wiggly){
            this.x = this.parent.x + this.offsetX;
        } else {
            if (this.x > this.parent.x) {
                this.setFlip(false);
            } else {
                this.setFlip(true);
            }

            if ( this.x - this.width/2 > this.parent.x + this.parent.width/2) {
                while (this.x - this.width/2 > this.parent.x + this.parent.width/2){
                    this.x -= this.parent.movementSpeed;
                }
            } else if (this.x + this.width/2 < this.parent.x - this.parent.width/2) {
                while (this.x + this.width/2 < this.parent.x - this.parent.width/2){
                    this.x += this.parent.movementSpeed;
                }
            
            }

        }
        if (this.followY) {
            this.y = this.parent.y + this.offsetY;
        }
    }
}