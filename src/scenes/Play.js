class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('PBG1', 'assets/PBG1.png');
        this.load.image('PBG2', 'assets/PBG2.png');
        this.load.image('PBG3', 'assets/PBG3.png');
        this.load.image('PBG4', 'assets/PBG4.png');
        this.load.image('PBG5', 'assets/PBG5.png');
        this.load.image('PBG6', 'assets/PBG6.png');
        this.load.image('bubble1', 'assets/bubbleParallax1.png');
        this.load.image('bubble2', 'assets/bubbleParallax2.png');
        this.load.image('octoHead', 'assets/octoHead.png');
        this.load.image('octoHeadSad', 'assets/octoHeadSad.png');
        this.load.image('octoHeadHappy', 'assets/octoHeadHappy.png');
        this.load.image('octoArm', 'assets/armSegment.png');
        this.load.image('handOpen', 'assets/handOpen.png');
        this.load.image('handClosed', 'assets/handClosed.png');
        this.load.image('handSub', 'assets/handSub.png');
        this.load.image('handSubFlipped', 'assets/handSubFlipped.png');
        this.load.image('submarine', 'assets/sub.png');
        this.load.image('bubble', 'assets/bubbleBig.png');
        this.load.spritesheet('explosion', 'assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        this.music = this.sound.add('music_bg');
        this.music.loop = true;
        this.music.play();

        if (game.settings.gameMode == 'hard'){
            this.highScore = game.hardHighScore;
        } else {
            this.highsScore = game.highScore
        }

        this.speedBoost = false;

        this.background = this.add.tileSprite(0,0,640,480, 'PBG5', 0).setOrigin(0,0).setDepth(-2);
        this.parallax1 = this.add.tileSprite(0,0,640,480, 'PBG4', 0).setOrigin(0,0).setDepth(-2);
        this.parallax2 = this.add.tileSprite(0,0,640,480, 'PBG3', 0).setOrigin(0,0).setDepth(-2);
        this.parallax3 = this.add.tileSprite(0,0,640,480, 'PBG2', 0).setOrigin(0,0).setDepth(-2);
        this.parallax4 = this.add.tileSprite(0,0,640,480, 'PBG1', 0).setOrigin(0,0).setDepth(-2);
        this.bubble2 = this.add.tileSprite(0,0,640,480, 'bubble2').setOrigin(0,0).setDepth(-2);
        this.parallax5 = this.add.tileSprite(0,-10,640,480, 'PBG6', 0).setOrigin(0,0).setDepth(1);

        // Add rocket (p1)
        this.octoHand = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding,'handOpen');
        this.octoHead = new Trailer(this, this.octoHand.x, this.octoHand.y,'octoHead', 0, this.octoHand, this.octoHand.width*3, -(this.octoHand.height-borderPadding), false, true).setDepth(-1);
        this.octoArm = new Trailer(this, 0, 0, 'octoArm', 0, this.octoHand, 0, 0, true);
        this.octoArm.offsetY = (this.octoArm.height + this.octoHand.height) / 2;
        this.octoArm.offsetX = this.octoArm.width/6;

        // Add 3 ships
        this.ship1 = new Ship(this, borderUISize*6, borderUISize*4, 'submarine', 0, 30, Phaser.Math.RND.pick(['left', 'right'])).setOrigin(0, 0);
        this.ship2 = new Ship(this, borderUISize*3, borderUISize*5 + borderPadding*2, 'submarine', 0, 20, Phaser.Math.RND.pick(['left', 'right'])).setOrigin(0,0);
        this.ship3 = new Ship(this, borderUISize, borderUISize*6 + borderPadding*4, 'submarine', 0, 10, Phaser.Math.RND.pick(['left', 'right'])).setOrigin(0,0);

        this.bubble1 = this.add.tileSprite(0,0,640,480, 'bubble1').setOrigin(0,0);

        // UI background
        this.add.rectangle(0,borderUISize + borderPadding,game.config.width,borderUISize * 2,0xe16a00,).setOrigin(0,0).setDepth(2);

        // white borders
	    this.add.rectangle(0-borderUISize, 0-borderUISize, game.config.width+borderUISize*2, borderUISize*2, 0x042263).setOrigin(0 ,0).setDepth(2);
	    this.add.rectangle(0-borderUISize, game.config.height - borderUISize, game.config.width+borderUISize*2, borderUISize*2, 0x042263).setOrigin(0 ,0).setDepth(2);
	    this.add.rectangle(0-borderUISize, 0-borderUISize, borderUISize*2, game.config.height, 0x042263).setOrigin(0 ,0).setDepth(2);
	    this.add.rectangle(game.config.width - borderUISize, 0, borderUISize*2, game.config.height, 0x042263).setOrigin(0 ,0).setDepth(2);

        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        
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
            backgroundColor: '#f9943b',
            color: '#000000',
            align: 'left',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 160
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, 'score:' + this.p1Score, scoreConfig).setDepth(2);
        if (game.settings.gameMode == 'hard'){
            this.scoreLeftHigh = this.add.text(borderUISize + borderPadding*2 + scoreConfig.fixedWidth, borderUISize + borderPadding*2, game.hardHighScore, scoreConfig).setDepth(2);
        } else {
            this.scoreLeftHigh = this.add.text(borderUISize + borderPadding*15, borderUISize + borderPadding*2, game.highScore, scoreConfig).setDepth(2);
        }
        this.timerText = this.add.text(game.config.width - borderPadding - borderUISize - scoreConfig.fixedWidth, borderUISize + borderPadding*2, game.highScore, scoreConfig).setDepth(2);

        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

        // 30-sec timer. Seperate from the play clock since that can change from bonus time.
        this.clockCounter = this.time.delayedCall(game.settings.gameTimer/2, () => {
            game.settings.shipSpeed = game.settings.shipSpeed * 1.5;
        }, null, this);
    }

    update() {
        this.timerText.text = 'time:  ' + (game.settings.gameTimer/1000 - this.clock.getElapsedSeconds().toString().substr(0, 2));
        if (game.settings.gameMode == 'hard'){
            this.scoreLeftHigh.text = 'best: ' + game.hardHighScore;
            if (!this.gameOver && this.p1Score > game.hardHighScore) {
                game.hardHighScore = this.p1Score;
            }
        } else {
            this.scoreLeftHigh.text = 'best: ' + game.highScore;
            if (!this.gameOver && this.p1Score > game.highScore) {
                game.highScore = this.p1Score;
            }
        }
        if (this.gameOver && this.music.volume > 0) {
                this.music.volume -= 0.01;
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.music.stop();
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.music.stop();
            this.scene.start("menuScene");
        }
        if (Phaser.Input.Keyboard.JustDown(keyESC)) {
            music.stop();
            this.game.sound.stopAll();
            this.sound.play('sfx_select');
            this.scene.start("menuScene");
        }

        this.bubble1.tilePositionY += 2;
        this.bubble2.tilePositionY += 0.25;

        this.background.tilePositionX = this.octoHead.x/10
        this.parallax1.tilePositionX = this.octoHead.x/8
        this.parallax2.tilePositionX = this.octoHead.x/6
        this.parallax3.tilePositionX = this.octoHead.x/4
        this.parallax4.tilePositionX = this.octoHead.x/2
        this.parallax5.tilePositionX = this.octoHead.x/0.5

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

        if(this.octoHand.y < borderUISize*3){
            this.octoHead.setTexture('octoHeadSad');
        }
        if(this.octoHand.y == game.config.height-borderUISize-borderPadding) {
            this.octoHead.setTexture('octoHead');
        }

    }

    checkCollision(hand, ship) {
        if (hand.x + (hand.width/4) < ship.x + ship.width && 
            hand.x + hand.width-(hand.width/4) > ship.x && 
            hand.y < ship.y + ship.height &&
            hand.height + hand.y > ship. y &&
            hand.canGrab) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        this.cameras.main.shake(100, 0.03);
        this.octoHead.setTexture('octoHeadHappy');
        if (ship.flipX){
            this.octoHand.currentGrab = 'handSubFlipped';
        } else {
            this.octoHand.currentGrab = 'handSub';
        }
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        let bubbleManager = this.add.particles('bubble');
        let bubbles = bubbleManager.createEmitter();
        boom.anims.play('explode');             // play explode animation
        bubbles.setPosition(ship.x, ship.y);
        bubbles.setSpeed(200);
        bubbles.maxParticles = 10;
        boom.on('animationcomplete', () => {    // callback after anim completes
          ship.reset();                         // reset ship position
          ship.alpha = 1;                       // make ship visible again
          boom.destroy();                       // remove explosion sprite
          bubbleManager.destroy();
        });
        // score add and repaint
        this.p1Score += ship.points;
        this.clock.elapsed -= ship.points*100;
        this.scoreLeft.text = 'score:' + this.p1Score;
        this.sound.play('sfx_explosion');        
      }
}