const STORAGE_KEY = "branches-neon-lab-state";

const challengeConfig = [
  {
    id: "node-1",
    answer: "NEON",
    points: 250,
    success: "Node 01 solved. Neon call sign recovered.",
    malformedMessage: "Malformed answer. Use a single word with letters only.",
    validator: (value) => /^[A-Za-z]+$/.test(value)
  },
  {
    id: "node-2",
    answer: "42",
    points: 250,
    success: "Node 02 solved. Relay sum confirmed.",
    malformedMessage: "Malformed answer. Use digits only.",
    validator: (value) => /^\d+$/.test(value)
  },
  {
    id: "node-3",
    answer: "ROOT",
    points: 250,
    success: "Node 03 solved. Privileged account identified.",
    malformedMessage: "Malformed answer. Use a single word with letters only.",
    validator: (value) => /^[A-Za-z]+$/.test(value)
  },
  {
    id: "node-4",
    answer: "BRANCHES",
    points: 250,
    success: "Node 04 solved. Platform tag verified.",
    malformedMessage: "Malformed answer. Use a single word with letters only.",
    validator: (value) => /^[A-Za-z]+$/.test(value)
  }
];

const finalConfig = {
  answer: "BRANCHES{NEON_ROOT}",
  points: 500
};

const initialState = {
  solved: {},
  finalSolved: false,
  hintsOpen: {}
};

const state = loadState();

const solvedCountEl = document.querySelector("#solvedCount");
const scoreCountEl = document.querySelector("#scoreCount");
const progressFillEl = document.querySelector("#progressFill");
const missionPulseEl = document.querySelector("#missionPulse");
const missionCompleteEl = document.querySelector("#missionComplete");
const resetButtonEl = document.querySelector("#resetProgress");
const finalFormEl = document.querySelector("#finalForm");
const finalInputEl = document.querySelector("#finalAnswer");
const finalFeedbackEl = document.querySelector("#final-feedback");
const finalHintEl = document.querySelector("#final-hint");

document.querySelectorAll(".challenge-form").forEach((formEl) => {
  formEl.addEventListener("submit", (event) => handleChallengeSubmit(event, formEl));
});

document.querySelectorAll(".hint-toggle").forEach((buttonEl) => {
  buttonEl.addEventListener("click", () => {
    const hintId = buttonEl.dataset.hintId;

    if (!hintId) {
      return;
    }

    state.hintsOpen[hintId] = !state.hintsOpen[hintId];
    persistState();
    syncView();
  });
});

finalFormEl.addEventListener("submit", handleFinalSubmit);
resetButtonEl.addEventListener("click", resetState);

syncView();

function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return createInitialState();
    }

    const parsed = JSON.parse(raw);

    return {
      solved: parsed.solved ?? {},
      finalSolved: Boolean(parsed.finalSolved),
      hintsOpen: parsed.hintsOpen ?? {}
    };
  } catch {
    return createInitialState();
  }
}

function persistState() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function createInitialState() {
  return {
    solved: {},
    finalSolved: false,
    hintsOpen: {}
  };
}

function handleChallengeSubmit(event, formEl) {
  event.preventDefault();

  const challengeId = formEl.dataset.formId;
  const challenge = challengeConfig.find((item) => item.id === challengeId);

  if (!challenge) {
    return;
  }

  const inputEl = formEl.querySelector("input");
  const feedbackEl = document.querySelector(`#${challenge.id}-feedback`);
  const rawValue = inputEl.value.trim();

  if (!rawValue) {
    setFeedback(feedbackEl, "error", "Answer required. Enter a token before validating.");
    return;
  }

  if (!challenge.validator(rawValue)) {
    setFeedback(feedbackEl, "error", challenge.malformedMessage);
    return;
  }

  if (rawValue.toUpperCase() !== challenge.answer) {
    setFeedback(feedbackEl, "error", "Incorrect token. Re-check the clue and try again.");
    return;
  }

  state.solved[challenge.id] = true;
  persistState();
  setFeedback(feedbackEl, "success", challenge.success);
  syncView();
}

function handleFinalSubmit(event) {
  event.preventDefault();

  if (!allBaseChallengesSolved()) {
    setFeedback(finalFeedbackEl, "info", "Complete all four field nodes before the final flag terminal.");
    return;
  }

  const rawValue = finalInputEl.value.trim();

  if (!rawValue) {
    setFeedback(finalFeedbackEl, "error", "Flag required. Enter the final BRANCHES token.");
    return;
  }

  if (!/^BRANCHES\{[A-Z_]+\}$/.test(rawValue)) {
    setFeedback(finalFeedbackEl, "error", "Malformed flag. Use the format BRANCHES{UPPERCASE_TOKEN}.");
    return;
  }

  if (rawValue !== finalConfig.answer) {
    setFeedback(finalFeedbackEl, "error", "Incorrect flag. Combine the neon clue with the root account.");
    return;
  }

  state.finalSolved = true;
  persistState();
  setFeedback(finalFeedbackEl, "success", "Final flag accepted. Neon root signature confirmed.");
  syncView();
}

function resetState() {
  state.solved = {};
  state.finalSolved = false;
  state.hintsOpen = {};
  persistState();

  document.querySelectorAll(".challenge-form input").forEach((inputEl) => {
    inputEl.value = "";
  });

  finalInputEl.value = "";
  document.querySelectorAll(".feedback").forEach((feedbackEl) => {
    feedbackEl.textContent = "";
    feedbackEl.dataset.state = "";
  });
  syncView();
}

function syncView() {
  challengeConfig.forEach((challenge) => {
    const solved = Boolean(state.solved[challenge.id]);
    const cardEl = document.querySelector(`[data-challenge-id="${challenge.id}"]`);
    const formEl = document.querySelector(`[data-form-id="${challenge.id}"]`);
    const inputEl = formEl.querySelector("input");
    const hintEl = document.querySelector(`#${challenge.id}-hint`);
    const hintButtonEl = document.querySelector(`[data-hint-id="${challenge.id}"]`);
    const feedbackEl = document.querySelector(`#${challenge.id}-feedback`);

    cardEl.classList.toggle("is-solved", solved);
    inputEl.disabled = solved;

    if (solved) {
      inputEl.value = challenge.answer;
      setFeedback(feedbackEl, "success", challenge.success);
    } else if (!feedbackEl.dataset.state) {
      feedbackEl.textContent = "";
    }

    hintEl.hidden = !state.hintsOpen[challenge.id];
    hintButtonEl.textContent = state.hintsOpen[challenge.id] ? "Hide hint" : "Reveal hint";
  });

  const baseSolved = challengeConfig.filter((challenge) => state.solved[challenge.id]).length;
  const totalSolved = baseSolved + (state.finalSolved ? 1 : 0);
  const score = challengeConfig.reduce((sum, challenge) => {
    return sum + (state.solved[challenge.id] ? challenge.points : 0);
  }, 0) + (state.finalSolved ? finalConfig.points : 0);

  solvedCountEl.textContent = `${totalSolved} / 5`;
  scoreCountEl.textContent = `${score}`;
  progressFillEl.style.width = `${(totalSolved / 5) * 100}%`;

  if (state.finalSolved) {
    missionPulseEl.textContent = "All nodes green. Root signature secured.";
  } else if (baseSolved === 0) {
    missionPulseEl.textContent = "Awaiting first branch signal.";
  } else if (baseSolved < challengeConfig.length) {
    missionPulseEl.textContent = `${baseSolved} of 4 field nodes solved. Continue tracing the signal.`;
  } else {
    missionPulseEl.textContent = "Field nodes cleared. Final terminal unlocked.";
  }

  const finalUnlocked = allBaseChallengesSolved();

  finalInputEl.disabled = !finalUnlocked || state.finalSolved;

  if (!finalUnlocked && !state.finalSolved) {
    setFeedback(finalFeedbackEl, "info", "Final terminal locked until all four field nodes are solved.");
  } else if (state.finalSolved) {
    finalInputEl.value = finalConfig.answer;
  } else if (finalFeedbackEl.dataset.state === "info") {
    finalFeedbackEl.textContent = "";
    finalFeedbackEl.dataset.state = "";
  }

  finalHintEl.hidden = !state.hintsOpen.final;
  document.querySelector('[data-hint-id="final"]').textContent = state.hintsOpen.final ? "Hide hint" : "Reveal hint";
  missionCompleteEl.hidden = !state.finalSolved;
}

function allBaseChallengesSolved() {
  return challengeConfig.every((challenge) => state.solved[challenge.id]);
}

function setFeedback(element, stateName, message) {
  element.dataset.state = stateName;
  element.textContent = message;
}
