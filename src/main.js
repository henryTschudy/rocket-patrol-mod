/*
These are the mod features I have included.
Track a high score that persists across scenes and display it in the UI (5)
    The high score is tracked seperately between easy and hard mode.
Add your own (copyright-free) background music to the Play scene (5)
Randomize each spaceship's movement direction at the start of each play (5)
Create a new scrolling tile sprite for the background (5)

Display the time remaining (in seconds) on the screen (10)
*Create a new title screen (e.g., new artwork, typography, layout) (10)
    This one may overlap with the 60-point redesign feature.

Implement parallax scrolling (10)

Implement a new timing/scoring mechanism that adds time to the clock for successful hits (20)
Use Phaser's particle emitter to create a particle explosion when the rocket hits the spaceship (20)
    Added a bubble explosion that triggers on sub death.

Redesign the game's artwork, UI, and sound to change its theme/aesthetic (to something other than sci-fi) (60)
    Redesigned to be underwater themed.
*/


let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu, About, Play],
}

let game = new Phaser.Game(config);

let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

let keyLEFT, keyRIGHT, keyDOWN, keyESC, keyF, keyR;