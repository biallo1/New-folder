class Todo {
    constructor() {
        this.todoList = document.getElementById('todo-list');
        this.tasks = this.loadTasks();
        this.term = '';
        this.draw();
    }

    get filteredTasks() {
        if (this.term === '') {
            return this.tasks;
        }

        return this.tasks.filter(task =>
            task.name.toLowerCase().includes(this.term.toLowerCase())
        );
    }

    draw() {
        this.todoList.innerHTML = '';

        this.filteredTasks.forEach((task, index) => {
            const li = document.createElement('li');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('task-checkbox');

            const taskNameSpan = document.createElement('span');
            taskNameSpan.innerHTML = this.getHighlightedText(task.name);
            taskNameSpan.classList.add('task-name');

            const taskDateSpan = document.createElement('span');
            taskDateSpan.innerHTML = task.date || '&nbsp;';
            taskDateSpan.classList.add('task-date');
            

            taskNameSpan.addEventListener('click', () => this.editTaskName(index));
            taskDateSpan.addEventListener('click', () => this.editTaskDate(index));

            li.appendChild(checkbox);
            li.appendChild(taskNameSpan);
            li.appendChild(taskDateSpan);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Usuń';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.addEventListener('click', () => this.removeTask(index));
            li.appendChild(deleteBtn);

            this.todoList.appendChild(li);
        });
    }

    addTask(name, date) {
        this.tasks.push({ name, date: date || '' });
        this.saveTasks();
        this.draw();
    }

    removeTask(index) {
        this.tasks.splice(index, 1);
        this.saveTasks();
        this.draw();
    }

    editTaskName(index) {
        const taskNameSpan = document.querySelectorAll('.task-name')[index];
        const input = document.createElement('input');
        input.type = 'text';
        input.value = this.tasks[index].name;
        taskNameSpan.replaceWith(input);

        input.addEventListener('blur', () => {
            this.tasks[index].name = input.value;
            this.saveTasks();
            this.draw();
        });

        input.focus();
    }

    editTaskDate(index) {
        const taskDateSpan = document.querySelectorAll('.task-date')[index];
        const input = document.createElement('input');
        input.type = 'date';
        input.value = this.tasks[index].date || '';
        taskDateSpan.replaceWith(input);
        
        input.addEventListener('blur', () => {
            this.tasks[index].date = input.value || ''; 
            this.saveTasks();
            this.draw();
        });
    
        input.focus();
    }

    getHighlightedText(text) {
        if (this.term === '') {
            return text;
        }

        const regex = new RegExp(`(${this.term})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const tasks = localStorage.getItem('tasks');
        return tasks ? JSON.parse(tasks) : [];
    }

    setSearchTerm(term) {
        this.term = term;
        this.draw();
    }
}

const todoApp = new Todo();

document.getElementById('add-btn').addEventListener('click', function() {
    const taskName = document.getElementById('new-task').value;
    const taskDate = document.getElementById('task-date').value;

    if (taskName === "") {
        alert('Proszę wprowadzić nazwę zadania.');
        return;
    }

    todoApp.addTask(taskName, taskDate);
    document.getElementById('new-task').value = '';
    document.getElementById('task-date').value = '';
});

document.getElementById('search-task').addEventListener('input', function() {
    const searchTerm = document.getElementById('search-task').value;
    todoApp.setSearchTerm(searchTerm);
});
