const holes = document.querySelectorAll(".hole");
const scoreBoard = document.querySelector(".score");
const moles = document.querySelectorAll(".mole");
const startBtn = document.querySelector(".start-btn");
const cancelBtn = document.querySelector(".cancel-btn");
const levels = document.querySelector(".levels");
const timerInput = document.querySelector(".timer");

let lastHole;
let timeUp = false;
let score = 0;

function getDifficultyLevel() {
  const selectedLevel = document.querySelector('input[name="level"]:checked');
  return selectedLevel ? selectedLevel.id : null;
}

function getValidTime(time) {
  const parsedTime = Number(time);
  return parsedTime >= 5 && parsedTime <= 1000 ? parsedTime : 15;
}

function getRandomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function getRandomHole(holes) {
  const randomIndex = Math.floor(Math.random() * holes.length);
  const selectedHole = holes[randomIndex];

  if (selectedHole === lastHole) {
    return getRandomHole(holes);
  }

  lastHole = selectedHole;
  return selectedHole;
}

function makeMoleAppear(showDuration, hideDuration) {
  const randomDuration = getRandomTime(showDuration, hideDuration);
  const hole = getRandomHole(holes);

  hole.classList.add("up");
  setTimeout(() => {
    hole.classList.remove("up");
    if (!timeUp) {
      makeMoleAppear(showDuration, hideDuration);
    }
  }, randomDuration);
}

function startGame() {
  const difficulty = getDifficultyLevel();
  let showDuration, hideDuration;

  switch (difficulty) {
    case "easy":
      showDuration = 500;
      hideDuration = 1500;
      break;
    case "medium":
      showDuration = 200;
      hideDuration = 1000;
      break;
    case "hard":
      showDuration = 100;
      hideDuration = 800;
      break;
    default:
      showDuration = 500;
      hideDuration = 1500;
  }

  scoreBoard.textContent = 0;
  score = 0;
  timeUp = false;
  cancelBtn.style.display = "block";
  startBtn.style.display = "none";
  levels.style.visibility = "hidden";

  timerInput.value = getValidTime(timerInput.value);

  const countdownInterval = setInterval(() => {
    timerInput.value--;
    if (timerInput.value <= 0) {
      clearInterval(countdownInterval);
      timerInput.value = 0;
      endGame();
    }
  }, 1000);

  makeMoleAppear(showDuration, hideDuration);
}

function endGame() {
  timeUp = true;
  timerInput.value = 0;
  startBtn.style.display = "block";
  cancelBtn.style.display = "none";
  levels.style.visibility = "visible";
}

function handleMoleHit(e) {
  if (!e.isTrusted) return; // Prevent fake clicks
  score++;
  this.parentNode.classList.remove("up");
  scoreBoard.textContent = score;
}

moles.forEach((mole) => mole.addEventListener("click", handleMoleHit));
