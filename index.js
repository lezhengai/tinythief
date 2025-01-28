import TitleScene from './titleScreen.js';
import GameScene from './gameScreen.js';
import BootScene from './bootScene.js';
import ResultScene from './resultScreen.js'
import UIScene from './uiScreen.js';


const _WorldScene = new GameScene()
const _TitleScene = new TitleScene()
const _BootScene = new BootScene()
const _ResultScene = new ResultScene()
const _UIScene = new UIScene()



const config = {
    type: Phaser.AUTO,
    parent: 'content',
    width:  640,
    height: 1136,
    pixelArt: true,
    scene: [
        _BootScene,
        _TitleScene,
        _WorldScene,
        _ResultScene,
        _UIScene
    ],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

new Phaser.Game(config);
