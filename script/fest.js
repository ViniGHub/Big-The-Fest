const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

document.querySelector("canvas").append("<h1>Big, The Fest</h1>")

canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;

const ground = new Image(200, 200);
ground.src = "./images/ground.png"
// https://opengameart.org/art-search-advanced?keys=&field_art_type_tid%5B%5D=9&sort_by=count&sort_order=DESC
const cabin = {
    img: new Image(),
    x: 700,
    y: 0,
    width: 150,
    height: 150,
    src: "./images/OldWoodCabin.png"
}
cabin.img.src = cabin.src

let backgroundPattern;
ground.onload = () => {
    backgroundPattern = ctx.createPattern(ground, 'repeat');
}

let item = {
    x: 150,
    y: 150,
    size: 20,
    color: "green",
    active: true
};

let roof = {
    x: 50,
    y: 0,
    width: 600,
    height: 200,
    color: "grey",
}

function drawItem() {
    if (item.active) {
        ctx.fillStyle = item.color;
        ctx.fillRect(item.x, item.y, item.size, item.size);
    }

    checkItemCollision();
}

function checkItemCollision() {
    if (item.active &&
        player.x < item.x + item.size &&
        player.x + player.size > item.x &&
        player.y < item.y + item.size &&
        player.y + player.size > item.y) {
        // Item collision detected
        player.color = "blue"; // Change player color
        item.active = false; // Deactivate the item
    }
}

const player = {
    img: new Image(),
    src: "./images/personagens/big-parado-direita.png",
    x: 50,
    y: 50,
    width: 48,
    height: 90,
    side: "right",
    mode: "parado",
    velocity: 3,
    movementy: 0,
    movementx: 0
};
player.img.src = player.src

//build a square
const walls = [
    {
        x: 300,
        y: 300,
        width: 100,
        height: 30,
        color: "black",
    },
    {
        x: 370,
        y: 330,
        width: 30,
        height: 100,
        color: "black",
    },
    {
        x: 200,
        y: 200,
        width: 30,
        height: 100,
        color: "black",
    },
    {
        x: 200,
        y: 200,
        width: 100,
        height: 30,
        color: "black",
    },
    {
        x: 0,
        y: canvas.height - 30,
        width: canvas.width,
        height: 30,
        color: "grey",
    }
]


let lastMouseEvent = null;
document.addEventListener('mousemove', (e) => {
    lastMouseEvent = e;
});
function drawPlayer() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    // if (backgroundPattern) {
    //     ctx.fillStyle = backgroundPattern;
    //     ctx.fillRect(0, 0, canvas.width, canvas.height);
    // }

    // Draw cabin on canvas
    ctx.drawImage(cabin.img, cabin.x, cabin.y, cabin.width, cabin.height);
    isCollidingWall({ ...cabin })

    
    // Get mouse position
    // const rect = canvas.getBoundingClientRect();
    // const mouseX = lastMouseEvent ? lastMouseEvent.clientX - rect.left : player.x;
    // const mouseY = lastMouseEvent ? lastMouseEvent.clientY - rect.top : player.y;

    // Calculate angle between player and mouse
    // const dx = mouseX - (player.x + player.width / 2);
    // const dy = mouseY - (player.y + player.height / 2);

    // Set player side based on angle
    // if (Math.abs(dx) > Math.abs(dy)) {
    //     player.side = dx > 0 ? "right" : "left";
    // } else {
    //     player.side = dy > 0 ? "down" : "up";
    // }
    // ctx.fillStyle = player.color;

    isCollingCanvas();
    for (let wall of walls)
        isCollidingWall(wall);

    player.x += player.movementx;
    player.y += player.movementy;

    // Draw main player square
    // ctx.fillStyle = player.color;
    // ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.drawImage(player.img, player.x, player.y, player.width, player.height);

    // Draw direction indicator
    switch (player.side) {
        case "right":
            player.img.src = `./images/personagens/big-${player.mode}-direita.png`
            break;
        case "left":
            player.img.src = `./images/personagens/big-${player.mode}-esquerda.png`
            break;
    }

    // Draw roof
    ctx.fillStyle = roof.color
    ctx.fillRect(roof.x, roof.y, roof.width, roof.height);

}

function drawWalls() {
    for (let wall of walls) {
        ctx.fillStyle = wall.color;
        ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    }
}

function isCollingCanvas() {
    if (player.x + player.size > canvas.width) {
        player.movementx = 0;
        player.x = canvas.width - player.size;
        return true;
    } else if (player.x < 0) {
        player.movementx = 0;
        player.x = 0;
        return true;
    }
    if (player.y + player.size > canvas.height) {
        player.movementy = 0;
        player.y = canvas.height - player.size;
        return true;
    } else if (player.y < 0) {
        player.movementy = 0;
        player.y = 0;
        return true;
    }

    return false;
}

function isCollidingWall(wall, obj) {
    if (obj) {
        if (obj.x < wall.x + wall.width &&
            obj.x + obj.size > wall.x &&
            obj.y < wall.y + wall.height &&
            obj.y + obj.size > wall.y) {
            if (obj.x >= wall.x + wall.width - 5) {
                obj.x = wall.x + wall.width;
                return 1
            } else if (obj.x + obj.size <= wall.x + 5) {
                obj.x = wall.x - obj.size;
                return 2
            } else if (obj.y >= wall.y + wall.height - 5) {
                obj.y = wall.y + wall.height;
                return 3
            } else if (obj.y + obj.size <= wall.y + 5) {
                obj.y = wall.y - obj.size;
                return 4
            }
        }

        return 0;
    } else if (player.x < wall.x + wall.width &&
        player.x + player.width > wall.x &&
        player.y < wall.y + wall.height &&
        player.y + player.height > wall.y) {
        if (player.x >= wall.x + wall.width - 5) {
            player.x = wall.x + wall.width;
            return 1
        } else if (player.x + player.width <= wall.x + 5) {
            player.x = wall.x - player.width;
            return 2
        } else if (player.y >= wall.y + wall.height - 5) {
            player.y = wall.y + wall.height;
            return 3
        } else if (player.y + player.height <= wall.y + 5) {
            player.y = wall.y - player.height;
            return 4
        }
    }

    return 0;

}


// Keyboard controls
document.addEventListener("keydown", function (event) {
    switch (event.key) {
        case "w":
        case "ArrowUp":
            if (player.y > 0 && walls.some(wall => !isCollidingWall(wall))) player.movementy = -player.velocity; player.mode = "andando";
            player.side = "up";
            break;
        case "s":
        case "ArrowDown":
            if (player.y + player.height < canvas.height && walls.some(wall => !isCollidingWall(wall))) player.movementy = player.velocity; player.mode = "andando";
            player.side = "down";
            break;
        case "a":
        case "ArrowLeft":
            if (player.x > 0 && walls.some(wall => !isCollidingWall(wall))) player.movementx = -player.velocity; player.mode = "andando";
            player.side = "left";
            break;
        case "d":
        case "ArrowRight":
            if (player.x + player.width < canvas.width && walls.some(wall => !isCollidingWall(wall))) player.movementx = player.velocity; player.mode = "andando";
            player.side = "right";
            break;
    }
});

document.addEventListener("keyup", function (event) {
    switch (event.key) {
        case "w":
        case "ArrowUp":
            if (player.movementy < 0) player.movementy = 0; player.mode = "parado"
            break;
        case "s":
        case "ArrowDown":
            if (player.movementy > 0) player.movementy = 0; player.mode = "parado"
            break;
        case "a":
        case "ArrowLeft":
            if (player.movementx < 0) player.movementx = 0; player.mode = "parado"
            break;
        case "d":
        case "ArrowRight":
            if (player.movementx > 0) player.movementx = 0; player.mode = "parado"
            break;

    }
});

document.addEventListener("click", function (event) {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    const radius = 5;

    const ball = {
        x: player.side === "left" ? player.x : player.side === "right" ? player.x + player.size : player.side === "up" ? player.x + player.size / 2 : player.side === "down" ? player.x + player.size / 2 : 0,
        y: player.side === "up" ? player.y : player.side === "down" ? player.y + player.size : player.side === "left" ? player.y + player.size / 2 : player.side === "right" ? player.y + player.size / 2 : 0,
        radius: radius,
        size: radius * 2,
        speed: 5,
        direction: player.side
    };

    const projectiles = [];
    projectiles.push(ball);

    function moveBall() {
        projectiles.forEach((ball, index) => {
            switch (ball.direction) {
                case "up": ball.y -= ball.speed; break;
                case "down": ball.y += ball.speed; break;
                case "left": ball.x -= ball.speed; break;
                case "right": ball.x += ball.speed; break;
            }

            // Remove ball if it goes off screen
            if (ball.x < 0 || ball.x > canvas.width ||
                ball.y < 0 || ball.y > canvas.height) {
                projectiles.splice(index, 1);
                return;
            }

            if (walls.some(wall => isCollidingWall(wall, ball))) {
                projectiles.splice(index, 1);
                return;
            }

            if (isCollidingWall(cabin, ball)) {
                projectiles.splice(index, 1);
                return;
            }

            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fillStyle = "red";
            ctx.fill();
            ctx.closePath();
        });
    }

    // Add moveBall to gameLoop function
    const oldGameLoop = gameLoop;
    gameLoop = function () {
        oldGameLoop();
        moveBall();
    };
});

// loop to keep the game running
function gameLoop() {
    drawPlayer();
    drawWalls();
    drawItem();
    requestAnimationFrame(gameLoop);
}

gameLoop();