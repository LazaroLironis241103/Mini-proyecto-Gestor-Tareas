//Crear la Interface 
interface Task {
    id: number;
    title: string;
    completed: boolean;
}

//Crear la Clase
//Clase Generica
class TaskManager<T extends Task> {
    //Propiedades privadas
    private tasks: T[] = [];
    private nextId: number = 1;

    //Metodos
    addTask(title: string): T {
        const newTask = {
            id: this.nextId++,
            title: title,
            completed: false
        } as T;

        this.tasks.push(newTask);
        return newTask;
    };

    listTasks(): T[] {
       return this.tasks;
    }

    getTasksForDisplay(): string[] {
    return this.tasks.map(task => {
        const check = task.completed ? "✔" : " ";
        return `- [${check}] ${task.title} (ID: ${task.id})`;
    });
}


    completeTask(id: number): boolean {
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

    getPendingTasks(): T[] {
        return this.tasks.filter(task => !task.completed);
    }

    getCompletedTasks(): T[] {
        return this.tasks.filter(task => task.completed)
    }

    deleteTask(id: number): boolean {
        const index = this.tasks.findIndex(t => t.id === id);
        if (index === -1) {
            return false;
        }

        this.tasks.splice(index, 1);
        return true;
    }
}
