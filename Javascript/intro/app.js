var editor;

window.onload = function load() {
	editor = CodeMirror.fromTextArea(document.getElementById('TextAreaEditor'), {
		lineNumbers: true,
		mode: 'javascript'
	});

	editor.on("focus", function () {
		game.paused = true;
	});
	editor.on("blur", function () {

		localStorage.setItem("introcode", editor.getValue());

		game.paused = false;
		game.reset();
	});

	var code = localStorage.getItem("introcode");
	if (code === null) {
		code = '// De naam van het ruimteschip is speler\n// De naam van de meteoor is meteoor\n// Er bestaat een functie schietLaser\n\n// Controleer of pijltjes zijn ingedrukt\nif (cursors.up.isDown) {\n}\nif (cursors.down.isDown) {\n}\nif (cursors.left.isDown) {\n}\nif (cursors.right.isDown) {\n}\n\n// Controleer of spatie is gedrukt\nif (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {\n}';
	}

	editor.setValue(code);
	startGame();
}