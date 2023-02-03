const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, 70 + i));
};

const fightAreaMap = [];
for (let i = 0; i < fightArea.length; i += 70) {
  fightAreaMap.push(fightArea.slice(i, 70 + i));
}

const borders = [];

const offset = {
  x: -2660,
  y: -1900
};

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 210)
    borders.push(
      new Collision({
        position: {
          x: j * Collision.width + offset.x,
          y: i * Collision.height + offset.y
        }
      })
    )
  });
});

fightAreaSectors = [];

fightAreaMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 210)
    fightAreaSectors.push(
      new Collision({
        position: {
          x: j * Collision.width + offset.x,
          y: i * Collision.height + offset.y
        }
      })
    )
  });
});

const image = new Image();
image.src = './img/FriendFray.png';

const playerDown = new Image();
playerDown.src = './img/FrontFace.png';

const playerUp = new Image();
playerUp.src = './img/BackFace.png';

const playerLeft = new Image();
playerLeft.src = './img/LeftFace.png';

const playerRight = new Image();
playerRight.src = './img/RightFace.png';

const player = new Character({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2,
  },
  image: playerDown,
  movements: {
    max: 4
  },
  frames:{
    up: playerUp,
    down: playerDown,
    left: playerLeft,
    right: playerRight
  }
});

const background = new Character({
  position: {
    x: offset.x,
    y: offset.y
  },
  image: image
});

const keys = {
  w: {
    pressed: false
  },
  a: {
    pressed: false
  },
  s: {
    pressed: false
  },
  d: {
    pressed: false
  }
};

const motion = [ background, ...borders, ...fightAreaSectors ];

const rectangularCollision = ({ rectangle1, rectangle2 }) => {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y<= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  )
};

const fight = {
  started: false
}

const animate = () => {
  const animationId = window.requestAnimationFrame(animate);
  background.draw();
  borders.forEach(confines => {
    confines.draw();
  });
  fightAreaSectors.forEach(fightArea => {
    fightArea.draw();
  })
  player.draw();

  let inMotion = true;
  player.inMotion = false;

  if (fight.started) return;

  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < fightAreaSectors.length; i++) {
      const fightSector = fightAreaSectors[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: fightSector
        })
      )  {
        window.cancelAnimationFrame(animationId);
        fight.started = true;
        gsap.to("#overlappingDiv", {
          opacity: 1,
          repeat: 3,
          yoyo: true,
          duration: 0.1,
          onComplete() {
            gsap.to("#overlappingDiv", {
              opacity: 1,
              duration: 0.1,
              onComplete() {
                animateFight()
                gsap.to("#overlappingDiv", {
                  opacity: 0,
                  duration: 0.1
                })
              }
            })
          }
        });
        break;
      }
    };
  };

  if (keys.w.pressed && lastPressed === 'w') {
    player.inMotion = true;
    player.image = player.frames.up;

    for (let i = 0; i < borders.length; i++) {
      const confines = borders[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {...confines, position: {
            x: confines.position.x,
            y: confines.position.y + 5
          }}
        })
      )  {
        inMotion = false
        break;
      }
    };

    if (inMotion) {
      motion.forEach((movable) => {
        movable.position.y += 5
      });
    }
  } else if (keys.s.pressed && lastPressed === 's') {
    player.inMotion = true
    player.image = player.frames.down;

    for (let i = 0; i < borders.length; i++) {
      const confines = borders[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {...confines, position: {
            x: confines.position.x,
            y: confines.position.y - 5
          }}
        })
      )  {
        inMotion = false
        break;
      }

    }
    if (inMotion) {
      motion.forEach((movable) => {
        movable.position.y -= 5
      });
    }
  } else if (keys.a.pressed && lastPressed === 'a') {
    player.inMotion = true;
    player.image = player.frames.left;

    for (let i = 0; i < borders.length; i++) {
      const confines = borders[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {...confines, position: {
            x: confines.position.x + 5,
            y: confines.position.y
          }}
        })
      )  {
        inMotion = false
        break;
      }

    }
    if (inMotion) {
      motion.forEach((movable) => {
        movable.position.x += 5
      });
    }
  } else if (keys.d.pressed && lastPressed === 'd') {
    player.inMotion = true;
    player.image = player.frames.right;

    for (let i = 0; i < borders.length; i++) {
      const confines = borders[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {...confines, position: {
            x: confines.position.x - 5,
            y: confines.position.y
          }}
        })
      )  {
        inMotion = false
        break;
      }

    }
    if (inMotion) {
      motion.forEach((movable) => {
        movable.position.x -= 5
      });
    }
  }
};

animate();

let fightBackgroundImage = new Image();
fightBackgroundImage.src = './img/FightBackground.png';
const fightBackground = new Character({
  position: {
    x: 0,
    y: 0
  },
  image: fightBackgroundImage
});

const animateFight = () => {
  window.requestAnimationFrame(animateFight);
  fightBackground.draw();
}

let lastPressed = ''
window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = true;
      lastPressed = 'w';
      break;
    case 'a':
      keys.a.pressed = true;
      lastPressed = 'a';
      break;
    case 's':
      keys.s.pressed = true;
      lastPressed = 's';
      break;
    case 'd':
      keys.d.pressed = true;
      lastPressed = 'd';
      break;
  }
});

window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
    case 's':
      keys.s.pressed = false;
      break;
    case 'd':
      keys.d.pressed = false;
      break;
  }
});
