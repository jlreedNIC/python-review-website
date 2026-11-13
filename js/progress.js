const TOTAL_CLUES = 5;
const STORAGE_PREFIX = "python-review:clue-solved:";
const storageKey = (id) => `${STORAGE_PREFIX}${id}`;

function isSolved(id) {
    return localStorage.getItem(storageKey(id)) === "true";
}

function updateProgress() {
    let solvedCount = 0;

    for (let id = 1; id <= TOTAL_CLUES; id++) {
        if (isSolved(id)) solvedCount++;
    }

    const fill = document.getElementById("progress-fill");
    const text = document.getElementById("progress-text");
    const bar = document.querySelector(".progress-bar");

    if (fill) fill.style.width = `${(solvedCount / TOTAL_CLUES) * 100}%`;
    if (text) text.textContent = `${solvedCount} / ${TOTAL_CLUES} puzzles cleared`;
    if (bar) bar.setAttribute("aria-valuenow", String(solvedCount));

    document.querySelectorAll(".clue-card[data-clue-id]").forEach((card) => {
    const id = Number(card.dataset.clueId);
    card.classList.toggle("solved", isSolved(id));
});
}

document.querySelectorAll(".status-toggle[data-clue-id]").forEach((button) => {
    const id = Number(button.dataset.clueId);

    if (!Number.isInteger(id) || id < 1 || id > TOTAL_CLUES) {
        console.error("Invalid clue ID on status toggle:", button.dataset.clueId);
        return;
    }

    function updateButton() {
        const solved = isSolved(id);
        button.setAttribute("aria-pressed", String(solved));
        button.textContent = solved ? "Solved" : "Unsolved";
    }

    updateButton();

    button.addEventListener("click", () => {
        if (isSolved(id)) {
            localStorage.removeItem(storageKey(id));
        } else {
            localStorage.setItem(storageKey(id), "true");
        }

        updateButton();
        updateProgress();
    });
});

updateProgress();
window.addEventListener("storage", updateProgress);

const CORRECT_VAULT_CODE = "7647";
const vaultInputs = [...document.querySelectorAll(".digit-input")];
const vaultButton = document.querySelector(".vault-controls .btn-primary");
const vaultFeedback = document.querySelector(".vault-feedback");
const vaultBadge = document.querySelector(".vault-badge");
const endingDialog = document.getElementById("ending-dialog");
const closeEndingButton = document.getElementById("close-ending");
let endingShown = false;

if (vaultButton) {
    if (!vaultFeedback || !vaultBadge || !endingDialog ||
        !closeEndingButton || vaultInputs.length !== CORRECT_VAULT_CODE.length) {
        console.error("Vault is missing required elements.");
    } else {
        closeEndingButton.addEventListener("click", () => endingDialog.close());

        vaultButton.addEventListener("click", () => {
            const digits = vaultInputs.map((input) => input.value.trim());

            if (!digits.every((digit) => /^\d$/.test(digit))) {
                vaultFeedback.textContent = "Enter one digit in each slot.";
                vaultFeedback.style.color = "#ff4d6d";
                return;
            }

            const unlocked = digits.join("") === CORRECT_VAULT_CODE;

            vaultBadge.textContent = unlocked ? "UNLOCKED" : "LOCKED";
            vaultBadge.classList.toggle("unlocked", unlocked);
            vaultFeedback.textContent = unlocked
                ? "Correct code - the exit is unlocked!"
                : "Incorrect code. Check your clues and try again.";
            vaultFeedback.style.color = unlocked ? "var(--frog-green)" : "#ff4d6d";
            if (unlocked && !endingShown) {
                endingDialog.showModal();
                endingShown = true;
            }
            
        });
    }
}