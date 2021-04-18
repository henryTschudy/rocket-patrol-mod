class About extends Phaser.Scene {
    constructor() {
        super("aboutScene");
    }

    preload(){

    }

    create(){
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        let aboutConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#FF00FF',
            color: '#000000',
            align: 'left',
            padding: {
              top: 5,
              bottom: 5,
            },
            fixedWidth: 0
        }
        this.aboutText = this.add.text(game.config.width/2, game.config.height/5, 'You are a kraken trying to eat submarines.').setOrigin(0.5);
        this.aboutText = this.add.text(game.config.width/2, game.config.height/5 + borderUISize, 'The farther away a submarine the more points it is worth.').setOrigin(0.5);
        this.aboutText = this.add.text(game.config.width/2, game.config.height/5 + borderUISize*2, 'Eating a submarine grants you bonus time.').setOrigin(0.5);
        this.aboutText = this.add.text(game.config.width/2, game.config.height/5 + borderUISize*3, 'Press [esc] to exit to the menu at any time.').setOrigin(0.5);
        this.aboutText = this.add.text(game.config.width/2, game.config.height/5 + borderUISize*5, 'Music, sound, and assets by Henry Tschudy').setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/3 + (borderUISize + borderPadding)*5, 'Press [esc] for menu.', aboutConfig).setOrigin(0.5);
    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.sound.play('sfx_select');
            this.scene.start('menuScene');  
        }
    }
}