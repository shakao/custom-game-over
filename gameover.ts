
namespace game {
    let baseDialogFrame = img`
            1 1 1
            f f f
            1 1 1
            `;
    let gameOverDialogWinFrame: Image = baseDialogFrame.clone();
    let gameOverDialogLoseFrame: Image = baseDialogFrame.clone();

    let gameOverWinText = "YOU WIN!"
    let gameOverLoseText = "GAME OVER!"

    class CustomGameOverDialog extends game.BaseDialog {
        protected cursorOn: boolean;
        protected isNewHighScore: boolean;

        constructor(
            protected win: boolean,
            protected score?: number,
            protected highScore?: number
        ) {
            super(screen.width, 64, win ? gameOverDialogWinFrame : gameOverDialogLoseFrame);
            this.cursorOn = false;
            this.isNewHighScore = this.score > this.highScore;
        }

        displayCursor() {
            this.cursorOn = true;
        }

        update() {
            this.clearInterior();
            this.drawTextCore();

            if (this.cursorOn) {
                this.drawCursorRow();
            }
        }

        drawTextCore() {
            const topMargin = 0;
            const titleHeight = 8 + topMargin;
            this.image.printCenter(
                this.win ? gameOverWinText : gameOverLoseText,
                titleHeight,
                this.win ? 15 : 1,
                image.font8
            );

            if (this.score !== undefined) {
                const scoreHeight = 23 + topMargin;
                const highScoreHeight = 34 + topMargin;
                const scoreColor =  screen.isMono ? 1 : 2;

                this.image.printCenter(
                    "Score:" + this.score,
                    scoreHeight,
                    scoreColor,
                    image.font8
                );

                if (this.isNewHighScore) {
                    this.image.printCenter(
                        "New High Score!",
                        highScoreHeight,
                        scoreColor,
                        image.font5
                    );
                } else {
                    this.image.printCenter(
                        "HI" + this.highScore,
                        highScoreHeight,
                        scoreColor,
                        image.font8
                    );
                }
            }
        }
    }



    //% blockId=game_over_dialog_set_frame group="Dialogs"
    //% block="set game over win color to $color=colorindexpicker border $border=colorindexpicker"
    export function setGameOverDialogWinColor(color: number, border: number = 15) {
        gameOverDialogWinFrame = baseDialogFrame.clone();
        gameOverDialogWinFrame.replace(1, 0);
        gameOverDialogWinFrame.replace(15, color);
        gameOverDialogWinFrame.replace(0, 15);
    }

    //% blockId=game_over_dialog_set_win_text group="Dialogs"
    //% block="set game over win text to $text"
    //% text.defl="WIN GAME!"
    export function setGameOverDialogWinText(text: string) {
        gameOverWinText = text;
    }

    //% blockId=game_over_dialog_set_lose_text group="Dialogs"
    //% block="set game over lose text to $text"
    //% text.defl="OH NO :("
    export function setGameOverDialogLoseText(text: string) {
        gameOverLoseText = text;
    }

    export function customGameOver() {
        game.onGameOver((win: boolean) => {
            // collect the scores before poping the scenes
            const scoreInfo = info.player1.getState();
            const highScore = info.highScore();
            if (scoreInfo.score > highScore)
                info.saveHighScore();

            pushScene();
            scene.setBackgroundImage(screen.clone());

            if (win)
                music.jumpUp.play();
            else
                music.wawawawaa.play();

            let effect = win ? winEffect : loseEffect;
            effect.startScreenEffect();

            pause(400);

            const overDialog = new CustomGameOverDialog(win, scoreInfo.score, highScore);
            scene.createRenderable(scene.HUD_Z, target => {
                overDialog.update();
                target.drawTransparentImage(
                    overDialog.image,
                    0,
                    (screen.height - overDialog.image.height) >> 1
                );
            });

            pause(500); // wait for users to stop pressing keys
            overDialog.displayCursor();
            waitAnyButton();
            control.reset();
        })
    }
}

game.customGameOver();