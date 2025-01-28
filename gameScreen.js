

class GameScene extends Phaser.Scene {

	constructor() {
		super({key:'GameScene'});
	}

    preload() {
        this.load.image('background', 'assets/background.png');
        this.load.image('bg1', '/assets/background1.png');
        this.load.image('bg2', '/assets/background3.png');
        this.load.image('bg3', '/assets/background2.png');
        this.load.image('raccoon', 'assets/raccoon.png');
        this.load.image('player_idle_1', 'assets/player/player_idle_1.png')
        this.load.image('player_idle_2', 'assets/player/player_idle_2.png')
        this.load.image('player_idle_3', 'assets/player/player_idle_3.png')
        this.load.image('player_inbetween', 'assets/player/player_inbetween.png')
        this.load.image('player_land_1', 'assets/player/player_land_1.png')
        this.load.image('player_land_2', 'assets/player/player_land_2.png')
        this.load.image('player_run_1', 'assets/player/player_run_1.png')
        this.load.image('player_run_2', 'assets/player/player_run_2.png')
        this.load.image('player_run_3', 'assets/player/player_run_3.png')
        this.load.image('player_run_4', 'assets/player/player_run_4.png')
        this.load.image('player_think_1', 'assets/player/player_think_1.png')
        this.load.image('player_think_2', 'assets/player/player_think_2.png')
        this.load.image('player_think_3', 'assets/player/player_think_3.png')
        this.load.image('vault_open1', 'assets/vault/vault_open1.png');
        this.load.image('vault_open2', 'assets/vault/vault_open2.png');
        this.load.image('vault_open3', 'assets/vault/vault_open3.png');
        this.load.image('vault1', 'assets/vault/vault1.png');
        this.load.image('vault2', 'assets/vault/vault2.png');
        this.load.image('vault3', 'assets/vault/vault3.png');
        this.load.image('puzzle_ui', 'assets/puzzle_ui.png');
        this.load.image('life', 'assets/life.png');
        this.load.image('vault_dial', 'assets/dial.png');
        this.load.image('ok', 'assets/ok.png');
        this.load.image('wires', 'assets/wires.png');
        this.load.image('select_wire', 'assets/select_wire.png');
        this.load.image('turn_left', 'assets/turn_left.png');
        this.load.image('turn_right', 'assets/turn_right.png');
        this.load.image('cut', 'assets/cut.png');
        this.load.image('btn', 'assets/btn.png');
    }
    generateVault (position, type) {
        let vault = this.physics.add.sprite(600 + (position*400), 1280, 'vault1').setScale(0.5, 0.5).play("vault_close").setInteractive()
        vault.body.offset.x = 100;
        vault.type = type
        vault.graphics = {}
        const that = this;

        switch (vault.type) {
            case 1: {
                vault.info = []
                const directions = ["L", "R"]
                vault.solution = []
                for (let index = 0; index < Math.floor(Math.random() * (5 - 3 + 1)) + 3; index++) {
                    const value = Math.floor(Math.random() * (9 - 1 + 1)) + 1
                    const direction = directions[Math.floor(Math.random() * (1 - 0 + 1)) + 0]
                    vault.info[index] = `${value}${direction}`
                    if (direction == "L")
                        vault.solution.push(value*-1)
                    else 
                        vault.solution.push(value)
                }
                vault.openPuzzle = function (player, collider) {    
                    player.play("player_inbetween").once('animationcomplete', () => {
                        player.setVelocityX(0);
                        player.play("player_think");
                    });
                    vault.setVelocityX(0);
                    vault.answer = []
                    vault.dialPosition = 0
                    vault.lastDirection = 1
                    vault.graphics.puzzleUI = that.add.image(vault.x-400, 620, 'puzzle_ui').setScale(0.5, 0.5).setOrigin(0, 0);

                    vault.graphics.dial = that.add.image(vault.x-220, 950, 'vault_dial').setScale(0.5, 0.5).setOrigin(0.5,0.5);
                    
                    vault.solution.map((turn,index) => {
                        vault.graphics[`light_${index}`] = that.add.graphics();
                        vault.graphics[`light_${index}`].fillStyle("0x000000", 1.0)
                        vault.graphics[`light_${index}`].fillCircle(vault.x-330 + (50*index), 825, 20);
                    })

                    vault.graphics.okButton = that.add.image(vault.x-400 + 180, 1080, 'ok').setScale(0.5, 0.5).setInteractive();
                    vault.graphics.okButton.on('pointerdown', function (pointer) {
                        vault.answer.push(vault.dialPosition*vault.lastDirection)

                        if (vault.answer[vault.answer.length-1] != vault.solution[vault.answer.length-1]) {
                            vault.solution.map((turn,index) => {
                                vault.graphics[`light_${index}`].clear()
                                vault.graphics[`light_${index}`].fillStyle("0x000000", 1.0)
                                vault.graphics[`light_${index}`].fillCircle(vault.x-330 + (50*index), 825, 20);
                            })
                            that.events.emit('damageTaken')
                            vault.answer = []
                        } else {
                            vault.graphics[`light_${vault.answer.length-1}`].clear()
                            vault.graphics[`light_${vault.answer.length-1}`].fillStyle("0x00FF00", 1.0)
                            vault.graphics[`light_${vault.answer.length-1}`].fillCircle(vault.x-330 + (50*(vault.answer.length-1)), 825, 20);
                        }
                        if (vault.answer[vault.solution.length-1] && vault.answer[vault.solution.length-1] == vault.solution[vault.solution.length-1]) {
                            vault.play('vault_open')
                            that.events.emit('scoreUp', 3000)

                            Object.keys(vault.graphics).forEach(key => {
                                that.tweens.add({
                                    targets: vault.graphics[key],
                                    alpha: 0,
                                    y: vault.graphics[key].y-500,
                                    duration: 3000,
                                    ease: 'Power2'
                                }).on('complete', function(tween, targets){
                                    vault.graphics[key].destroy();
                                });
                            });
                            
                            that.player.play("player_inbetween").once('animationcomplete', () => {
                                that.player.setVelocityX(300)
                                that.player.play("player_run");
                            });
                        }
                    })

                    vault.graphics.leftButton = that.add.image(vault.x-400 + 110, 1080, 'turn_left').setScale(0.5, 0.5).setInteractive();
                    vault.graphics.leftButton.on('pointerdown', function (pointer) {
                        if (vault.dialPosition == 0) {
                            vault.dialPosition = 11
                            vault.lastDirection = -1
                        } else {
                            vault.dialPosition--
                        }
                        that.tweens.add({
                            targets: vault.graphics.dial,
                            rotation: vault.graphics.dial.rotation + 0.52,
                            duration: 50
                        })
                        
                        vault.lastDirection = -1
                    })

                    vault.graphics.rightButton = that.add.image(vault.x-400 + 250, 1080, 'turn_right').setScale(0.5, 0.5).setInteractive();
                    vault.graphics.rightButton.on('pointerdown', function (pointer) {
                        if (vault.dialPosition == 11) {
                            vault.dialPosition = 0
                            vault.lastDirection = 1
                        } else {
                            vault.dialPosition++
                        }
                        that.tweens.add({
                            targets: vault.graphics.dial,
                            rotation: vault.graphics.dial.rotation - 0.52,
                            duration: 50
                        })
                        vault.lastDirection = 1
                    })


                    vault.graphics.infoText = ""
                    vault.info.map((info) => {
                        vault.graphics.infoText += info+" "
                    })

                    vault.graphics.infoText = that.add.text(575 + (position*400), 660, `${vault.graphics.infoText}`, { fontSize: "21px", color: "#000000", fontFamily: "Arial", align: "left", wordWrap: { width: 200, useAdvancedWrap: true } });    
                    vault.graphics.infoText.angle = vault.graphics.infoText.angle + 15
                }
                break;
            }
            case 2: {
                vault.info = []
                const symbols = ["A", "B", "C", "D", "E", "F", "G", "H", "I"]
                vault.info = symbols.sort((a, b) => 0.5 - Math.random());
                vault.inputs = []
                while (vault.inputs.length < 5) {
                    let rdm = Math.floor(Math.random() * (symbols.length-1 - 0 + 1)) + 0
                    if (!vault.inputs.includes(symbols[rdm])) {
                        vault.inputs.push(symbols[rdm])
                    }
                }
                let inputsCopy = [...vault.inputs]
                vault.solution = inputsCopy.sort((a, b) => vault.info.indexOf(a) - vault.info.indexOf(b));
                vault.openPuzzle = function (player, collider) {
                    player.play("player_inbetween").once('animationcomplete', () => {
                        player.setVelocityX(0);
                        player.play("player_think");
                    });
                    vault.setVelocityX(0);
                    vault.answer = []

                    vault.graphics.puzzleUI = that.add.image(vault.x-400, 620, 'puzzle_ui').setScale(0.5, 0.5).setOrigin(0, 0);
                    
                    vault.inputs.map((input,index) => {
                        vault.graphics[`input_${index}`] = that.add.image(vault.x-250 + (60*index), 1020, 'btn').setScale(0.5, 0.5).setInteractive();
                        vault.graphics[`input_text_${index}`] = that.add.text(vault.x-255 + (60*index), 1010, input, { fontSize: "24px", color: "#FFFFFF", fontFamily: "Arial" })
                        vault.graphics[`input_${index}`].on('pointerdown', function (pointer) {
                            vault.answer.push(input)
                            if (vault.answer[vault.answer.length-1] != vault.solution[vault.answer.length-1]) {
                                that.events.emit('damageTaken')
                                vault.inputs.map((inputref,i) => {
                                    vault.graphics[`input_${i}`].y = 1020
                                    vault.graphics[`input_text_${i}`].y = 1010
                                })
                                vault.answer = []
                            } else {
                                vault.graphics[`input_${index}`].y = 1030
                                vault.graphics[`input_text_${index}`].y = 1020
                            }

                            if (vault.answer[vault.solution.length-1] && vault.answer[vault.solution.length-1] == vault.solution[vault.solution.length-1]) {
                                vault.play('vault_open')
                                that.events.emit('scoreUp', 3000)

                                Object.keys(vault.graphics).forEach(key => {
                                    that.tweens.add({
                                        targets: vault.graphics[key],
                                        alpha: 0,
                                        y: vault.graphics[key].y-500,
                                        duration: 3000,
                                        ease: 'Power2'
                                    }).on('complete', function(tween, targets){
                                        vault.graphics[key].destroy();
                                        console.log("destroyed")
                                    });
                                });
                                
                                that.player.play("player_inbetween").once('animationcomplete', () => {
                                    that.player.setVelocityX(300)
                                    that.player.play("player_run");
                                });
                            }
                        })
                    })

                    vault.graphics.infoText = ""
                    vault.info.map((info) => {
                        vault.graphics.infoText += info+" "
                    })

                    vault.graphics.infoText = that.add.text(575 + (position*400), 660, `Press in order of appearance: \n\n ${vault.graphics.infoText}`, { fontSize: "21px", color: "#000000", fontFamily: "Arial", align: "left", wordWrap: { width: 200, useAdvancedWrap: true } });    
                    vault.graphics.infoText.angle = vault.graphics.infoText.angle + 15
                }
                break;
            }
            case 3: {
                vault.info = []
                const wireTypes = ["R", "B", "G", "Y", "P", "O"]
                const colorCode = {"R": 0xFF0000, "B": 0x0000FF, "G": 0x008000, "Y": 0xFFFF00, "P": 0xA020F0, "O": 0xFF8000}
                const lightColor = wireTypes[Math.floor(Math.random() * (5 - 0 + 1)) + 0]
                let barcode = ""
                for (let index = 0; index < 10; index++) {
                    barcode += Math.floor(Math.random() * (9 - 1 + 1)) + 1
                }
                vault.info = [`Barcode Last digit odd -> Same color as light \n\n Barcode Last Digit even ->\n 2?->Blue\n 4?->Yellow\n 6?->Purple\n 8?->Red`]
                vault.lightColor = lightColor
                vault.barcode = barcode
                vault.inputs = wireTypes
                vault.solution = ""
                if (barcode.slice(-1) % 2 == 0) {
                    if (barcode.slice(-1) == "2") {
                        vault.solution = "B"
                    } else if (barcode.slice(-1) == "4") {
                        vault.solution = "Y"
                    } else if (barcode.slice(-1) == "6") {
                        vault.solution = "P"
                    } else if (barcode.slice(-1) == "8") {
                        vault.solution = "R"
                    }
                } else {
                    vault.solution = lightColor
                }
                vault.openPuzzle = function (player, collider) {
                    
                    player.play("player_inbetween").once('animationcomplete', () => {
                        player.setVelocityX(0);
                        player.play("player_think");
                    });
                    vault.setVelocityX(0);
                    vault.answer = null
                    vault.buttonPressed = []

                    vault.graphics.puzzleUI = that.add.image(vault.x-400, 620, 'puzzle_ui').setScale(0.5, 0.5).setOrigin(0, 0);
                    vault.graphics.light = that.add.graphics();
                    vault.graphics.light.fillStyle(colorCode[lightColor], 1.0)
                    vault.graphics.light.fillCircle(vault.x-320, 765, 20)
                    vault.graphics.barcode = that.add.graphics()
                    vault.graphics.barcode.fillStyle(0xFFFFFF, 1.0)
                    vault.graphics.barcode.lineStyle(5, 0x000000, 1.0);
                    vault.graphics.barcode.fillRect(vault.x-270, 720, 160, 60)
                    vault.graphics.barcode.strokeRect(vault.x-270, 740, 160, 60)
                    vault.graphics.barcodeText = that.add.text(vault.x-255, 755, barcode, { fontSize: "24px", color: "#000000", fontFamily: "Arial" })

                    vault.graphics.wireContainer = that.add.image(vault.x-110, 1050, 'wires').setScale(0.6, 0.6)

                    wireTypes.map((wire,index) => {
                        vault.graphics[`wire_select_${wire}`] = that.add.image(vault.x-250 + (index*60), 950, 'select_wire').setScale(0.5, 0.5).setInteractive()
                        vault.graphics[`wire_select_${wire}`].on('pointerdown', function (pointer) {
                            vault.answer = wire
                            wireTypes.map((wireref) => {
                                if (wireref != wire) {
                                    vault.graphics[`wire_select_${wireref}`].y = 950
                                } else {
                                    vault.graphics[`wire_select_${wire}`].y = 970
                                }
                            })
                            vault.graphics.cutButton = that.add.image(vault.x-110, 1100, 'cut').setScale(0.5, 0.5).setInteractive()
                            vault.graphics.cutButton.on('pointerdown', function (pointer) {
                                if (vault.answer != vault.solution) {
                                    that.events.emit('damageTaken')
                                    vault.answer = []
                                } else {
                                    vault.play('vault_open')
                                    that.events.emit('scoreUp', 1000)

                                    Object.keys(vault.graphics).forEach(key => {
                                        that.tweens.add({
                                            targets: vault.graphics[key],
                                            alpha: 0,
                                            y: vault.graphics[key].y-500,
                                            duration: 3000,
                                            ease: 'Power2'
                                        }).on('complete', function(tween, targets){
                                            vault.graphics[key].destroy();
                                            console.log("destroyed")
                                        });
                                    });
                                    
                                    that.player.play("player_inbetween").once('animationcomplete', () => {
                                        that.player.setVelocityX(300)
                                        that.player.play("player_run");
                                    });
                                }
                            })
                        })
                    })

                    vault.graphics.infoText = ""
                    vault.info.map((info) => {
                        vault.graphics.infoText += info+" "
                    })

                    vault.graphics.infoText = that.add.text(575 + (position*400), 665, `${vault.graphics.infoText}`, { fontSize: "21px", color: "#000000", fontFamily: "Arial", align: "left", wordWrap: { width: 220, useAdvancedWrap: true } });   
                    vault.graphics.infoText.angle = vault.graphics.infoText.angle + 15             
                }
                break;
            }
            case 4: {
                vault.info = []
                const operators = ["+", "-", "*"]
                vault.solution = []
                for (let index = 0; index < 6; index++) {
                    const firstDigit = Math.floor(Math.random() * (9 - 1 + 1)) + 1
                    const operator = operators[Math.floor(Math.random() * (2 - 0 + 1)) + 0]
                    const secondDigit = Math.floor(Math.random() * (firstDigit - 1 + 1)) + 1
                    vault.info[index] = `${firstDigit}${operator}${secondDigit}\n`
                    if (operator == "+")
                        vault.solution.push(firstDigit + secondDigit)
                    else if (operator == "-")
                        vault.solution.push(firstDigit - secondDigit)
                    else if (operator == "*")
                        vault.solution.push(firstDigit * secondDigit)
                }
                vault.inputs = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "ENTER"]
                vault.openPuzzle = function (player, collider) {
                    player.play("player_inbetween").once('animationcomplete', () => {
                        player.setVelocityX(0);
                        player.play("player_think");
                    });
                    vault.setVelocityX(0);
                    vault.answer = []
                    let currentDigit = 0

                    vault.graphics.puzzleUI = that.add.image(vault.x-400, 620, 'puzzle_ui').setScale(0.5, 0.5).setOrigin(0, 0);
                    
                    vault.solution.map((input,index) => {
                        vault.graphics[`input_${index}`] = that.add.graphics();
                        vault.graphics[`input_${index}`].fillStyle(0xFFFFFF, 1.0)
                        vault.graphics[`input_${index}`].lineStyle(5, 0x000000, 1.0)
                        vault.graphics[`input_${index}`].fillRect(vault.x-350, 790 + (60*index), 50, 50);
                        vault.graphics[`input_${index}`].strokeRect(vault.x-350, 790 + (60*index), 50, 50);
                        vault.graphics[`input_text_${index}`] = that.add.text(vault.x-342, 795 + (60*index), "__", { fontSize: "24px", color: "#000000", fontFamily: "Arial" })
                    })
                    vault.graphics.indicator = that.add.text(vault.x-295, 795 + (60*(vault.answer.length)), "<", { fontSize: "28px", color: "#000000", fontFamily: "Arial" })

                    vault.graphics[`key_7`] = that.add.image(vault.x-250, 1020, 'btn').setScale(0.5, 0.5).setInteractive();
                    vault.graphics[`key_text_7`] = that.add.text(vault.x-270, 1000, "7", { fontSize: "24px", color: "#FFFFFF", fontFamily: "Arial" })
                    vault.graphics[`key_7`].on('pointerdown', function (pointer) {
                        if (vault.graphics[`input_text_${currentDigit}`].text == "__") {
                            vault.graphics[`input_text_${currentDigit}`].text = ""
                            vault.answer[currentDigit] = ""
                        }
                        vault.answer[currentDigit] += "7"
                        vault.graphics[`input_text_${currentDigit}`].text += "7"
                    })

                    vault.graphics[`key_8`] = that.add.image(vault.x-200, 1020, 'btn').setScale(0.5, 0.5).setInteractive();
                    vault.graphics[`key_text_8`] = that.add.text(vault.x-220, 1000, "8", { fontSize: "24px", color: "#FFFFFF", fontFamily: "Arial" })
                    vault.graphics[`key_8`].on('pointerdown', function (pointer) {
                        if (vault.graphics[`input_text_${currentDigit}`].text == "__") {
                            vault.graphics[`input_text_${currentDigit}`].text = ""
                            vault.answer[currentDigit] = ""
                        }
                        vault.answer[currentDigit] += "8"
                        vault.graphics[`input_text_${currentDigit}`].text += "8"
                    })

                    vault.graphics[`key_9`] = that.add.image(vault.x-150, 1020, 'btn').setScale(0.5, 0.5).setInteractive();
                    vault.graphics[`key_text_9`] = that.add.text(vault.x-170, 1000, "9", { fontSize: "24px", color: "#FFFFFF", fontFamily: "Arial" })
                    vault.graphics[`key_9`].on('pointerdown', function (pointer) {
                        if (vault.graphics[`input_text_${currentDigit}`].text == "__") {
                            vault.graphics[`input_text_${currentDigit}`].text = ""
                            vault.answer[currentDigit] = ""
                        }
                        vault.answer[currentDigit] += "9"
                        vault.graphics[`input_text_${currentDigit}`].text += "9"
                    })

                    vault.graphics[`key_4`] = that.add.image(vault.x-250, 970, 'btn').setScale(0.5, 0.5).setInteractive();
                    vault.graphics[`key_text_4`] = that.add.text(vault.x-270, 950, "4", { fontSize: "24px", color: "#FFFFFF", fontFamily: "Arial" })
                    vault.graphics[`key_4`].on('pointerdown', function (pointer) {
                        if (vault.graphics[`input_text_${currentDigit}`].text == "__") {
                            vault.graphics[`input_text_${currentDigit}`].text = ""
                            vault.answer[currentDigit] = ""
                        }
                        vault.answer[currentDigit] += "4"
                        vault.graphics[`input_text_${currentDigit}`].text += "4"
                    })

                    vault.graphics[`key_5`] = that.add.image(vault.x-200, 970, 'btn').setScale(0.5, 0.5).setInteractive();
                    vault.graphics[`key_text_5`] = that.add.text(vault.x-220, 950, "5", { fontSize: "24px", color: "#FFFFFF", fontFamily: "Arial" })
                    vault.graphics[`key_5`].on('pointerdown', function (pointer) {
                        if (vault.graphics[`input_text_${currentDigit}`].text == "__") {
                            vault.graphics[`input_text_${currentDigit}`].text = ""
                            vault.answer[currentDigit] = ""
                        }
                        vault.answer[currentDigit] += "5"
                        vault.graphics[`input_text_${currentDigit}`].text += "5"
                    })

                    vault.graphics[`key_6`] = that.add.image(vault.x-150, 970, 'btn').setScale(0.5, 0.5).setInteractive();
                    vault.graphics[`key_text_6`] = that.add.text(vault.x-170, 950, "6", { fontSize: "24px", color: "#FFFFFF", fontFamily: "Arial" })
                    vault.graphics[`key_6`].on('pointerdown', function (pointer) {
                        if (vault.graphics[`input_text_${currentDigit}`].text == "__") {
                            vault.graphics[`input_text_${currentDigit}`].text = ""
                            vault.answer[currentDigit] = ""
                        }
                        vault.answer[currentDigit] += "6"
                        vault.graphics[`input_text_${currentDigit}`].text += "6"
                    })

                    vault.graphics[`key_1`] = that.add.image(vault.x-250, 920, 'btn').setScale(0.5, 0.5).setInteractive();
                    vault.graphics[`key_text_1`] = that.add.text(vault.x-270, 900, "1", { fontSize: "24px", color: "#FFFFFF", fontFamily: "Arial" })
                    vault.graphics[`key_1`].on('pointerdown', function (pointer) {
                        if (vault.graphics[`input_text_${currentDigit}`].text == "__") {
                            vault.graphics[`input_text_${currentDigit}`].text = ""
                            vault.answer[currentDigit] = ""
                        }
                        vault.answer[currentDigit] += "1"
                        vault.graphics[`input_text_${currentDigit}`].text += "1"
                    })

                    vault.graphics[`key_2`] = that.add.image(vault.x-200, 920, 'btn').setScale(0.5, 0.5).setInteractive();
                    vault.graphics[`key_text_2`] = that.add.text(vault.x-220, 900, "2", { fontSize: "24px", color: "#FFFFFF", fontFamily: "Arial" })
                    vault.graphics[`key_2`].on('pointerdown', function (pointer) {
                        if (vault.graphics[`input_text_${currentDigit}`].text == "__") {
                            vault.graphics[`input_text_${currentDigit}`].text = ""
                            vault.answer[currentDigit] = ""
                        }
                        vault.answer[currentDigit] += "2"
                        vault.graphics[`input_text_${currentDigit}`].text += "2"
                    })

                    vault.graphics[`key_3`] = that.add.image(vault.x-150, 920, 'btn').setScale(0.5, 0.5).setInteractive();
                    vault.graphics[`key_text_3`] = that.add.text(vault.x-170, 900, "3", { fontSize: "24px", color: "#FFFFFF", fontFamily: "Arial" })
                    vault.graphics[`key_3`].on('pointerdown', function (pointer) {
                        if (vault.graphics[`input_text_${currentDigit}`].text == "__") {
                            vault.graphics[`input_text_${currentDigit}`].text = ""
                            vault.answer[currentDigit] = ""
                        }
                        vault.answer[currentDigit] += "3"
                        vault.graphics[`input_text_${currentDigit}`].text += "3"
                    })

                    vault.graphics[`key_0`] = that.add.image(vault.x-200, 1070, 'btn').setScale(0.5, 0.5).setInteractive();
                    vault.graphics[`key_text_0`] = that.add.text(vault.x-220, 1050, "0", { fontSize: "24px", color: "#FFFFFF", fontFamily: "Arial" })
                    vault.graphics[`key_0`].on('pointerdown', function (pointer) {
                        if (vault.graphics[`input_text_${currentDigit}`].text == "__") {
                            vault.graphics[`input_text_${currentDigit}`].text = ""
                            vault.answer[currentDigit] = ""
                        }
                        vault.answer[currentDigit] += "0"
                        vault.graphics[`input_text_${currentDigit}`].text += "0"
                    })

                    vault.graphics[`key_DEL`] = that.add.image(vault.x-150, 1070, 'btn').setScale(0.5, 0.5).setInteractive();
                    vault.graphics[`key_text_DEL`] = that.add.text(vault.x-170, 1050, "DEL", { fontSize: "22px", color: "#FFFFFF", fontFamily: "Arial" })
                    vault.graphics[`key_DEL`].on('pointerdown', function (pointer) {
                        vault.answer[currentDigit] = ""
                        vault.graphics[`input_text_${currentDigit}`].text = ""
                    })

                    vault.graphics[`key_OK`] = that.add.image(vault.x-250, 1070, 'btn').setScale(0.5, 0.5).setInteractive();
                    vault.graphics[`key_text_OK`] = that.add.text(vault.x-270, 1050, "OK", { fontSize: "22px", color: "#FFFFFF", fontFamily: "Arial" })
                    vault.graphics[`key_OK`].on('pointerdown', function (pointer) {
                        if (vault.solution[currentDigit] != vault.answer[currentDigit]) {
                            that.events.emit('damageTaken')
                            vault.answer[currentDigit] = ""
                            vault.graphics[`input_text_${currentDigit}`].text = ""
                        } else {
                            currentDigit++
                            vault.graphics.indicator.y = 795 + (60*(currentDigit))
                        }

                        if (vault.answer[vault.solution.length-1] && vault.answer[vault.solution.length-1] == vault.solution[vault.solution.length-1]) {
                            vault.play('vault_open')
                            that.events.emit('scoreUp', 2000)

                            Object.keys(vault.graphics).forEach(key => {
                                that.tweens.add({
                                    targets: vault.graphics[key],
                                    alpha: 0,
                                    y: vault.graphics[key].y-500,
                                    duration: 3000,
                                    ease: 'Power2'
                                }).on('complete', function(tween, targets){
                                    vault.graphics[key].destroy();
                                    console.log("destroyed")
                                });
                            });
                            
                            that.player.play("player_inbetween").once('animationcomplete', () => {
                                that.player.setVelocityX(300)
                                that.player.play("player_run");
                            });
                        }

                    })



                    vault.graphics.infoText = ""
                    vault.info.map((info) => {
                        vault.graphics.infoText += info+" "
                    })

                    vault.graphics.infoText = that.add.text(575 + (position*400), 660, `${vault.graphics.infoText}`, { fontSize: "22px", color: "#000000", fontFamily: "Arial", align: "left", wordWrap: { width: 200, useAdvancedWrap: true } });
                    vault.graphics.infoText.angle = vault.graphics.infoText.angle + 15
                }

                break; 
            }
            default: {
                vault.info = []
                const direction = ["L", "R"]
                for (let index = 0; index < Math.floor(Math.random() * (5 - 3 + 1)) + 3; index++) {
                    vault.info[index] = `${Math.floor(Math.random() * (9 - 1 + 1)) + 1}${direction[Math.floor(Math.random() * (1 - 0 + 1)) + 0]}`
                }
                vault.inputs = ["<", "ENTER", ">"]
                vault.solution = vault.info
             break;
            }
        }
        return vault
    }
    async create () {
        this.cameras.main.fadeIn(1000, 0, 0, 0)
        this.cameras.main.setBounds(0, 0, 640, 1136);
        this.anims.create({
            key: 'bg_anim',
            frames: [
                { key: 'bg1' },
                { key: 'bg2' },
                { key: 'bg3' }
            ],
            frameRate: 5,
            repeat: -1
        });

        // PLAYER ANIMATIONS

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
            key: 'player_inbetween',
            frames: [
                { key: 'player_inbetween' }
            ],
            frameRate: 20,
            repeat: 1
        });

        this.anims.create({
            key: 'player_run',
            frames: [
                { key: 'player_run_1' },
                { key: 'player_run_2' },
                { key: 'player_run_3' },
                { key: 'player_run_4' }
            ],
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'player_land',
            frames: [
                { key: 'player_land_1' },
                { key: 'player_land_2' }
            ],
            frameRate: 5,
            repeat: 1
        });

        this.anims.create({
            key: 'player_think',
            frames: [
                { key: 'player_think_1' },
                { key: 'player_think_2' },
                { key: 'player_think_3' }
            ],
            frameRate: 5,
            repeat: -1
        });

        // VAULT ANIMATION

        this.anims.create({
            key: 'vault_open',
            frames: [
                { key: 'vault_open1' },
                { key: 'vault_open2' },
                { key: 'vault_open3' }
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
    
		let image = this.add.sprite(0, 300, 'bg1').setOrigin(0, 0).play("bg_anim");
		let scaleX = this.cameras.main.width / image.width
		let scaleY = this.cameras.main.height / image.height
		let scale = Math.max(scaleX, scaleY)
		image.setScale(scale)
        this.cameras.main.setBounds(0, 0, image.displayWidth), 
        this.vaults = []
        
        this.vaults.push(this.generateVault(0, Math.floor(Math.random() * (4 - 1 + 1)) + 1)) 
        this.vaults.push(this.generateVault(1, Math.floor(Math.random() * (4 - 1 + 1)) + 1))
        this.vaults.push(this.generateVault(2, Math.floor(Math.random() * (4 - 1 + 1)) + 1))

        this.player = this.physics.add.sprite(130, 900, 'player_run_2').setScale(0.5, 0.5)
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setFollowOffset(0, 450);
        this.cursors = this.input.keyboard.createCursorKeys();

        const that = this;
        await Promise.all(this.vaults.map((vault) => {
            let collider = this.physics.add.collider(this.player, vault, ((playerRef, vaultRef) => {
                console.log("open puzzle")
                collider.destroy()
                vault.openPuzzle(this.player, collider)
            }))
        }))

        this.tweens.add({
            targets: this.player,
            y: this.player.y + 400,
            x: this.player.x + 80,
            duration: 500,
            ease: 'Power2'
        }, this).on('complete', async function(tween, targets){
            that.player.play("player_land")
            await that.timeout(1000)
            if (that.scene.isSleeping('UIScene')) {
                that.scene.wake('UIScene');
            } else {
                that.scene.launch('UIScene');
            }
            that.player.setVelocityX(300);
            that.player.play("player_run");
        });
    }

    timeout (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    async update (time) {
        if (this.player.x >= 1800 && this.player.x <= 1810) {
            this.player.finishedLevel = true;
            this.events.emit('stopTimer')
        }
        if (this.player.finishedLevel == true) {
            this.player.x = 1799;
            this.player.finishedLevel = false;
            this.player.setVelocityX(0);
            this.player.play("player_inbetween").once('animationcomplete', () => {
                this.player.play("player_idle");
            });
            
            
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.cameras.main.once(
                Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                () => {
                    // this.scene.restart();
                    this.scene.switch("ResultScene");
                    this.scene.sleep("UIScene");
                })
        }
    }

}

export default GameScene;