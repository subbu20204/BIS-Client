function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  );
}

function checkForCharacterCollision({
  characters,
  player,
  characterOffset = { x: 0, y: 0 },
}) {
  player.interactionAsset = null;
  for (let i = 0; i < characters.length; i++) {
    const character = characters[i];

    if (
      rectangularCollision({
        rectangle1: player,
        rectangle2: {
          ...character,
          position: {
            x: character.position.x + characterOffset.x,
            y: character.position.y + characterOffset.y,
          },
        },
      })
    ) {
      player.interactionAsset = character;
      break;
    }
  }
}

function adjustCanvas() {
  const canvas = document.querySelector("canvas");
  const context = canvas.getContext("2d");
  canvas.width = window.innerWidth * 0.9;
  canvas.height = (window.innerHeight * 0.95) / aspectRatio;
  scaleFactor = canvas.width / 1382;
  context.scale(scaleFactor, scaleFactor);
}

function handleOrientationChange() {
  const isPortrait = window.innerWidth < window.innerHeight;

  if (isPortrait) {
    showOrientationMessage(
      "Please rotate your device for a better gameplay experience."
    );
  } else {
    hideOrientationMessage();
  }
}

function showOrientationMessage(message) {
  let overlay = document.getElementById("orientation-overlay");
  overlay.textContent = message;
  overlay.style.display = "flex";
}

function hideOrientationMessage() {
  const overlay = document.getElementById("orientation-overlay");
  overlay.style.display = "none";
  adjustCanvas();
}

function toggleFullScreen() {
  const div = document.getElementById("gameDiv");

  if (!document.fullscreenElement) {
    div.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}
