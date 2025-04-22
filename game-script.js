let centerScreenW = visualViewport.width / 2
let centerScreenH = visualViewport.height / 2

var config = {
    type: Phaser.AUTO,
    width: visualViewport.width,
    height: visualViewport.height,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    render: {
        pixelArt: true
    }
};

var game = new Phaser.Game(config);

function preload() {
    this.load.image("background", "background-ig.png")
    this.load.image("floor", "floor-ig.png")
    this.load.image("guy", "guy-standingT.png")
}

function create() {
    this.add.image(centerScreenW, centerScreenH, "background").setScale(5.1, 3.4);

    let ground = this.physics.add.staticGroup();

    ground.create(400, 560, "floor").setScale(6, 2).refreshBody();
    ground.create(600, 400, "floor").setScale(5, 2).refreshBody();
    ground.create(100, visualViewport.height, "floor").setScale(20, 2).refreshBody();


    this.player = this.physics.add.sprite(400, 400, "guy").setScale(2);
    this.player.setBounce(0.2)
    this.player.setCollideWorldBounds(true)
    this.physics.add.collider(this.player, ground)
}




function update() {
    let cursors = this.input.keyboard.createCursorKeys();

    if (cursors.left.isDown) {
        this.player.setVelocityX(-160);
        this.player.scaleX = -2
        this.player.body.setOffset(20, 0)
    }
    else if (cursors.right.isDown) {
        this.player.setVelocityX(160);
        this.player.scaleX = 2
        this.player.body.setOffset(0, 0)

    }
    else {
        this.player.setVelocityX(0);

    }

    if (cursors.up.isDown && this.player.body.touching.down) {
        this.player.setVelocityY(-400);
    }
}