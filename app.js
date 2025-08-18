"use strict";
// Elementos del DOM
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskContainer = document.getElementById("taskContainer");
console.log("Input:", taskInput);
console.log("Boton:", addTaskBtn);
console.log("Contenedor de Tareas:", taskContainer);
// Clase TaskManager genérica
class TaskManager {
    constructor() {
        this.tasks = [];
        this.nextId = 1;
    }
    addTask(title) {
        const newTask = {
            id: this.nextId++,
            title: title,
            completed: false
        };
        this.tasks.push(newTask);
        return newTask;
    }
    listTasks() {
        return this.tasks;
    }
    deleteTask(id) {
        const index = this.tasks.findIndex(t => t.id === id);
        if (index === -1)
            return false;
        this.tasks.splice(index, 1);
        return true;
    }
}
// Instancia del TaskManager
const taskManager = new TaskManager();
// Función para renderizar tareas
function renderTasks() {
    taskContainer.innerHTML = "";
    taskManager.listTasks().forEach(task => {
        const li = document.createElement("li");
        li.className = "task-item";
        // Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.onclick = () => {
            task.completed = !task.completed;
            renderTasks();
        };
        // Título
        const span = document.createElement("span");
        span.textContent = task.title;
        if (task.completed) {
            span.style.textDecoration = "line-through";
            span.style.color = "#888";
        }
        // Botón eliminar
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Eliminar";
        deleteBtn.className = "delete-btn";
        deleteBtn.onclick = () => {
            taskManager.deleteTask(task.id);
            renderTasks();
        };
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskContainer.appendChild(li);
    });
}
// Listener para agregar tarea
addTaskBtn.addEventListener("click", () => {
    const title = taskInput.value.trim();
    if (!title) {
        alert("Escribe una tarea antes de agregarla");
        return;
    }
    taskManager.addTask(title);
    renderTasks();
    taskInput.value = "";
});
// Agregar tarea con Enter
taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter")
        addTaskBtn.click();
});
// Render inicial (por si hay tareas predeterminadas)
renderTasks();
