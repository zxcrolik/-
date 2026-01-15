// =====================
// CANVAS
// =====================
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// =====================
// UI
// =====================
const atpEl = document.getElementById("atp");
const proteinEl = document.getElementById("proteins");
const stageTitle = document.getElementById("stageTitle");
const instruction = document.getElementById("instruction");

// =====================
// РЕСУРСЫ
// =====================
let atp = 0;
let proteins = 0;

// =====================
// БИОЛОГИЯ
// =====================
const dna = "АТГ";
let mrna = "";
let dnaIndex = 0;
let proteinChain = [];

const codonTable = {
  УАЦ: "Тирозин"
};

// =====================
// СОСТОЯНИЕ
// =====================
let mode = "transcription";

// =====================
// ПОДСКАЗКА
// =====================
function updateInstruction() {
  if (mode === "transcription") {
    instruction.textContent =
      `Выбери комплементарный нуклеотид для ${dna[dnaIndex]} (ДНК → иРНК)`;
  }
  if (mode === "translation") {
    instruction.textContent =
      `Собран кодон ${mrna}. Это аминокислота: ${codonTable[mrna]}`;
  }
}
updateInstruction();

// =====================
// КНОПКИ
// =====================
document.querySelectorAll(".choice").forEach(btn => {
  btn.onclick = () => handleChoice(btn.innerText.trim(), btn);
});

function complement(n) {
  return {
    А: "У", // A → U
    Т: "А", // T → A   
    Г: "Ц", // G → C
    Ц: "Г"  // C → G
  }[n];
}

function handleChoice(letter, btn) {
  if (mode !== "transcription") return;

  const correct = complement(dna[dnaIndex]);

  if (letter === correct) {
    btn.classList.add("correct");
    mrna += letter;
    atp += 5;
    dnaIndex++;

    if (dnaIndex === dna.length) {
      mode = "translation";
      stageTitle.textContent = "Этап 2: Трансляция";
      updateInstruction();
      proteins++;
      setTimeout(resetCycle, 2000);
    }
  } else {
    btn.classList.add("wrong");
  }

  setTimeout(() => {
    btn.classList.remove("correct", "wrong");
  }, 400);
}

// =====================
// СБРОС
// =====================
function resetCycle() {
  mrna = "";
  dnaIndex = 0;
  proteinChain = [];
  mode = "transcription";
  stageTitle.textContent = "Этап 1: Транскрипция";
  updateInstruction();
}

// =====================
// ОТРИСОВКА
// =====================
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ЯДРО
  ctx.fillStyle = "#d1b3ff";
  ctx.beginPath();
  ctx.arc(120, 150, 50, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#000";
  ctx.fillText("Ядро (ДНК)", 80, 220);
  ctx.fillText(dna, 95, 150);

  // иРНК
  ctx.fillStyle = "#000";
  ctx.fillText("иРНК:", 260, 150);
  ctx.fillText(mrna, 310, 150);

  // РИБОСОМА
  ctx.fillStyle = "#ffd966";
  ctx.beginPath();
  ctx.ellipse(300, 220, 70, 35, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillText("Рибосома", 260, 225);

  // СЧЁТ
  atpEl.textContent = atp;
  proteinEl.textContent = proteins;
}

setInterval(draw, 30);
