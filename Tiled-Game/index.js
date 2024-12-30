const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
let currentLevel = "home";

canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.95;

const Username = localStorage.getItem("UserName");

const images = {
  home: loadImage("../Tiled-Game-Asset/Home/HomeTown.png"),
  shop: loadImage("../Tiled-Game-Asset/Shop/Supermarket.png"),
  transparentPNG: loadImage("../Tiled-Game-Asset/nothing.png"),
  shopForeground: loadImage(
    "../Tiled-Game-Asset/Shop/ShopforegroundObjects.png"
  ),
  homeForeground: loadImage(
    "../Tiled-Game-Asset/Home/HomeforegroundObjects.png"
  ),
  player: {
    down: loadImage("../Tiled-Game-Asset/Sprites/playerDown.png"),
    up: loadImage("../Tiled-Game-Asset/Sprites/playerUp.png"),
    left: loadImage("../Tiled-Game-Asset/Sprites/playerLeft.png"),
    right: loadImage("../Tiled-Game-Asset/Sprites/playerRight.png"),
  },
};

function loadImage(src) {
  const img = new Image();
  img.src = src;
  return img;
}

let Userscore;
let collisionMap, sceneMap, characterMap, scale;
let boundaries, characters, scenes, movables, renderables;
let offset, background, foreground;

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2,
  },
  image: images.player.down,
  frames: {
    max: 4,
    hold: 10,
  },
  sprites: {
    up: images.player.up,
    left: images.player.left,
    right: images.player.right,
    down: images.player.down,
  },
});

const levels = {
  home: {
    init: () => {
      resetLevelState();

      populateMap(Homecollisions, collisionsMap, 93);
      populateMap(HomescenesChange, scenesMap, 93);
      populateMap(HomecharactersMapData, charactersMap, 93);

      const offset = { x: -350, y: -400 };
      scale = 3;

      initializeBoundaries(collisionsMap, offset, [3256, 2684357816], scale);
      initializeCharacters(charactersMap, offset, {
        3256: {
          image: images.transparentPNG,
          frames: { max: 4, hold: 60 },
          scale: 3,
          animate: true,
          hasAnswered: false,
          dialogue: [
            "...",
            "<h3>Hmmm. Wow!!! This must be one of the brand new electric vehicles. It looks awesome. Can I touch it? I am afraid I might get electrocuted because it's an electric vehicle.</h3>",
            "<h3>I didn’t get electrocuted. Let’s open the vehicle and check it out further.</h3>",
            `<h3>Identify the correct standard for preventing electric shock:</h3>`,
            `<div class=\"container\"><div class=\"grid\">
              <div class=\"option\" onclick=\"selectOption(this)\">1. Use of barriers and enclosures</div>
              <div class=\"option\" onclick=\"selectOption(this)\">2. Insulation on all exposed parts</div>
              <div class=\"option\" onclick=\"selectOption(this)\">3. Secure connection of conductive parts to the electric chassis</div>
              <div class=\"option\" onclick=\"selectOption(this)\">4. All of the above</div>
            </div><div class=\"submit-bar\">
              <button class=\"submit-button\" onclick=\"submitAnswer('4. All of the above',3256)\">Submit</button>
            </div></div>`,
          ],
        },
        2272: {
          image: images.transparentPNG,
          frames: { max: 4, hold: 60 },
          scale: 3,
          hasAnswered: false,
          dialogue: [
            "...",
            "<h3>Time to analyze the road markings. Let’s see if they meet the standards.</h3>",
            "<h3>This seems to be a Type-2 paint.</h3>",
            `<h3>Considering this is a city road, which type of paint should be used to meet the standards?</h3>`,
            `<div class=\"container\"><div class=\"grid\">
              <div class=\"option\" onclick=\"selectOption(this)\">1. Type-1: Light-duty paint.</div>
              <div class=\"option\" onclick=\"selectOption(this)\">2. Type-2: Heavy-duty paint.</div>
              <div class=\"option\" onclick=\"selectOption(this)\">3. Either Type-1 or Type-2 can be used.</div>
              <div class=\"option\" onclick=\"selectOption(this)\">4. No specific type is required.</div>
            </div><div class=\"submit-bar\">
              <button class=\"submit-button\" onclick=\"submitAnswer('2. Type-2: Heavy-duty paint.',2272)\">Submit</button>
            </div></div>`,
          ],
        },
        1989: {
          image: images.transparentPNG,
          frames: { max: 4, hold: 60 },
          scale: 3,
          hasAnswered: false,
          dialogue: [
            "...",
            "<h3>Good…now let’s have a look at the wires. Hmmm.</h3>",
            "<h3>Standards: Yes. Especially wires….as they are an important part of the electric vehicle.</h3>",
            "<h3>High Voltage components have specific markings such as a yellow background with a black arrow.</h3>",
            `<h3>Which marking standard applies to High Voltage components?</h3>`,
            `<div class=\"container\"><div class=\"grid\">
              <div class=\"option\" onclick=\"selectOption(this)\">1. Grey background with a red arrow.</div>
              <div class=\"option\" onclick=\"selectOption(this)\">2. Yellow background with a black arrow.</div>
              <div class=\"option\" onclick=\"selectOption(this)\">3. Blue background with a white arrow.</div>
              <div class=\"option\" onclick=\"selectOption(this)\">4. No markings are required.</div>
            </div><div class=\"submit-bar\">
              <button class=\"submit-button\" onclick=\"submitAnswer('2. Yellow background with a black arrow.', 4001)\">Submit</button>
            </div></div>`,

            "<h3>High Voltage cables are covered with orange insulation in order to differentiate them from other wires.</h3>",
            `<h3>Why are High Voltage cables covered in orange insulation?</h3>`,
            `<div class=\"container\"><div class=\"grid\">
              <div class=\"option\" onclick=\"selectOption(this)\">1. To ensure durability against wear and tear.</div>
              <div class=\"option\" onclick=\"selectOption(this)\">2. To prevent overheating during operation.</div>
              <div class=\"option\" onclick=\"selectOption(this)\">3. To visually differentiate them from other cables.</div>
              <div class=\"option\" onclick=\"selectOption(this)\">4. To comply with aesthetic design standards.</div>
            </div><div class=\"submit-bar\">
              <button class=\"submit-button\" onclick=\"submitAnswer('3. To visually differentiate them from other cables.', 4002)\">Submit</button>
            </div></div>`,
          ],
        },
      });

      initializeScenes(scenesMap, offset, 3256);

      initializeSprites(offset, images.home, images.homeForeground);
    },
  },
  shop: {
    init: () => {
      resetLevelState();

      const rows = 151;
      populateMap(Shopcollisions, collisionsMap, rows);
      populateMap(ShopscenesChange, scenesMap, rows);
      populateMap(ShopcharactersMapData, charactersMap, rows);

      const offset = { x: -350, y: -400 };
      scale = 1.25;

      initializeBoundaries(collisionsMap, offset, [34817], scale);
      initializeCharacters(charactersMap, offset, {
        3256: {
          image: images.transparentPNG,
          frames: { max: 4, hold: 60 },
          scale: 3,
          animate: true,
          dialogue: ["...", "<h1>Hey mister, have you seen my Doggochu?</h1>"],
        },
        3056: {
          image: images.transparentPNG,
          frames: { max: 4, hold: 60 },
          scale: 3,
          dialogue: ["My bones hurt."],
        },
      });

      initializeScenes(scenesMap, offset, 34817);

      initializeSprites(offset, images.shop, images.shopForeground);
    },
  },
};

const keys = {
  w: { pressed: false },
  a: { pressed: false },
  s: { pressed: false },
  d: { pressed: false },
};

levels[currentLevel].init();
let pastLevel = currentLevel;
let isSceneChanging = false;

function resetLevelState() {
  collisionsMap = [];
  scenesMap = [];
  charactersMap = [];
  boundaries = [];
  characters = [];
  scenes = [];
  renderables = [];
  movables = [];
}

function populateMap(data, map, rowLength) {
  for (let i = 0; i < data.length; i += rowLength) {
    map.push(data.slice(i, rowLength + i));
  }
}

function initializeBoundaries(map, offset, symbols, scale) {
  map.forEach((row, i) => {
    row.forEach((symbol, j) => {
      if (symbols.includes(symbol)) {
        boundaries.push(
          new Boundary({
            position: {
              x: j * scale * Boundary.width + offset.x,
              y: i * scale * Boundary.height + offset.y,
            },
          })
        );
      }
    });
  });
}

function initializeCharacters(map, offset, characterConfigs) {
  map.forEach((row, i) => {
    row.forEach((symbol, j) => {
      const config = characterConfigs[symbol];
      if (config) {
        characters.push(
          new Character({
            position: {
              x: j * scale * Boundary.width + offset.x,
              y: i * scale * Boundary.height + offset.y,
            },
            ...config,
          })
        );
      }
    });
  });
}

function initializeScenes(map, offset, sceneSymbol) {
  map.forEach((row, i) => {
    row.forEach((symbol, j) => {
      if (symbol === sceneSymbol) {
        scenes.push(
          new Boundary({
            position: {
              x: j * scale * Boundary.width + offset.x,
              y: i * scale * Boundary.height + offset.y,
            },
          })
        );
      }
    });
  });
}

function initializeSprites(offset, backgroundImage, foregroundImage) {
  background = new Sprite({
    position: { x: offset.x, y: offset.y },
    image: backgroundImage,
  });
  foreground = new Sprite({
    position: { x: offset.x, y: offset.y },
    image: foregroundImage,
  });

  movables = [background, ...boundaries, foreground, ...characters, ...scenes];
  renderables = [background, ...boundaries, ...characters, player, foreground];
}

function animate() {
  const animationId = window.requestAnimationFrame(animate);

  if (currentLevel !== pastLevel) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    levels[currentLevel].init();
    pastLevel = currentLevel;
  }

  renderables.forEach((renderable) => {
    renderable.draw();
  });

  console.log("hi");

  if (isSceneChanging) return;
  player.animate = false;

  if (keys.w.pressed && lastKey === "w") {
    handlePlayerMovement("w", { x: 0, y: 3 }, player.sprites.up);
  } else if (keys.a.pressed && lastKey === "a") {
    handlePlayerMovement("a", { x: 3, y: 0 }, player.sprites.left);
  } else if (keys.s.pressed && lastKey === "s") {
    handlePlayerMovement("s", { x: 0, y: -3 }, player.sprites.down);
  } else if (keys.d.pressed && lastKey === "d") {
    handlePlayerMovement("d", { x: -3, y: 0 }, player.sprites.right);
  }
}

function handlePlayerMovement(direction, offset, sprite) {
  player.animate = true;
  player.image = sprite;

  checkForCharacterCollision({
    characters,
    player,
    characterOffset: offset,
  });

  if (direction === "w" || direction === "s") {
    if (handleSceneChange(direction)) return;
  }

  let moving = true;
  boundaries.forEach((boundary) => {
    if (
      rectangularCollision({
        rectangle1: player,
        rectangle2: {
          ...boundary,
          position: {
            x: boundary.position.x + offset.x,
            y: boundary.position.y + offset.y,
          },
        },
      })
    ) {
      moving = false;
    }
  });

  if (moving) {
    movables.forEach((movable) => {
      movable.position.x += offset.x;
      movable.position.y += offset.y;
    });
  }
}

function handleSceneChange(direction) {
  let newLevel;
  if (direction === "w") newLevel = "shop";
  if (direction === "s") newLevel = "home";

  for (const boundary of scenes) {
    if (
      rectangularCollision({
        rectangle1: player,
        rectangle2: boundary,
      })
    ) {
      isSceneChanging = true;
      updateSceneUI(newLevel);
      return true;
    }
  }
  return false;
}

function updateSceneUI(newLevel) {
  document.querySelector("#map").innerHTML = newLevel;
  document.querySelector("#overlappingDivText").innerHTML = newLevel;
  gsap.to("#overlappingDiv", {
    opacity: 1,
    duration: 0.2,
    onComplete() {
      currentLevel = newLevel;
      player.image = player.sprites.down;
      gsap.to("#overlappingDiv", {
        opacity: 0,
        duration: 1,
        onComplete() {
          isSceneChanging = false;
        },
      });
    },
  });
}

animate();

let lastKey = "";
window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

function handleKeyDown(e) {
  if (player.isInteracting) {
    handleDialogueInteraction(e.key);
    return;
  }

  switch (e.key) {
    case " ":
      beginInteraction();
      break;
    case "w":
      keys.w.pressed = true;
      lastKey = "w";
      break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;
    case "s":
      keys.s.pressed = true;
      lastKey = "s";
      break;
    case "d":
      keys.d.pressed = true;
      lastKey = "d";
      break;
  }
}

function handleKeyUp(e) {
  switch (e.key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
}

function handleDialogueInteraction(key) {
  if (key === " ") {
    player.interactionAsset.dialogueIndex++;

    const { dialogueIndex, dialogue } = player.interactionAsset;
    if (dialogueIndex <= dialogue.length - 1) {
      document.querySelector("#characterDialogueBox").innerHTML =
        dialogue[dialogueIndex];
      return;
    }

    // Finish conversation
    endInteraction();
  }
}

function beginInteraction() {
  if (!player.interactionAsset) return;

  const firstMessage = player.interactionAsset.dialogue[0];
  document.querySelector("#characterDialogueBox").innerHTML = firstMessage;
  document.querySelector("#characterDialogueBox").style.display = "flex";
  player.isInteracting = true;
}

function endInteraction() {
  player.isInteracting = false;
  player.interactionAsset.dialogueIndex = 0;
  document.querySelector("#characterDialogueBox").style.display = "none";
}
