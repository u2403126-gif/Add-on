document.getElementById('todo-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const input = document.getElementById('task-input');
    const title = input.value.trim();
    
    if (!title) return;
    
    try {
        const response = await fetch('/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title }),
        });
        
        const task = await response.json();
        
        const tasksList = document.getElementById('tasks-list');
        const taskElement = createTaskElement(task);
        tasksList.insertBefore(taskElement, tasksList.firstChild);
        
        input.value = '';
        
        // Add animation
        taskElement.style.opacity = '0';
        taskElement.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            taskElement.style.opacity = '1';
            taskElement.style.transform = 'translateY(0)';
        }, 50);
        
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while adding the task');
    }
});

function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.dataset.id = task.id;
    
    li.innerHTML = `
        <div class="task-content">
            <input type="checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${task.title}</span>
            <span class="task-date">${task.created_at}</span>
        </div>
        <button class="delete-btn">
            <i class="fas fa-trash"></i>
        </button>
    `;
    
    // Add event listeners
    const checkbox = li.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => toggleTask(task.id));
    
    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => deleteTask(task.id, li));
    
    return li;
}

async function toggleTask(taskId) {
    try {
        const response = await fetch(`/toggle/${taskId}`, {
            method: 'POST',
        });
        
        if (response.ok) {
            const taskElement = document.querySelector(`[data-id="${taskId}"]`);
            taskElement.classList.toggle('completed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while updating the task');
    }
}

async function deleteTask(taskId, element) {
    try {
        const response = await fetch(`/delete/${taskId}`, {
            method: 'DELETE',
        });
        
        if (response.ok) {
            // Add fade-out animation
            element.style.opacity = '0';
            element.style.transform = 'translateX(20px)';
            setTimeout(() => element.remove(), 300);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while deleting the task');
    }
}

// Add event listeners to existing tasks
document.querySelectorAll('.task-item').forEach(taskElement => {
    const taskId = taskElement.dataset.id;
    const checkbox = taskElement.querySelector('input[type="checkbox"]');
    const deleteBtn = taskElement.querySelector('.delete-btn');
    
    checkbox.addEventListener('change', () => toggleTask(taskId));
    deleteBtn.addEventListener('click', () => deleteTask(taskId, taskElement));
});