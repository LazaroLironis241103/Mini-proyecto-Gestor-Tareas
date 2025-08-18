// Elementos del DOM
const taskInput = document.getElementById("taskInput") as HTMLInputElement;
const addTaskBtn = document.getElementById("addTaskBtn") as HTMLButtonElement;
const taskContainer = document.getElementById("taskContainer") as HTMLUListElement;

// Interface de Tarea
interface Task {
    id: number;
    title: string;
    completed: boolean;
}

// Clase TaskManager
class TaskManager<T extends Task> {
    private tasks: T[] = [];
    public nextId: number = 1;

    addTask(title: string): T {
        const newTask = { id: this.nextId++, title, completed: false } as T;
        this.tasks.push(newTask);
        return newTask;
    }

    // Carga directa desde localStorage
    loadTask(task: T) {
        this.tasks.push(task);
        if (task.id >= this.nextId) {
            this.nextId = task.id + 1;
        }
    }

    listTasks(): T[] {
        return this.tasks;
    }

    deleteTask(id: number): boolean {
        const index = this.tasks.findIndex(t => t.id === id);
        if (index === -1) return false;
        this.tasks.splice(index, 1);
        return true;
    }
}

// Instancia del TaskManager
const taskManager = new TaskManager<Task>();

// ===== Persistencia =====
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(taskManager.listTasks()));
}

function loadTasks() {
    const data = localStorage.getItem("tasks");
    if (!data) return;
    const tasks: Task[] = JSON.parse(data);
    tasks.forEach(t => taskManager.loadTask(t)); // carga directa sin generar nuevo ID
}

// ===== Renderización =====
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
            saveTasks();
            renderTasks();
        };

        // Título
        const span = document.createElement("span");
        span.textContent = task.title;
        if (task.completed) span.classList.add("completed");

        // Botón eliminar
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Eliminar";
        deleteBtn.className = "delete-btn";
        deleteBtn.onclick = () => {
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
addTaskBtn.addEventListener("click", () => {
    const title = taskInput.value.trim();
    if (!title) {
        alert("Escribe una tarea antes de agregarla");
        return;
    }
    taskManager.addTask(title);
    saveTasks();
    renderTasks();
    taskInput.value = "";
});

taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTaskBtn.click();
});

// ===== Inicialización =====
loadTasks();
renderTasks();
