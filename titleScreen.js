

class TitleScene extends Phaser.Scene {

	constructor() {
		super({key:'TitleScene'});
	}

	preload() {
		this.load.image('menuWindow', 'assets/window.png');
		this.load.image('player_idle_1', 'assets/player/player_idle_1.png')
        this.load.image('player_idle_2', 'assets/player/player_idle_2.png')
        this.load.image('player_idle_3', 'assets/player/player_idle_3.png')
        this.load.image('vault1', 'assets/vault/vault1.png');
        this.load.image('vault2', 'assets/vault/vault2.png');
        this.load.image('vault3', 'assets/vault/vault3.png');
	}

	async clickButton() {
		this.cameras.main.fadeOut(1000, 0, 0, 0);
		this.cameras.main.once(
			Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
			() => {
				this.scene.switch("GameScene");
			})
	}

	timeout (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
	}
	
	create() {
		this.anims.create({
            key: 'player_idle',
            frames: [
                { key: 'player_idle_1' },
                { key: 'player_idle_2' },
                { key: 'player_idle_3' }
            ],
            frameRate: 5,
            repeat: -1
        });

		this.anims.create({
            key: 'vault_close',
            frames: [
                { key: 'vault1' },
                { key: 'vault2' },
                { key: 'vault3' }
            ],
            frameRate: 5,
            repeat: -1
        });

		this.cameras.main.fadeIn(1000, 0, 0, 0)

		this.vault = this.physics.add.sprite(400, 900, 'vault1').setScale(0.5, 0.5).play('vault_close')
		this.player = this.physics.add.sprite(260, 900, 'player_idle_1').setScale(0.5, 0.5).play('player_idle')
		var title = this.add.text(180, 100, `Tiny Thief`, { fontSize: "64px", color: "#FFFFFF", fontFamily: "Impact", stroke: '#000000', strokeThickness: 10 });

		let highscore = localStorage.getItem("thief_highscore");
		if (!highscore) {
			highscore = []
		} else {
			highscore = JSON.parse(highscore)
		}

		highscore.sort(function(a, b){return b.score - a.score});
		if (highscore.length > 10) {
			highscore.length = 10
		}

		var title = this.add.text(220, 200, `HIGHSCORE`, { fontSize: "28px", color: "#FFFFFF", fontFamily: "Arial", stroke: '#000000', strokeThickness: 5 });
		highscore.map((score, index) => {
			if (score.score != 0) {
				this.add.text(160, 250+(index*30), `${score.score}__Level ${score.level}__${score.date}`, { fontSize: "24px", color: "#FFFFFF", fontFamily: "Arial", stroke: '#000000', strokeThickness: 5 });
			}
		})


		var text = this.add.text(220, 700, `> Start game`, { fontSize: "32px", color: "#fff", fontFamily: "Arial", stroke: '#000', strokeThickness: 5});
		text.setInteractive({ useHandCursor: true });
		text.on('pointerdown', () => this.clickButton());
	}

}

export default TitleScene;