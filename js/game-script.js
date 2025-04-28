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
            // overlapBias: 99,
            debug: false
        },

    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    render: {
        pixelArt: true
    },
    fps: { target: 60, forceSetTimeOut: true }
};

var game = new Phaser.Game(config);

// =====================================================================
function preload() {
    this.load.image("background", "../media/background-ig.png")
    this.load.image("floor", "../media/floor-ig.png")
    this.load.image("guy", "../media/guy-standingT.png")
    this.load.image("button", "../media/button-ig.png")
    this.load.image("scientist", "../media/scientist-standing-new.png")
    this.load.image("alert", "../media/Alert!.png")


}
// =====================================================================

// =====================================================================
function create() {
    this.add.image(centerScreenW, centerScreenH, "background").setScale(5.1, 3.4);

    let ground = this.physics.add.staticGroup();

    ground.create(400, 560, "floor").setScale(6, 2).refreshBody();
    ground.create(600, 400, "floor").setScale(5, 2).refreshBody();
    ground.create(100, visualViewport.height, "floor").setScale(20, 2).refreshBody();
    this.player = this.physics.add.sprite(200, 400, "guy").setScale(2).setBounce(0.2).setCollideWorldBounds(true);
    this.scientist = this.physics.add.sprite(300, 400, "scientist").setScale(2).setBounce(0.2).setCollideWorldBounds(true).setDrag(100, 0);
    this.scientistTalkTrigger = this.physics.add.sprite(100, 100, null).setScale(3, 2).setBounce(0.2).setCollideWorldBounds(true).setDrag(0, 999).setGravityY(0).setVisible(false);
    this.physics.add.collider(this.player, ground);
    this.physics.add.collider(this.scientist, ground)
    this.alert = this.physics.add.sprite(this.scientist.x, this.scientist.y + -50, "alert").setScale(4).setDrag(0, 999).setGravityY(0).setVisible(false);

    let testt = this.physics.add.group({
        key: 'floor',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });



    this.physics.add.collider(testt, ground);
    this.physics.add.overlap(this.player, testt, collectStar, null, this);

    testt.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    function collectStar(player, star) {
        star.disableBody(true, true);
    }

    let buttonReset = this.add.image(100, 100, "button").setScale(3, 4).setInteractive();
    buttonReset.on('pointerdown', () => {
        console.log("Button clicked!");
        this.scene.restart()
    });

}
// =====================================================================
// let distanceToScientist = false;

// =====================================================================
function update() {

    this.scientistTalkTrigger.x = this.scientist.x;
    this.scientistTalkTrigger.y = this.scientist.y;

    this.alert.x = this.scientist.x;
    this.alert.y = this.scientist.y - 58;



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

    let playerToScientist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.scientist.x, this.scientist.y)

    console.log("--------------------playerToScientist: " + playerToScientist + "--------------------");

    if (playerToScientist < 50) {
        console.log("within range of scientist" + playerToScientist);
        this.alert.setVisible(true);
        if (cursors.down.isDown) {
            console.log("PRESSSSSSSSSSSSSSSSSSSSSSSS")
        }
    } else {
        console.log("not within range of scientist" + playerToScientist);
        this.alert.setVisible(false);
    }

}