

class ResultScene extends Phaser.Scene {

	constructor() {
		super({key:'ResultScene'});
	}

	preload() {
		this.load.image('menuWindow', 'assets/window.png');
	}

	async clickButton() {
		this.cameras.main.fadeOut(1000, 0, 0, 0);
		this.cameras.main.once(
			Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
			() => {
				this.events.emit('resetTimer')
				this.scene.start("GameScene");
				this.scene.switch("GameScene");
			})
		
	}

	timeout (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
	}
	
	create() {
		this.cameras.main.fadeIn(1000, 0, 0, 0)
		
		var title = this.add.text(140, 200, `Level Complete`, { fontSize: "64px", color: "#FFFFFF", fontFamily: "Impact", stroke: '#000000', strokeThickness: 10 });
		
		this.events.emit('timerBonus')
		var text = this.add.text(250, 500, `> Next Level`, { fontSize: "24px", color: "#fff", fontFamily: "Impact", stroke: '#000', strokeThickness: 5});
		text.setInteractive({ useHandCursor: true });
		text.on('pointerdown', () => this.clickButton());
	}

}

export default ResultScene;