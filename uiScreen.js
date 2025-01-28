

class UIScene extends Phaser.Scene {

	constructor() {
		super({key:'UIScene'});
	}

	preload() {
		this.load.image('life', 'assets/life.png');
	}

	timeout (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
	}

	saveHighScore () {
		let highscore = localStorage.getItem("thief_highscore");
		if (!highscore) {
			highscore = []
		} else {
			highscore = JSON.parse(highscore)
		}
		const currentDate = new Date().toISOString().split('T')[0]
		highscore.push({date: currentDate, level: this.currentLevel.level, score: this.scoreText.score})
		highscore.sort(function(a, b){return b.score - a.score});
		if (highscore.length > 10) {
			highscore.length = 10
		}
		localStorage.setItem("thief_highscore", JSON.stringify(highscore))
	}
	
	create() {
		this.hp = 3
		this.hp1 = this.add.sprite(60,100, 'life').setScale(0.3, 0.3)
		this.hp2 = this.add.sprite(100,100, 'life').setScale(0.3, 0.3)
		this.hp3 = this.add.sprite(140,100, 'life').setScale(0.3, 0.3)
		this.scoreText = this.add.text(500,40, "0", { fontSize: "32px", color: "#FFFFFF", fontFamily: "Impact", stroke: '#000000', strokeThickness: 5 }); //Elapsed Time Text
		this.scoreText.score = 0
		this.scoreText.nextScoreBonusLevel = 50000
		this.currentLevel = this.add.text(500,80, "LEVEL 1", { fontSize: "32px", color: "#FFFFFF", fontFamily: "Impact", stroke: '#000000', strokeThickness: 5 }); //Elapsed Time Text
		this.currentLevel.level = 1
		this.timeText = this.add.text(60,30, "2:00 ", { fontSize: "32px", color: "#FFFFFF", fontFamily: "Impact", stroke: '#000000', strokeThickness: 5 }); //Elapsed Time Text
		this.scene.get('GameScene').events.on('stopTimer', () => {
			this.timerEvent.paused = true
		})
		this.timeText.seconds = 0
		this.timeText.minutes = 2
		this.timerEvent = this.time.addEvent({
			delay: 1000, 
			callback: () => {
				if (this.timeText) {
					if (this.timeText.seconds == 0) {
						this.timeText.seconds = 59
						this.timeText.minutes--
					} else {
						this.timeText.seconds--
					}

					if (this.timeText.minutes == 0 && this.timeText.seconds == 0) {
						this.saveHighScore()
						this.cameras.main.shake(100);
						this.cameras.main.fadeOut(1000, 0, 0, 0);
						this.cameras.main.once(
							Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
							() => {
								this.scene.switch("BootScene");
								this.scene.stop("GameScene");
								this.scene.stop("UIScene")
							})
						
					}
					
					this.timeText.setText(this.timeText.minutes + ":" + this.timeText.seconds);
				}
			},
			callbackScope: this, 
			loop: true 
		});
		this.scene.get('GameScene').events.on('damageTaken', () => {
			this.cameras.main.shake(50);
			this.hp--
			if (this.hp == 2) {
				this.hp1.alpha = 1
				this.hp2.alpha = 1
				this.hp3.alpha = 0
			}

			if (this.hp == 1) {
				this.hp1.alpha = 1
				this.hp2.alpha = 0
				this.hp3.alpha = 0
			}

			if (this.hp == 0) {
				this.hp1.alpha = 0
				this.hp2.alpha = 0
				this.hp3.alpha = 0
			}


			if (this.hp <= 0) {
				this.cameras.main.shake(100);
				this.cameras.main.fadeOut(1000, 0, 0, 0);
				this.cameras.main.once(
					Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
					() => {
						this.saveHighScore()
						this.scene.switch("BootScene");
						this.scene.stop("GameScene");
						this.scene.stop("UIScene")
					})
				
			}
		})
		this.scene.get('GameScene').events.on('scoreUp', (score) => {
			this.scoreText.score += score
			this.scoreText.setText(this.scoreText.score);
		})
		this.scene.get('ResultScene').events.on('resetTimer', () => {
			this.timeText.seconds = 0
			this.timeText.minutes = 2
			this.timeText.setText("2:00");
			this.timerEvent.paused = false
			this.currentLevel.level++
			this.currentLevel.setText("LEVEL" + this.currentLevel.level);
		})
		this.scene.get('ResultScene').events.on('timerBonus', () => {
			this.scoreText.score += (this.timeText.seconds * (this.timeText.minutes+1)) * 100

			this.scoreText.setText(this.scoreText.score);
			if (this.scoreText.score > this.scoreText.nextScoreBonusLevel) {
				if (this.hp < 3) 
					this.hp++
				if (this.hp == 3) {
					this.hp1.alpha = 1
					this.hp2.alpha = 1
					this.hp3.alpha = 1
				}

				if (this.hp == 2) {
					this.hp1.alpha = 1
					this.hp2.alpha = 1
					this.hp3.alpha = 0
				}

				if (this.hp == 1) {
					this.hp1.alpha = 1
					this.hp2.alpha = 0
					this.hp3.alpha = 0
				}

				this.scoreText.nextScoreBonusLevel += 50000
			}
		})
	}
}

export default UIScene;