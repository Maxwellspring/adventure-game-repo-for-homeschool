let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

// window.addEventListener("resize", function(event) {
//     let newWidth = window.innerWidth
//     let newHeight = window.innerHeight

//     console.log(window.innerWidth + ' wide by ' + window.innerHeight +' high');
//     windowWidth = newWidth
//     windowHeight = newHeight
//     render.canvas.width = windowWidth; console.log("change")
//     return [windowWidth, windowHeight]
// })

// module aliases
const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint;

// create an engine
const engine = Engine.create();

// create a renderer
let render = Render.create({
    element: document.body,
    engine: engine,
    // VVVVV configures what you see in the game engine
    options: {
        width: windowWidth,
        height: windowHeight,
        pixelRatio: 2,
        background: '#fafafa',
        wireframeBackground: '#222',
        enabled: true,
        hasBounds: true,
        wireframes: false,
        showShadows: true,
        showSleeping: true,
        showBroadphase: true,
        showConvexHulls: true,
        showInternalEdges: true,
        showMousePosition: false,
        // debug stuff VVV
        showIds: false, // important
        showAxes: false, // important
        showDebug: false, // important
        showBounds: false, // important
        showVelocity: false, // important
        showPositions: false, // important
        showCollisions: false, // important
        showSeparations: false, // important
        showVertexNumbers: false, // important
        showAngleIndicator: false, // important
    }
});

// **Important:** Disable image smoothing here, after the renderer is created.
render.context.imageSmoothingEnabled = false;
//For older browsers that use vendor prefixes.
render.context.mozImageSmoothingEnabled = false;
render.context.webkitImageSmoothingEnabled = false;
render.context.msImageSmoothingEnabled = false;

// create two boxes and a ground
function dynamicBox(X, Y, W, H) {
    const DynamicBox = Bodies.rectangle(X, Y, W, H);
    return DynamicBox
}


const boxA = Bodies.rectangle(400, 200, 80, 80, { inertia: Infinity, inverseInertia: 0 });
const boxB = Bodies.rectangle(450, 50, 90, 80);
const boxC = dynamicBox(100, 100, 100, 100)
const boxD = dynamicBox(100, 400, 100, 100)

const player = Bodies.rectangle(600, 0, 100, 200, {
    inertia: Infinity, inverseInertia: 0,
    render: {
        sprite: {
            texture: "guy-standingT.png",
            xScale: -5,
            yScale: 5
        }
    },
    friction: 0.5,
    frictionStatic: 0,
})

const ground = Bodies.rectangle(400, 700, 10000, 1, {
    isStatic: true,
    render: {
        fillStyle: 'red' // Set the fill color to red
    }
});

const jumpTrigger = Bodies.rectangle(600, 100, 80, 10, {
    inertia: Infinity, inverseInertia: 0,
    render: {
        fillStyle: 'cyan'
    },
    friction: 0.5,
    frictionStatic: 0,
    isSensor: true,
})

const mouseBox = Bodies.rectangle(0, 0, 10, 10);

function compAddWorld(thing) {
    Composite.add(engine.world, thing)
}

let constructedPlayer = Matter.Body.create({
    parts: [jumpTrigger, player]
})

compAddWorld(constructedPlayer)

compAddWorld([boxA, boxB, boxC, boxD, ground])

const mouse = Mouse.create(render.canvas)

const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        render: {
            visible: true
        }
    }
});

compAddWorld(mouseConstraint)

// run the renderer
Render.run(render);

render.mouse = mouse;
// create runner
const runner = Runner.create();

// run the engine
Runner.run(runner, engine);

let cameraX = 500; // Start at the left edge

function moveScreen(x) {
    let bounds = render.bounds;
    // Calculate the new bounds based on cameraX
    bounds.min.x = x - (render.canvas.width / 6);
    bounds.max.x = x + (render.canvas.width / 6);
}

// Example: Move the screen to the right
function moveRight() {
    cameraX += 10; // Move 10 pixels to the right
    moveScreen(cameraX);
}

// Example: Move the screen to the left
function moveLeft() {
    cameraX -= 10; // Move 10 pixels to the left
    moveScreen(cameraX);
}

function vector(x, y) {
    let createdVector = Matter.Vector.create(x, y)
    return createdVector
}

// holds the current inputs
let inputKeysArray = []

// add an input key to the array, if it is already in it, dont add any more
document.addEventListener("keydown", function (event) {
    let input = String(event.key)
    if (!inputKeysArray.includes(input)) {
        console.log("IT DONT HAVE IT")
        inputKeysArray.push(input);
        return inputKeysArray
    }

});

// removes an input key from the array, figures out what button leave and removes
// only that button
document.addEventListener("keyup", function (event) {
    let input = String(event.key)
    let removedItemIndex = inputKeysArray.indexOf(input);
    if (removedItemIndex != -1) {
        inputKeysArray.splice(removedItemIndex, 1)
    }
    return inputKeysArray
})

let isOnGround = false

// detect if there is a thing to jump on
Matter.Events.on(engine, 'collisionActive', function(event) {
    let thing = event.pairs.length
    if (thing > 4) {
        console.log("collision!")
        isOnGround = true

    } else {
        console.log("no collison")
        isOnGround = false
    }
    console.log(thing)
    return isOnGround
})

// this is what does the input for player movement
function doInput() {
    console.log(inputKeysArray)
    let playerVX = constructedPlayer.velocity.x
    let playerVY = constructedPlayer.velocity.y
    switch (true) {
        case inputKeysArray.includes('w'):
            if (isOnGround == true) {
                Matter.Body.setVelocity(constructedPlayer, vector(playerVX, -8));
                constructedPlayer.render.sprite.xScale = -5;
            }
            break;
        case inputKeysArray.includes('d'):
            Matter.Body.setVelocity(constructedPlayer, vector(5, playerVY));
            constructedPlayer.render.sprite.yScale = -5;
            break;
        case inputKeysArray.includes('a'):
            Matter.Body.setVelocity(constructedPlayer, vector(-5, playerVY));
            constructedPlayer.render.sprite.yScale = 5;
            constructedPlayer.render.sprite.xScale = 5;
            break;
        case inputKeysArray.includes('s'):
            Matter.Body.setVelocity(constructedPlayer, vector(playerVX, playerVY +1));
            constructedPlayer.render.sprite.xScale = -5;
            break;
    }
}

// this simply constantly cakks the playermovement function
setInterval(doInput, 10)

// construct an output based off of what is in the input keys array, if it has
// for example "a" then add the velocity that handles the "a" input.