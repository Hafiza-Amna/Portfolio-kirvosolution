let notes = [];
let editIndex = null;

// Load notes from localStorage
function loadNotes() {
    const saved = localStorage.getItem('notes');
    notes = saved ? JSON.parse(saved) : [];
    renderNotes();
}

// Save notes to localStorage
function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Add or update note
function addNote() {
    const input = document.getElementById('noteInput');
    const text = input.value.trim();
    
    if (!text) return;
    
    if (editIndex !== null) {
        notes[editIndex] = text;
        editIndex = null;
        document.getElementById('saveBtn').textContent = 'Add Note';
    } else {
        notes.push(text);
    }
    
    input.value = '';
    saveNotes();
    renderNotes();
}

// Edit note
function editNote(index) {
    document.getElementById('noteInput').value = notes[index];
    editIndex = index;
    document.getElementById('saveBtn').textContent = 'Update Note';
    document.getElementById('noteInput').focus();
}

// Delete note
function deleteNote(index) {
    notes.splice(index, 1);
    saveNotes();
    renderNotes();
}

// Render all notes
function renderNotes() {
    const notesList = document.getElementById('notesList');
    
    if (notes.length === 0) {
        notesList.innerHTML = '<p class="empty">No notes yet. Start writing!</p>';
        return;
    }
    
    notesList.innerHTML = notes.map((note, index) => `
        <div class="note-card">
            <p>${note}</p>
            <div class="btns">
                <button onclick="editNote(${index})">Edit</button>
                <button onclick="deleteNote(${index})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Load notes on page load
window.addEventListener('load', loadNotes);

// Allow Enter key to add note
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.target.id === 'noteInput' && e.ctrlKey) {
        addNote();
    }
});