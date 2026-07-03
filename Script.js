// =====================================
// ZOMBIE CHASE SURVIVAL - ULTIMATE
// PART 3A
// =====================================

// Canvas

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// =====================================
// HUD
// =====================================

const healthEl = document.getElementById("health");
const scoreEl = document.getElementById("score");
const coinsEl = document.getElementById("coins");
const waveEl = document.getElementById("wave");
const weaponEl = document.getElementById("weaponLevel");
const highScoreEl = document.getElementById("highScore");

// =====================================
// SCREENS
// =====================================

const startScreen =
document.getElementById("startScreen");

const pauseScreen =
document.getElementById("pauseScreen");

const gameOverScreen =
document.getElementById("gameOverScreen");

const finalScoreEl =
document.getElementById("finalScore");

const finalHighScoreEl =
document.getElementById("finalHighScore");

// =====================================
// BUTTONS
// =====================================

const startBtn =
document.getElementById("startBtn");

const restartBtn =
document.getElementById("restartBtn");

const pauseBtn =
document.getElementById("pauseBtn");

const resumeBtn =
document.getElementById("resumeBtn");

const shopBtn =
document.getElementById("shopBtn");

const shootBtn =
document.getElementById("shootBtn");

const upgradeWeaponBtn =
document.getElementById("upgradeWeaponBtn");

const healBtn =
document.getElementById("healBtn");

// =====================================
// GAME DATA
// =====================================

let gameRunning = false;
let paused = false;

let score = 0;
let coins = 0;
let wave = 1;

let highScore =
localStorage.getItem("highScore") || 0;

highScoreEl.textContent = highScore;

// =====================================
// PLAYER
// =====================================

const player = {

    x: 400,
    y: 300,

    radius: 20,

    speed: 5,

    health: 100,

    weaponLevel: 1

};

// =====================================
// ARRAYS
// =====================================

let zombies = [];
let bullets = [];
let coinDrops = [];

// =====================================
// CONTROLS
// =====================================

const keys = {};

window.addEventListener("keydown", (e) => {

    keys[e.key.toLowerCase()] = true;

});

window.addEventListener("keyup", (e) => {

    keys[e.key.toLowerCase()] = false;

});

// =====================================
// MOBILE CONTROLS
// =====================================

function mobileMove(id, key){

    const btn =
    document.getElementById(id);

    btn.addEventListener("touchstart",(e)=>{

        e.preventDefault();
        keys[key] = true;

    });

    btn.addEventListener("touchend",(e)=>{

        e.preventDefault();
        keys[key] = false;

    });

}

mobileMove("upBtn","w");
mobileMove("downBtn","s");
mobileMove("leftBtn","a");
mobileMove("rightBtn","d");

// =====================================
// PLAYER MOVEMENT
// =====================================

function movePlayer(){

    if(keys["w"])
        player.y -= player.speed;

    if(keys["s"])
        player.y += player.speed;

    if(keys["a"])
        player.x -= player.speed;

    if(keys["d"])
        player.x += player.speed;

    if(player.x < player.radius)
        player.x = player.radius;

    if(player.y < player.radius)
        player.y = player.radius;

    if(player.x >
       canvas.width - player.radius)
       player.x =
       canvas.width - player.radius;

    if(player.y >
       canvas.height - player.radius)
       player.y =
       canvas.height - player.radius;

}

// =====================================
// BULLETS
// =====================================

function shootBullet(){

    bullets.push({

        x: player.x,
        y: player.y,

        radius: 5,

        speed: 10,

        dx: 0,
        dy: -1

    });

}

window.addEventListener("click", ()=>{

    if(gameRunning && !paused){

        shootBullet();

    }

});

shootBtn.addEventListener("click",()=>{

    if(gameRunning && !paused){

        shootBullet();

    }

});

// =====================================
// UPDATE BULLETS
// =====================================

function updateBullets(){

    for(let i=bullets.length-1;i>=0;i--){

        const b = bullets[i];

        b.x += b.dx * b.speed;
        b.y += b.dy * b.speed;

        if(
            b.x < 0 ||
            b.x > canvas.width ||
            b.y < 0 ||
            b.y > canvas.height
        ){

            bullets.splice(i,1);

        }

    }

}

// =====================================
// DRAW BULLETS
// =====================================

function drawBullets(){

    bullets.forEach((bullet)=>{

        ctx.beginPath();

        ctx.arc(
            bullet.x,
            bullet.y,
            bullet.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "yellow";
        ctx.fill();

    });

}

// =====================================
// ZOMBIE SPAWNER
// =====================================

function spawnZombie(){

    let side =
    Math.floor(Math.random()*4);

    let x;
    let y;

    if(side === 0){

        x = 0;
        y = Math.random() *
        canvas.height;

    }

    if(side === 1){

        x = canvas.width;
        y = Math.random() *
        canvas.height;

    }

    if(side === 2){

        x = Math.random() *
        canvas.width;

        y = 0;

    }

    if(side === 3){

        x = Math.random() *
        canvas.width;

        y = canvas.height;

    }

    zombies.push({

        x,
        y,

        radius:18,

        speed:
        1 +
        (wave * 0.15),

        health:
        1 +
        Math.floor(wave / 3)

    });

}// =====================================
// PART 3B
// ZOMBIE AI + COLLISIONS + WAVES
// =====================================

// Draw Player

function drawPlayer(){

    ctx.beginPath();

    ctx.arc(
        player.x,
        player.y,
        player.radius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#00ff66";
    ctx.fill();

}

// =====================================
// DRAW ZOMBIES
// =====================================

function drawZombies(){

    zombies.forEach((zombie)=>{

        ctx.beginPath();

        ctx.arc(
            zombie.x,
            zombie.y,
            zombie.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "#ff3131";
        ctx.fill();

    });

}

// =====================================
// UPDATE ZOMBIES
// =====================================

function updateZombies(){

    zombies.forEach((zombie)=>{

        let dx =
        player.x - zombie.x;

        let dy =
        player.y - zombie.y;

        let distance =
        Math.sqrt(dx*dx + dy*dy);

        zombie.x +=
        (dx/distance) * zombie.speed;

        zombie.y +=
        (dy/distance) * zombie.speed;

        // Damage Player

        if(
            distance <
            player.radius +
            zombie.radius
        ){

            player.health -= 0.15;

            if(player.health < 0){

                player.health = 0;

            }

        }

    });

}

// =====================================
// BULLET VS ZOMBIE
// =====================================

function bulletCollisions(){

    for(
        let i = zombies.length - 1;
        i >= 0;
        i--
    ){

        let zombie =
        zombies[i];

        for(
            let j = bullets.length - 1;
            j >= 0;
            j--
        ){

            let bullet =
            bullets[j];

            let dx =
            zombie.x - bullet.x;

            let dy =
            zombie.y - bullet.y;

            let dist =
            Math.sqrt(dx*dx + dy*dy);

            if(
                dist <
                zombie.radius +
                bullet.radius
            ){

                zombie.health--;

                bullets.splice(j,1);

                if(
                    zombie.health <= 0
                ){

                    // Score

                    score += 10;

                    // Coins

                    coins +=
                    Math.floor(
                        Math.random()*3
                    ) + 1;

                    // Coin Drop

                    coinDrops.push({

                        x:zombie.x,
                        y:zombie.y,

                        radius:8,

                        collected:false

                    });

                    zombies.splice(i,1);

                }

                break;
            }

        }

    }

}

// =====================================
// DRAW COINS
// =====================================

function drawCoins(){

    coinDrops.forEach((coin)=>{

        if(!coin.collected){

            ctx.beginPath();

            ctx.arc(
                coin.x,
                coin.y,
                coin.radius,
                0,
                Math.PI*2
            );

            ctx.fillStyle =
            "gold";

            ctx.fill();

        }

    });

}

// =====================================
// COLLECT COINS
// =====================================

function collectCoins(){

    coinDrops.forEach((coin)=>{

        let dx =
        player.x - coin.x;

        let dy =
        player.y - coin.y;

        let distance =
        Math.sqrt(dx*dx + dy*dy);

        if(
            distance <
            player.radius +
            coin.radius &&
            !coin.collected
        ){

            coin.collected =
            true;

            coins += 5;

        }

    });

}

// =====================================
// SCORE + HUD
// =====================================

function updateHUD(){

    healthEl.textContent =
    Math.floor(player.health);

    scoreEl.textContent =
    score;

    coinsEl.textContent =
    coins;

    waveEl.textContent =
    wave;

    weaponEl.textContent =
    player.weaponLevel;

}

// =====================================
// HIGH SCORE SAVE
// =====================================

function updateHighScore(){

    if(score > highScore){

        highScore = score;

        localStorage.setItem(
            "highScore",
            highScore
        );

        highScoreEl.textContent =
        highScore;

    }

}

// =====================================
// WAVE SYSTEM
// =====================================

function updateWave(){

    if(score >= wave * 100){

        wave++;

        for(
            let i=0;
            i < wave + 2;
            i++
        ){

            spawnZombie();

        }

    }

}

// =====================================
// BACKGROUND GRID
// =====================================

function drawBackground(){

    ctx.fillStyle =
    "#171717";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.strokeStyle =
    "#222";

    for(
        let x=0;
        x<canvas.width;
        x+=50
    ){

        ctx.beginPath();

        ctx.moveTo(x,0);

        ctx.lineTo(
            x,
            canvas.height
        );

        ctx.stroke();

    }

    for(
        let y=0;
        y<canvas.height;
        y+=50
    ){

        ctx.beginPath();

        ctx.moveTo(0,y);

        ctx.lineTo(
            canvas.width,
            y
        );

        ctx.stroke();

    }

}

// =====================================
// GAME OVER
// =====================================

function gameOver(){

    gameRunning = false;

    finalScoreEl.textContent =
    score;

    finalHighScoreEl.textContent =
    highScore;

    gameOverScreen.style.display =
    "flex";

}// =====================================
// PART 3C
// GAME LOOP + SHOP + PAUSE + RESTART
// =====================================

// Shop

const shop =
document.getElementById("shop");

// =====================================
// UPGRADE WEAPON
// =====================================

upgradeWeaponBtn.addEventListener(
    "click",
    () => {

        let cost =
        player.weaponLevel * 50;

        if(coins >= cost){

            coins -= cost;

            player.weaponLevel++;

            updateHUD();

            alert(
                "Weapon upgraded to Level "
                + player.weaponLevel
            );

        }else{

            alert(
                "Not enough coins!"
            );

        }

    }
);

// =====================================
// HEAL PLAYER
// =====================================

healBtn.addEventListener(
    "click",
    () => {

        if(coins >= 20){

            coins -= 20;

            player.health += 20;

            if(player.health > 100){

                player.health = 100;

            }

            updateHUD();

        }else{

            alert(
                "Need 20 coins!"
            );

        }

    }
);

// =====================================
// SHOP TOGGLE
// =====================================

shopBtn.addEventListener(
    "click",
    () => {

        if(
            shop.style.display ===
            "block"
        ){

            shop.style.display =
            "none";

        }else{

            shop.style.display =
            "block";

        }

    }
);

// =====================================
// PAUSE
// =====================================

pauseBtn.addEventListener(
    "click",
    () => {

        paused = true;

        pauseScreen.style.display =
        "flex";

    }
);

resumeBtn.addEventListener(
    "click",
    () => {

        paused = false;

        pauseScreen.style.display =
        "none";

        animate();

    }
);

// =====================================
// START GAME
// =====================================

function startGame(){

    zombies = [];
    bullets = [];
    coinDrops = [];

    score = 0;
    coins = 0;
    wave = 1;

    player.health = 100;
    player.weaponLevel = 1;

    player.x =
    canvas.width / 2;

    player.y =
    canvas.height / 2;

    paused = false;
    gameRunning = true;

    startScreen.style.display =
    "none";

    gameOverScreen.style.display =
    "none";

    shop.style.display =
    "none";

    updateHUD();

    animate();

}

// =====================================
// RESTART
// =====================================

restartBtn.addEventListener(
    "click",
    startGame
);

startBtn.addEventListener(
    "click",
    startGame
);

// =====================================
// SHOOTING POWER
// =====================================

function shootBullet(){

    let bulletsToFire =
    player.weaponLevel;

    for(
        let i=0;
        i<bulletsToFire;
        i++
    ){

        bullets.push({

            x: player.x,

            y: player.y,

            radius: 5,

            speed: 10,

            dx:
            (Math.random()-0.5)
            * 0.3,

            dy: -1

        });

    }

}

// =====================================
// SPAWN ZOMBIES
// =====================================

setInterval(() => {

    if(
        gameRunning &&
        !paused
    ){

        spawnZombie();

    }

}, 1500);

// =====================================
// MAIN GAME LOOP
// =====================================

function animate(){

    if(
        !gameRunning ||
        paused
    ){
        return;
    }

    requestAnimationFrame(
        animate
    );

    drawBackground();

    movePlayer();

    updateBullets();

    updateZombies();

    bulletCollisions();

    collectCoins();

    updateWave();

    updateHUD();

    updateHighScore();

    drawCoins();

    drawBullets();

    drawPlayer();

    drawZombies();

    if(
        player.health <= 0
    ){

        gameOver();

    }

}

// =====================================
// INITIAL HUD
// =====================================

updateHUD();

highScoreEl.textContent =
highScore;

// =====================================
// STARTER ZOMBIES
// =====================================

for(let i=0;i<5;i++){

    spawnZombie();

}
