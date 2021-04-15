class Ship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue, direction='right') {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.direction = direction;
        if(this.direction == 'left') {
            this.setFlip(true);
        } else {
            this.setFlip(false);
        }
        this.points = pointValue;
        this.moveSpeed = game.settings.shipSpeed;
    }

    update() {
        if (this.direction == 'left'){
            this.x -= this.moveSpeed;

            if(this.x < -this.width) {
                this.x = game.config.width;
            }
        } else {
            this.x += this.moveSpeed;

            if(this.x > game.config.width) {
                this.x = -50;
            }
        }
    }

    reset() {
        if (this.direction == 'left') {
            this.x = game.config.width + 50;
        } else {
            this.x = -50;
        }
        
    }
}