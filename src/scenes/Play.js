class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('placeHolderBG', 'assets/placeHolderBG.png');
        this.load.image('bubble1', 'assets/bubbleParalax1.png');
        this.load.image('bubble2', 'assets/bubbleParalax2.png');
        this.load.image('octoHead', 'assets/octoHead.png');
        this.load.image('octoHeadSad', 'assets/octoHeadSad.png');
        this.load.image('octoHeadHappy', 'assets/octoHeadHappy.png');
        this.load.image('octoArm', 'assets/armSegment.png');
        this.load.image('handOpen', 'assets/handOpen.png');
        this.load.image('handClosed', 'assets/handClosed.png');
        this.load.image('handSub', 'assets/handSub.png');
        this.load.image('handSubFlipped', 'assets/handSubFlipped.png');
        this.load.image('submarine', 'assets/sub.png');
        this.load.spritesheet('explosion', 'assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        this.add.text("Rocket Control Play");
        this.background = this.add.tileSprite(0,0,640,480, 'placeHolderBG').setOrigin(0,0);
        this.bubble2 = this.add.tileSprite(0,0,640,480, 'bubble2').setOrigin(0,0);
        this.bubble2.setDepth(-2);
        this.background.setDepth(-2);

        // Add rocket (p1)
        this.octoHand = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding,'handOpen');
        this.octoHead = new Trailer(this, this.octoHand.x, this.octoHand.y,'octoHead', 0, this.octoHand, this.octoHand.width*3, -(this.octoHand.height-borderPadding), false, true).setDepth(-1);
        this.octoArm = new Trailer(this, 0, 0, 'octoArm', 0, this.octoHand, 0, 0, true);
        this.octoArm.offsetY = (this.octoArm.height + this.octoHand.height) / 2;
        this.octoArm.offsetX = this.octoArm.width/6;

        // Add 3 ships
        this.ship1 = new Ship(this, borderUISize*6, borderUISize*4, 'submarine', 0, 30).setOrigin(0, 0);
        this.ship2 = new Ship(this, borderUISize*3, borderUISize*5 + borderPadding*2, 'submarine', 0, 20, 'left').setOrigin(0,0);
        this.ship3 = new Ship(this, borderUISize, borderUISize*6 + borderPadding*4, 'submarine', 0, 10).setOrigin(0,0);

        this.bubble1 = this.add.tileSprite(0,0,640,480, 'bubble1').setOrigin(0,0);

        // green UI background
        this.add.rectangle(0,borderUISize + borderPadding,game.config.width,borderUISize * 2,0x00FF00,).setOrigin(0,0);

        // white borders
	    this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
	    this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
	    this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
	    this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);

        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        //Initialize score
        this.p1Score = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);

        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

    update() {
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.bubble1.tilePositionY += 2;
        this.bubble2.tilePositionY += 0.25;
        if (!this.gameOver) {               
            this.octoHand.update();         // update rocket sprite
            this.octoHead.update();
            this.octoArm.update();
            this.ship1.update();           // update spaceships (x3)
            this.ship2.update();
            this.ship3.update();
        } 
        
        if(this.checkCollision(this.octoHand, this.ship1)){
            this.octoHand.reset();
            this.shipExplode(this.ship1);
        };
        if(this.checkCollision(this.octoHand, this.ship2)){
            this.octoHand.reset();
            this.shipExplode(this.ship2);
        };
        if(this.checkCollision(this.octoHand, this.ship3)){
            this.octoHand.reset();
            this.shipExplode(this.ship3);
        };

    }

    checkCollision(rocket, ship) {
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y &&
            rocket.canGrab) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        this.cameras.main.shake(100, 0.03);
        if (ship.flipX){
            this.octoHand.currentGrab = 'handSubFlipped';
        } else {
            this.octoHand.currentGrab = 'handSub';
        }
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
          ship.reset();                         // reset ship position
          ship.alpha = 1;                       // make ship visible again
          boom.destroy();                       // remove explosion sprite
        });
        // score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        this.sound.play('sfx_explosion');        
      }
}