var game;

function startGame() {
	game = new Phaser.Game(window.innerWidth * 0.5, window.innerHeight, Phaser.AUTO, 'SpaceGame', {
		preload: preload,
		create: create,
		update: update
	});

	function preload() {
		game.load.image('spaceship', 'assets/spaceship.png');
		game.load.image('laser', 'assets/laserBlauw.png');
		game.load.image('meteoor', 'assets/meteoor.png');
		game.load.spritesheet('explosie', 'assets/explosie.png', 64, 64, 16);
	}

	var speler;
	var meteoor;
	var explosies;
	var lasers;
	var cursors;

	game.reset = function reset() {
		speler.reset(200, game.height * 0.5);
		meteoor.reset(Math.random() * (game.world.width * 0.5) + (game.world.width * 0.5), game.world.randomY);
	}

	function create() {

		//  Maak spaceship
		speler = game.add.sprite(200, game.height * 0.5, 'spaceship');
		speler.anchor.setTo(0.5, 0.5);
		speler.fireRate = 150;
		speler.nextFire = 0;

		createMeteoor();
		createLasers();
		createExplosies();

		// Toon spaceship bovenaan
		speler.bringToTop();

		// Gebruik toetsenbord knoppen
		cursors = game.input.keyboard.createCursorKeys();
	}

	function createLasers() {
		lasers = game.add.group();
		lasers.enableBody = true;
		lasers.physicsBodyType = Phaser.Physics.ARCADE;
		lasers.createMultiple(30, 'laser', 0, false);
		lasers.setAll('anchor.x', 0.5);
		lasers.setAll('anchor.y', 0.5);
		lasers.setAll('outOfBoundsKill', true);
		lasers.setAll('checkWorldBounds', true);
	}

	function createMeteoor() {
		var x = Math.random() * (game.world.width * 0.5) + (game.world.width * 0.5);
		var y = game.world.randomY;

		meteoor = game.add.sprite(x, y, 'meteoor');
		meteoor.anchor.set(0.5);

		game.physics.enable(meteoor, Phaser.Physics.ARCADE);
		meteoor.body.immovable = true;

		meteoor.respawn = function respawn() {
			meteoor.reset(Math.random() * (game.world.width * 0.5) + (game.world.width * 0.5), game.world.randomY);
		};
	}

	function createExplosies() {
		explosies = game.add.group();
		for (var i = 0; i < 10; i++) {
			var explosionAnimation = explosies.create(0, 0, 'explosie', [0], false);
			explosionAnimation.anchor.setTo(0.5, 0.5);
			explosionAnimation.animations.add('explosie');
		}
	}

	function update() {

		game.physics.arcade.collide(speler, meteoor, meteoorRaakSpeler, null, this);
		game.physics.arcade.overlap(lasers, meteoor, laserRaakMeteoor, null, this);

		var code = editor.getValue();

		try {
			eval(code);
		} catch (err) {
			console.log(err);
		}
	}

	function meteoorRaakSpeler(meteoor, spaceship) {
		var explosionAnimation = explosies.getFirstExists(false);
		explosionAnimation.reset(meteoor.x, meteoor.y);
		explosionAnimation.play('explosie', 30, false, true);

		meteoor.respawn();
	}

	function laserRaakMeteoor(meteoor, laser) {
		laser.kill();

		var explosionAnimation = explosies.getFirstExists(false);
		explosionAnimation.reset(meteoor.x, meteoor.y);
		explosionAnimation.play('explosie', 30, false, true);

		meteoor.respawn();
	}

	function schietLaser() {

		if (game.time.now > speler.nextFire && lasers.countDead() > 0) {
			speler.nextFire = game.time.now + speler.fireRate;
			var laser = lasers.getFirstExists(false);
			laser.reset(speler.x, speler.y);
			laser.rotation = speler.rotation;
			game.physics.arcade.velocityFromRotation(speler.rotation, 500, laser.body.velocity);
		}

	}
};