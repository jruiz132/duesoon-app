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

    const span = document.createElement("span");
    span.textContent = `${d.title} — ${getLabel(daysLeft)}`;

    if (daysLeft <= 3) li.classList.add("urgent");
    else if (daysLeft <= 7) li.classList.add("soon");

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✕";
    deleteBtn.className = "delete-btn";

    deleteBtn.addEventListener("click", () => {
      deadlines.splice(index, 1);
      saveDeadlines();
      renderDeadlines();
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);
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
