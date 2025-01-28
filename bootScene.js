

class BootScene extends Phaser.Scene {

	constructor() {
		super({key:'BootScene'});
	}

    preload() {

    }

    create () {
        this.scene.start('TitleScene')
    }

}

export default BootScene;