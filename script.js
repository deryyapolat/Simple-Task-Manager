const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const filterButtons = document.querySelectorAll(".filter-btn");

const totalTasksEl = document.getElementById("totalTasks");
const completedTasksEl = document.getElementById("completedTasks");
const pendingTasksEl = document.getElementById("pendingTasks");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("tr-TR");
}

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const pending = total - completed;

  totalTasksEl.textContent = `Toplam: ${total}`;
  completedTasksEl.textContent = `Tamamlanan: ${completed}`;
  pendingTasksEl.textContent = `Bekleyen: ${pending}`;
}

function getFilteredTasks() {
  if (currentFilter === "pending") {
    return tasks.filter(task => !task.completed);
  }
  if (currentFilter === "completed") {
    return tasks.filter(task => task.completed);
  }
  return tasks;
}

function renderTasks() {
  taskList.innerHTML = "";

  const filteredTasks = getFilteredTasks();

  if (filteredTasks.length === 0) {
    taskList.innerHTML = `<li class="empty-message">Gösterilecek görev yok.</li>`;
    updateStats();
    return;
  }

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "task-item";

    li.innerHTML = `
      <div class="task-left">
        <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleTask(${task.id})" />
        <div>
          <div class="task-text ${task.completed ? "completed" : ""}">
            ${escapeHtml(task.text)}
          </div>
          <div class="task-date">Oluşturulma: ${formatDate(task.createdAt)}</div>
        </div>
      </div>

      <div class="task-actions">
        <button class="complete-btn" onclick="toggleTask(${task.id})">
          ${task.completed ? "Geri Al" : "Tamamla"}
        </button>
        <button class="delete-btn" onclick="deleteTask(${task.id})">Sil</button>
      </div>
    `;

    taskList.appendChild(li);
  });

  updateStats();
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function addTask() {
  const text = taskInput.value.trim();

  if (text === "") {
    alert("Lütfen bir görev gir.");
    return;
  }

  const newTask = {
    id: Date.now(),
    text,
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.unshift(newTask);
  saveTasks();
  renderTasks();

  taskInput.value = "";
  taskInput.focus();
}

function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );

  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function clearCompletedTasks() {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
}

function setFilter(filter) {
  currentFilter = filter;

  filterButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.filter === filter);
  });

  renderTasks();
}

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    addTask();
  }
});

clearCompletedBtn.addEventListener("click", clearCompletedTasks);

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => setFilter(btn.dataset.filter));
});

renderTasks();
