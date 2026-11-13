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