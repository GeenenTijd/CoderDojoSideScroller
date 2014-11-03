Meteoor = function (index, game, player) {

	var x = Math.random() * (game.world.width * 0.5) + game.world.width;
	var y = game.world.randomY;

	this.game = game;
	this.player = player;
	this.alive = true;

	function randomImage() {
		var rand = Math.random() * 4;
		if (rand == 1) {
			return 'meteoor1';
		} else if (rand == 2) {
			return 'meteoor2';
		} else if (rand == 3) {
			return 'meteoor3';
		} else {
			return 'meteoor4';
		}
	}

	this.meteoor = game.add.sprite(x, y, randomImage());
	this.meteoor.anchor.set(0.5);
	this.meteoor.name = index.toString();

	game.physics.enable(this.meteoor, Phaser.Physics.ARCADE);
	this.meteoor.body.immovable = true;

};

Meteoor.prototype.damage = function () {
	this.meteoor.x = this.game.width;
	return true;
};

Meteoor.prototype.update = function () {

	this.meteoor.x -= 5;
	if (this.meteoor.x < -50) {
		this.meteoor.x = this.game.width;
	}

};

var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'SpaceGame', {
	preload: preload,
	create: create,
	update: update
});

function preload() {
	game.load.image('spaceship', 'assets/spaceship.png');
	game.load.image('laser', 'assets/laserBlauw.png');

	game.load.image('meteoor1', 'assets/meteoor1.png');
	game.load.image('meteoor2', 'assets/meteoor2.png');
	game.load.image('meteoor3', 'assets/meteoor3.png');
	game.load.image('meteoor4', 'assets/meteoor4.png');

	game.load.spritesheet('explosie', 'assets/explosie.png', 64, 64, 16);
}

var spaceship;
var meteoren = [];
var explosies;
var lasers;
var fireRate = 150;
var nextFire = 0;
var cursors;

function create() {

	//  Maak spaceship
	spaceship = game.add.sprite(50, game.height * 0.5, 'spaceship');
	spaceship.anchor.setTo(0.5, 0.5);

	//  Maak meteoren
	for (var i = 0; i < 20; ++i) {
		meteoren.push(new Meteoor(i, game, spaceship));
	}

	//  Maak lasers
	lasers = game.add.group();
	lasers.enableBody = true;
	lasers.physicsBodyType = Phaser.Physics.ARCADE;
	lasers.createMultiple(30, 'laser', 0, false);
	lasers.setAll('anchor.x', 0.5);
	lasers.setAll('anchor.y', 0.5);
	lasers.setAll('outOfBoundsKill', true);
	lasers.setAll('checkWorldBounds', true);

	//  Maak explosies
	explosions = game.add.group();
	for (var i = 0; i < 10; i++) {
		var explosionAnimation = explosions.create(0, 0, 'explosie', [0], false);
		explosionAnimation.anchor.setTo(0.5, 0.5);
		explosionAnimation.animations.add('explosie');
	}

	// Toon spaceship bovenaan
	spaceship.bringToTop();

	// Gebruik toetsenbord knoppen
	cursors = game.input.keyboard.createCursorKeys();
}

function update() {

	// Update meteoren	
	for (var i = 0; i < meteoren.length; i++) {

		if (meteoren[i].alive) {

			meteoren[i].update();

			game.physics.arcade.collide(spaceship, meteoren[i].meteoor, meteoorHitPlayer, null, this);
			game.physics.arcade.overlap(lasers, meteoren[i].meteoor, bulletHitEnemy, null, this);
		}
	}

	// Controleer of pijltjes zijn ingedrukt
	if (cursors.up.isDown) {
		spaceship.y -= 5;
	} else if (cursors.down.isDown) {
		spaceship.y += 5;
	}

	// Controleer of spatie is gedrukt
	if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
		schiet();
	}

}

function meteoorHitPlayer(meteoor, spaceship) {

	var destroyed = meteoren[meteoor.name].damage();
	if (destroyed) {
		var explosionAnimation = explosions.getFirstExists(false);
		explosionAnimation.reset(meteoor.x, meteoor.y);
		explosionAnimation.play('explosie', 30, false, true);
	}

	// TODO GAMEOVER

}

function bulletHitEnemy(meteoor, laser) {

	laser.kill();

	var destroyed = meteoren[meteoor.name].damage();
	if (destroyed) {
		var explosionAnimation = explosions.getFirstExists(false);
		explosionAnimation.reset(meteoor.x, meteoor.y);
		explosionAnimation.play('explosie', 30, false, true);
	}
}

function schiet() {

	if (game.time.now > nextFire && lasers.countDead() > 0) {
		nextFire = game.time.now + fireRate;

		var laser = lasers.getFirstExists(false);

		laser.reset(spaceship.x, spaceship.y);
		laser.rotation = spaceship.rotation;

		game.physics.arcade.velocityFromRotation(spaceship.rotation, 400, laser.body.velocity);
	}

}