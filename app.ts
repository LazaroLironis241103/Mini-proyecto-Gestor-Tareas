// ==== Tipos ====
interface Task {
    id: number;
    title: string;
    completed: boolean;
}

// ==== Elementos del DOM ====
const taskInput = document.getElementById("taskInput") as HTMLInputElement;
const addTaskBtn = document.getElementById("addTaskBtn") as HTMLButtonElement;
const taskContainer = document.getElementById("taskContainer") as HTMLUListElement;

// ==== Clase TaskManager ====
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

    getTaskById(id: number): T | undefined {
        return this.tasks.find(t => t.id === id);
    }

    toggleTaskCompletion(id: number): void {
        const task = this.getTaskById(id);
        if (task) task.completed = !task.completed;
    }

    deleteTask(id: number): boolean {
        const index = this.tasks.findIndex(t => t.id === id);
        if (index === -1) return false;
        this.tasks.splice(index, 1);
        return true;
    }
}

// ==== Instancia del TaskManager ====
const taskManager = new TaskManager<Task>();

// ===== Persistencia =====
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(taskManager.listTasks()));
}

function loadTasks() {
    const data = localStorage.getItem("tasks");
    if (!data) return;
    const tasks: Task[] = JSON.parse(data) as Task[];
    tasks.forEach(t => taskManager.loadTask(t)); // carga directa sin generar nuevo ID
}

// ===== Renderización =====
function createTaskElement(task: Task): HTMLLIElement {
    const li = document.createElement("li");
    li.className = "task-item";

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.onclick = () => {
        taskManager.toggleTaskCompletion(task.id);
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
        // Animación antes de eliminar
        li.style.transition = "all 0.2s"; // define duración de la animación
        li.style.transform = "scale(0)";  // se encoge
        li.style.opacity = "0";           // se desvanece

        setTimeout(() => {
            taskManager.deleteTask(task.id); // elimina la tarea del array
            saveTasks();
            renderTasks(); // re-renderiza la lista
        }, 200); // coincide con el tiempo de transición
    };

    // Ensamblado
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    return li;
}


// Renderiza todas las tareas en el contenedor
function renderTasks(): void {
    taskContainer.innerHTML = "";
    const tasks = taskManager.listTasks();

    if (tasks.length === 0) {
        taskContainer.classList.add("empty");
    } else {
        taskContainer.classList.remove("empty");
        tasks.forEach(task => taskContainer.appendChild(createTaskElement(task)));
    }
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

taskInput.addEventListener("keypress", (e: KeyboardEvent) => {
    if (e.key === "Enter") addTaskBtn.click();
});

// ===== Inicialización =====
loadTasks();
renderTasks();
