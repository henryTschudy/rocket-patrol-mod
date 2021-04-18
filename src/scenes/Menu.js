class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
        game.highScore = 0;
        game.hardHighScore = 0;
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/shipCrash.wav');
        this.load.audio('sfx_armWave', './assets/armWave.wav');
        this.load.audio('sfx_miss', './assets/miss.wav');
        this.load.audio('sfx_reload', './assets/reload.wav');
        this.load.audio('sfx_move', './assets/move.wav');
        this.load.image('background', './assets/background.png')
    }

    create() {
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#f9943b',
            color: '#000000',
            align: 'left',
            padding: {
              top: 5,
              bottom: 5,
            },
            fixedWidth: 0
        }
        this.add.image(game.config.width/2,game.config.height/2,'background')

        // show menu text
        this.add.text(game.config.width/2, game.config.height/4 - borderUISize - borderPadding, 'KRAKEN PATROL', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/3, 'Use ←→ arrows to move & (F) to fire', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#FF00FF';
        menuConfig.color = '#000';
        this.add.text(game.config.width/2, game.config.height/3 + borderUISize + borderPadding, 'Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/3 + (borderUISize + borderPadding)*2, 'Press ↓ to learn more.', menuConfig).setOrigin(0.5);
        
        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
          // easy mode
          game.settings = {
            gameMode: 'easy',
            shipSpeed: 3,
            gameTimer: 60000    
          }
          this.sound.play('sfx_select');
          this.scene.start('playScene');    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
          // hard mode
          game.settings = {
            gameMode: 'hard',
            shipSpeed: 4,
            gameTimer: 45000    
          }
          this.sound.play('sfx_select');
          this.scene.start('playScene');
        }
        if (Phaser.Input.Keyboard.JustDown(keyDOWN)) {
          this.sound.play('sfx_select');
          this.scene.start('aboutScene');  
        }
    }
}