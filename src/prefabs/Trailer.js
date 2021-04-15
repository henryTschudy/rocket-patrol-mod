class Trailer extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, parent, offsetX, offsetY, followY=false, wiggly=false) {
        super(scene, x, y, texture, frame);
        this.parent = parent;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.y = this.parent.y + this.offsetY;
        this.followY = followY;
        this.wiggly = wiggly;
        scene.add.existing(this);
    }

    update() {
        if (!this.wiggly){
            this.x = this.parent.x + this.offsetX;
        } else {
            var center = game.config.width-borderUISize-borderPadding-this.x-(this.width/2)
        }
        if (this.followY) {
            this.y = this.parent.y + this.offsetY;
        }
    }
}