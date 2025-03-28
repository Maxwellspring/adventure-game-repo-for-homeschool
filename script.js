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
        pixelRatio: 3,
        background: '#fafafa',
        wireframeBackground: '#222',
        hasBounds: true,
        enabled: true,
        wireframes: true,
        showSleeping: true,
        showDebug: true,
        showBroadphase: true,
        showBounds: true,
        showVelocity: true,
        showCollisions: true,
        showSeparations: true,
        showAxes: true,
        showPositions: true,
        showAngleIndicator: true,
        showIds: true,
        showShadows: true,
        showVertexNumbers: true,
        showConvexHulls: true,
        showInternalEdges: true,
        showMousePosition: false
    }
});



// create two boxes and a ground
function dynamicBox(X, Y, W, H) {
    const DynamicBox = Bodies.rectangle(X, Y, W, H);
    return DynamicBox
}
const boxA = Bodies.rectangle(400, 200, 80, 80, { inertia: Infinity, inverseInertia: 0 });
const boxB = Bodies.rectangle(450, 50, 90, 80);
const boxC = dynamicBox(100, 100, 100, 100)
const boxD = dynamicBox(100, 400, 100, 100)
const player = Bodies.rectangle(600, 0, 100, 200, { inertia: Infinity, inverseInertia: 0 })
const ground = Bodies.rectangle(400, 700, 10000, 1, { isStatic: true });
const mouseBox = Bodies.rectangle(0, 0, 10, 10);

// add all of the bodies to the world
// do NOT directly add a dynamicBox() element to this, it is UNSTABLE
Composite.add(engine.world, [boxA, boxB, boxC, boxD, ground, player]);

const mouse = Mouse.create(render.canvas)

const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        render: {
            visible:true
        }
    }
});

Composite.add(engine.world, mouseConstraint);

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

document.addEventListener("keydown", function(event) {
    let input = event.key
    console.log(input);
    Matter.Body.rotate(boxB, 0.2)
    let upwardsVector = Matter.Vector.create(0, -10)
    Matter.Body.setVelocity(boxC, upwardsVector)


    Matter.Body.setVelocity(boxA, vector(4, 0))
    moveRight()
    // we need to use the player and get keyboard inputs
})

document.addEventListener("keydown", function(event) {
    let input = event.key
    switch (input) {
        case "w":
            Matter.Body.setVelocity(player, vector(-10, 0));
        case "d":
            Matter.Body.setVelocity(player, vector(5, 0));
        case "a":
            Matter.Body.setVelocity(player, vector(-5, 0));
    }
})
