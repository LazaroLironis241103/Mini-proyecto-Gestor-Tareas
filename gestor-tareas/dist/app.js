"use strict";
//Crear la Clase
//Clase Generica
class TaskManager {
    constructor() {
        //Propiedades privadas
        this.tasks = [];
        this.nextId = 1;
    }
    //Metodos
    addTask(title) {
        const newTask = {
            id: this.nextId++,
            title: title,
            completed: false
        };
        this.tasks.push(newTask);
        return newTask;
    }
    ;
    listTasks() {
        return this.tasks;
    }
    getTasksForDisplay() {
        return this.tasks.map(task => {
            const check = task.completed ? "✔" : " ";
            return `- [${check}] ${task.title} (ID: ${task.id})`;
        });
    }
    completeTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) {
            return false;
        }
        if (task.completed) {
            return false;
        }
        task.completed = true;
        return true;
    }
    getPendingTasks() {
        return this.tasks.filter(task => !task.completed);
    }
    getCompletedTasks() {
        return this.tasks.filter(task => task.completed);
    }
    deleteTask(id) {
        const index = this.tasks.findIndex(t => t.id === id);
        if (index === -1) {
            return false;
        }
        this.tasks.splice(index, 1);
        return true;
    }
}
//# sourceMappingURL=app.js.map