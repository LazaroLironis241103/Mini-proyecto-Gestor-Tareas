// Elementos del DOM
var taskInput = document.getElementById("taskInput");
var addTaskBtn = document.getElementById("addTaskBtn");
var taskContainer = document.getElementById("taskContainer");
// Clase TaskManager
var TaskManager = /** @class */ (function () {
    function TaskManager() {
        this.tasks = [];
        this.nextId = 1;
    }
    TaskManager.prototype.addTask = function (title) {
        var newTask = { id: this.nextId++, title: title, completed: false };
        this.tasks.push(newTask);
        return newTask;
    };
    // Carga directa desde localStorage
    TaskManager.prototype.loadTask = function (task) {
        this.tasks.push(task);
        if (task.id >= this.nextId) {
            this.nextId = task.id + 1;
        }
    };
    TaskManager.prototype.listTasks = function () {
        return this.tasks;
    };
    TaskManager.prototype.deleteTask = function (id) {
        var index = this.tasks.findIndex(function (t) { return t.id === id; });
        if (index === -1)
            return false;
        this.tasks.splice(index, 1);
        return true;
    };
    return TaskManager;
}());
// Instancia del TaskManager
var taskManager = new TaskManager();
// ===== Persistencia =====
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(taskManager.listTasks()));
}
function loadTasks() {
    var data = localStorage.getItem("tasks");
    if (!data)
        return;
    var tasks = JSON.parse(data);
    tasks.forEach(function (t) { return taskManager.loadTask(t); }); // carga directa sin generar nuevo ID
}
// ===== Renderización =====
function renderTasks() {
    taskContainer.innerHTML = "";
    taskManager.listTasks().forEach(function (task) {
        var li = document.createElement("li");
        li.className = "task-item";
        // Checkbox
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.onclick = function () {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        };
        // Título
        var span = document.createElement("span");
        span.textContent = task.title;
        if (task.completed)
            span.classList.add("completed");
        // Botón eliminar
        var deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Eliminar";
        deleteBtn.className = "delete-btn";
        deleteBtn.onclick = function () {
            taskManager.deleteTask(task.id);
            saveTasks();
            renderTasks();
        };
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskContainer.appendChild(li);
    });
}
// ===== Listeners =====
addTaskBtn.addEventListener("click", function () {
    var title = taskInput.value.trim();
    if (!title) {
        alert("Escribe una tarea antes de agregarla");
        return;
    }
    taskManager.addTask(title);
    saveTasks();
    renderTasks();
    taskInput.value = "";
});
taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter")
        addTaskBtn.click();
});
// ===== Inicialización =====
loadTasks();
renderTasks();
