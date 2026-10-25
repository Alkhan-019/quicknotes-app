
const noteForm = document.getElementById("note-form");
const noteInput = document.getElementById("note-input");
const categoryInput = document.getElementById("note-category");
const notesList = document.getElementById("notes-list");
const errorMessage = document.getElementById("error-message");
const noteCount = document.getElementById("note-count");
const searchInput = document.getElementById("search-input");

let notes = [];

try {
    const savedNotes = localStorage.getItem("quicknotes");
    const parsedNotes = savedNotes ? JSON.parse(savedNotes) : [];

    if (Array.isArray(parsedNotes)) {
        notes = parsedNotes.filter(function (note) {
            return (
                note &&
                typeof note.id === "string" &&
                typeof note.text === "string" &&
                ["Personal", "Work", "Study"].includes(note.category) &&
                typeof note.createdAt === "string"
            );
        });
    }
} catch (error) {
    console.error("Could not load saved notes:", error);
}

function saveNotes() {
    try {
        localStorage.setItem("quicknotes", JSON.stringify(notes));
    } catch (error) {
        console.error("Could not save notes:", error);
        errorMessage.textContent =
            "Notes could not be saved in this browser.";
    }
}

function updateNoteCount() {
    if (notes.length === 0) {
        noteCount.textContent = "You have no notes yet.";
    } else if (notes.length === 1) {
        noteCount.textContent = "You have 1 note.";
    } else {
        noteCount.textContent = `You have ${notes.length} notes.`;
    }
}

function renderNotes() {
    notesList.innerHTML = "";

    const searchTerm = searchInput.value.trim().toLowerCase();

    const filteredNotes = notes.filter(function (note) {
        return note.text.toLowerCase().includes(searchTerm);
    });

    if (filteredNotes.length === 0 && searchTerm !== "") {
        const message = document.createElement("li");
        message.textContent = "No notes match your search.";
        notesList.appendChild(message);
    } else {
        filteredNotes.forEach(function (note) {
            const noteCard = document.createElement("li");
            noteCard.classList.add(
                "note-card",
                "category-" + note.category.toLowerCase()
            );

            const noteText = document.createElement("p");
            noteText.classList.add("note-text");
            noteText.textContent = note.text;

            const categoryLabel = document.createElement("span");
            categoryLabel.classList.add("note-category");
            categoryLabel.textContent = note.category;

            const noteDate = document.createElement("span");
            noteDate.classList.add("note-date");
            noteDate.textContent = note.createdAt;

            const deleteButton = document.createElement("button");
            deleteButton.classList.add("delete-button");
            deleteButton.textContent = "Delete";
            deleteButton.type = "button";

            deleteButton.addEventListener("click", function () {
                notes = notes.filter(function (item) {
                    return item.id !== note.id;
                });

                saveNotes();
                renderNotes();
            });

            noteCard.appendChild(noteText);
            noteCard.appendChild(categoryLabel);
            noteCard.appendChild(noteDate);
            noteCard.appendChild(deleteButton);

            notesList.appendChild(noteCard);
        });
    }

    updateNoteCount();
}

noteForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = noteInput.value.trim();

    if (!text) {
        errorMessage.textContent = "Please type a note first.";
        return;
    }

    if (text.length > 200) {
        errorMessage.textContent =
            "Notes must be 200 characters or fewer.";
        return;
    }

    const note = {
        id: Date.now().toString() + Math.random().toString(16).slice(2),
        text: text,
        category: categoryInput.value,
        createdAt: new Date().toLocaleString()
    };

    notes.push(note);
    saveNotes();

    errorMessage.textContent = "";
    noteInput.value = "";

    renderNotes();
    noteInput.focus();
});

searchInput.addEventListener("input", renderNotes);

renderNotes();
