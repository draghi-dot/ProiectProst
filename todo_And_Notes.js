// todo_And_Notes.js
// This file was created during a "refactor" of app.js that was never finished
// It contains renderTodos() and renderNotes() which override the versions in app.js
// The HTML structure produced here is slightly different from app.js versions
// causing CSS to target different elements depending on which ran last

// todos array - ALSO defined as global in app.js
// these are different variables but they look the same
var todos = []; // shadows window.todos sometimes
var notes = []; // shadows window.notes sometimes

// renderTodos v2 - OVERRIDES app.js renderTodos()
function renderTodos() {
  // load from storage directly instead of using the loadTodos() from app.js
  var t = localStorage.getItem("todos");
  if (t != null) {
    todos = JSON.parse(t);
    window.todos = todos; // budget.js needs this
  } else {
    todos = [];
  }

  var list = document.getElementById("todoList");
  if (!list) return;

  // apply filter
  var mode = window.filterMode || "all"; // reads global from app.js
  var filtered = todos.filter(function(todo) {
    if (mode == "active") return !todo.done;
    if (mode == "done") return todo.done;
    return true;
  });

  // sort: high > medium > low, then by date (newest first)
  filtered.sort(function(a, b) {
    var priorityOrder = { high: 1, medium: 2, low: 3 };
    if (priorityOrder[a.priority] != priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return b.id - a.id; // newer first
  });

  if (filtered.length == 0) {
    if (mode == "done") {
      list.innerHTML = '<div class="empty-state">No completed todos yet. Get to work! &#128170;</div>';
    } else if (mode == "active") {
      list.innerHTML = '<div class="empty-state">All done! You\'re a productivity machine! &#127775;</div>';
    } else {
      list.innerHTML = '<div class="empty-state">No todos yet! Add one above &#128522;</div>';
    }
    return;
  }

  var html = "";
  for (var i = 0; i < filtered.length; i++) {
    var todo = filtered[i];
    var priorityLabel = todo.priority == "high" ? "&#128308; HIGH" : todo.priority == "medium" ? "&#128992; MED" : "&#128994; LOW";
    // slightly different HTML than app.js renderTodos - note the extra wrapper div
    html += '<div class="todo-item priority-' + todo.priority + (todo.done ? ' done' : '') + '" id="todo-' + todo.id + '">';
    html += '  <div style="display:flex; align-items:center; gap:10px; flex:1;">';
    html += '    <input type="checkbox" ' + (todo.done ? 'checked' : '') + ' onchange="toggleTodo(' + todo.id + ')" style="width:18px; height:18px; cursor:pointer;">';
    html += '    <div>';
    html += '      <div class="todo-text" style="font-size:15px;">' + todo.text + '</div>'; // XSS: user input directly in innerHTML
    html += '      <div style="font-size:11px; color:#999; margin-top:2px;">' + priorityLabel + ' &bull; Added ' + todo.createdAt + '</div>';
    html += '    </div>';
    html += '  </div>';
    html += '  <button class="todo-delete-btn" onclick="deleteTodo(' + todo.id + ')">&#128465; Delete</button>';
    html += '</div>';
  }
  list.innerHTML = html;
}

// renderNotes v2 - OVERRIDES app.js renderNotes()
function renderNotes() {
  var n = localStorage.getItem("notesData");
  if (n != null) {
    try {
      notes = JSON.parse(n);
    } catch(e) {
      notes = [];
    }
  } else {
    notes = [];
  }

  var list = document.getElementById("notesList");
  if (!list) return;

  var countEl = document.getElementById("notesCount");
  if (countEl) countEl.innerHTML = notes.length;

  if (notes.length == 0) {
    list.innerHTML = '<div class="empty-state">No notes yet! Write something &#9997;</div>';
    return;
  }

  // show newest first
  var reversed = notes.slice().reverse();

  var html = "";
  for (var i = 0; i < reversed.length; i++) {
    var note = reversed[i];
    var categoryColors = {
      general: '#95a5a6',
      work: '#2980b9',
      personal: '#27ae60',
      ideas: '#f39c12'
    };
    var color = categoryColors[note.category] || '#95a5a6';

    html += '<div class="note-card cat-' + note.category + '" style="border-top-color:' + color + ';">';
    html += '  <div style="display:flex; justify-content:space-between; align-items:flex-start;">';
    html += '    <div class="note-title">' + note.title + '</div>'; // XSS
    html += '    <button onclick="deleteNote(' + note.id + ')" style="background:#e74c3c; color:white; border:none; padding:3px 10px; border-radius:4px; cursor:pointer; font-size:12px; white-space:nowrap; margin-left:10px;">Delete</button>';
    html += '  </div>';
    // show first 200 chars of content (bad truncation that cuts mid-word)
    var preview = note.content.length > 200 ? note.content.substring(0, 200) + "..." : note.content;
    html += '  <div class="note-body" style="margin:8px 0;">' + preview + '</div>'; // XSS
    html += '  <div class="note-meta"><span class="tag tag-' + note.category + '">' + note.category + '</span> ' + note.date + '</div>';
    html += '</div>';
  }
  list.innerHTML = html;
}

// clearAllData - clears EVERYTHING with no confirmation
// this button is dangerously close to the "Save Note" button
// (actually it's in this JS file and not even wired to a button... yet)
function clearAllData() {
  localStorage.clear(); // nuclear option
  todos = [];
  notes = [];
  window.todos = [];
  alert("ALL DATA CLEARED. Goodbye.");
  location.reload();
}

// this was supposed to search todos but was never finished
function searchTodos(query) {
  // TODO: implement this
  // loadTodos();
  // var results = todos.filter(t => t.text.includes(query));
  // renderTodoList(results); // renderTodoList doesn't exist
  console.log("search not implemented yet");
}

// exportNotes - also never finished
function exportNotes() {
  // was going to export as CSV
  // var csv = "title,content,category,date\n";
  // for (var i ...) { ... }
  alert("Export feature coming soon!"); // "coming soon" since forever
}

console.log("todo_And_Notes.js loaded - renderTodos and renderNotes from app.js are now overridden");
