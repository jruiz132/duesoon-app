// ===== State =====
let deadlines = JSON.parse(localStorage.getItem("deadlines")) || [];

// ===== DOM =====
const form = document.getElementById("deadline-form");
const titleInput = document.getElementById("title");
const dueDateInput = document.getElementById("dueDate");
const list = document.getElementById("deadline-list");

// Prevent past dates
dueDateInput.min = new Date().toISOString().split("T")[0];

// ===== Persistence =====
function saveDeadlines() {
  localStorage.setItem("deadlines", JSON.stringify(deadlines));
}

// ===== Utilities =====
function getDaysLeft(date) {
  return Math.ceil(
    (new Date(date) - new Date()) / (1000 * 60 * 60 * 24)
  );
}

function getLabel(daysLeft) {
  if (daysLeft < 0) return "Overdue";
  if (daysLeft === 0) return "Due today";
  if (daysLeft === 1) return "Due tomorrow";
  return `${daysLeft} days left`;
}

// ===== Render =====
function renderDeadlines() {
  list.innerHTML = "";

  if (deadlines.length === 0) {
    list.innerHTML = "<li>No deadlines yet 🎉</li>";
    return;
  }

  deadlines.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  deadlines.forEach((d, index) => {
    const li = document.createElement("li");
    const daysLeft = getDaysLeft(d.dueDate);

    if (daysLeft <= 3) li.classList.add("urgent");
    else if (daysLeft <= 7) li.classList.add("soon");

    // ===== Display Mode =====
    const span = document.createElement("span");
    span.textContent = `${d.title} — ${getLabel(daysLeft)}`;

    // ===== Edit Button =====
    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.className = "edit-btn";

    // ===== Delete Button =====
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✕";
    deleteBtn.className = "delete-btn";

    deleteBtn.addEventListener("click", () => {
      deadlines.splice(index, 1);
      saveDeadlines();
      renderDeadlines();
    });

    // ===== Edit Logic =====
    editBtn.addEventListener("click", () => {
      li.innerHTML = "";

      const titleEdit = document.createElement("input");
      titleEdit.value = d.title;

      const dateEdit = document.createElement("input");
      dateEdit.type = "date";
      dateEdit.value = d.dueDate;

      const saveBtn = document.createElement("button");
      saveBtn.textContent = "💾";
      saveBtn.className = "save-btn";

      saveBtn.addEventListener("click", () => {
        deadlines[index] = {
          title: titleEdit.value.trim(),
          dueDate: dateEdit.value
        };
        saveDeadlines();
        renderDeadlines();
      });

      li.append(titleEdit, dateEdit, saveBtn);
    });

    const actions = document.createElement("div");
  actions.className = "actions";

  actions.append(editBtn, deleteBtn);

  li.append(span, actions);
  list.appendChild(li);
  
  });
}


// ===== Events =====
form.addEventListener("submit", e => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const dueDate = dueDateInput.value;

  if (!title || !dueDate) return;

  deadlines.push({ title, dueDate });
  saveDeadlines();
  renderDeadlines();
  form.reset();
});

// ===== Init =====
renderDeadlines();
