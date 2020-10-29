// Add your code here
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    game.over(false, effects.blizzard)
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    game.over(true, effects.smiles)
})
scene.setBackgroundColor(11)
info.setScore(20)
game.setGameOverDialogLoseText("OH NO :(")
game.setGameOverDialogWinText("YOU WIN!")
game.setGameOverDialogWinColor(1, 15)
