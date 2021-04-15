class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.movementSpeed = 3;
        this.isReturning = false;
        this.isFiring = false;
        this.canGrab = false;
        this.currentGrab = 'handClosed';
        this.sfxRocket = scene.sound.add('sfx_rocket'); // add rocket sfx
    }

    update() {
        if(this.isFiring && !this.isReturning) {
            this.y -= this.movementSpeed*2;
            if(this.y < borderUISize*3) {
                this.reset();
            }
        }
        else if (this.isReturning){
            this.setTexture(this.currentGrab);
            this.y += this.movementSpeed;
            if(this.y == game.config.height-borderUISize-borderPadding) {
                this.isReturning = false;
                this.isFiring = false;
                this.setTexture('handOpen');
                this.currentGrab = 'handClosed';
            }
        } else {
            if(keyLEFT.isDown) {
                this.x -= this.movementSpeed;
            }
            if(keyRIGHT.isDown) {
                this.x += this.movementSpeed;
            }

            // fire button
            if (Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
                this.isFiring = true;
                this.canGrab = true;
                this.sfxRocket.play();  // play sfx
            }
    
            this.x = Phaser.Math.Clamp(
                this.x,
                borderUISize + borderPadding,
                game.config.width - borderUISize - borderPadding);
        }   
    }
    reset(){
        this.canGrab = false;
        this.isReturning = true;
    }
}