// Project Dashboard Functionality

// Task Filter
const filterButtons = document.querySelectorAll('.filter-btn');
const taskItems = document.querySelectorAll('.task-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filter = button.getAttribute('data-filter');
        
        taskItems.forEach(task => {
            const status = task.getAttribute('data-status');
            
            if (filter === 'all') {
                task.style.display = 'flex';
            } else if (status === filter) {
                task.style.display = 'flex';
            } else {
                task.style.display = 'none';
            }
        });
    });
});

// Task Checkbox Toggle
const taskCheckboxes = document.querySelectorAll('.task-checkbox input');
taskCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const taskContent = this.closest('.task-item').querySelector('.task-content');
        
        if (this.checked) {
            taskContent.classList.add('completed');
            // In production, send update to server
            console.log('Task completed:', this.id);
        } else {
            taskContent.classList.remove('completed');
            console.log('Task uncompleted:', this.id);
        }
    });
});

// Add Task Modal
const addTaskBtn = document.getElementById('addTaskBtn');
const addTaskModal = document.getElementById('addTaskModal');
const modalClose = document.querySelector('.modal-close');
const modalCancel = document.querySelector('.modal-cancel');
const addTaskForm = document.getElementById('addTaskForm');

addTaskBtn.addEventListener('click', () => {
    addTaskModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

function closeModal() {
    addTaskModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    addTaskForm.reset();
}

modalClose.addEventListener('click', closeModal);
modalCancel.addEventListener('click', closeModal);

// Close modal on outside click
addTaskModal.addEventListener('click', (e) => {
    if (e.target === addTaskModal) {
        closeModal();
    }
});

// Add Task Form Submit
addTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(addTaskForm);
    const taskData = {
        title: formData.get('title'),
        description: formData.get('description'),
        priority: formData.get('priority'),
        assignedTo: formData.get('assignedTo'),
        dueDate: formData.get('dueDate')
    };
    
    console.log('Creating task:', taskData);
    
    // In production, send to server
    // After successful creation, add task to list
    alert('Task created successfully!');
    closeModal();
});

// Task Actions
document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const taskItem = this.closest('.task-item');
        const taskTitle = taskItem.querySelector('h4').textContent;
        
        if (this.querySelector('.fa-edit')) {
            console.log('Edit task:', taskTitle);
            // Open edit modal with task data
        } else if (this.querySelector('.fa-trash')) {
            if (confirm(`Are you sure you want to delete "${taskTitle}"?`)) {
                console.log('Delete task:', taskTitle);
                // In production, send delete request
                taskItem.remove();
            }
        }
    });
});

// Invite Team Member
const inviteBtn = document.getElementById('inviteBtn');
if (inviteBtn) {
    inviteBtn.addEventListener('click', () => {
        const email = prompt('Enter email address to invite:');
        if (email) {
            console.log('Inviting:', email);
            alert(`Invitation sent to ${email}`);
        }
    });
}

// Animate Stats on Load
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-info h3');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 50;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Call animation after page load
setTimeout(animateStats, 300);

// Update Progress Bar Animation
function updateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar-wrapper .progress-bar');
    
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
}

updateProgressBars();

// Circular Progress Animation
function animateCircularProgress() {
    const circle = document.querySelector('.progress-fill');
    const percent = 65; // Current progress percentage
    const circumference = 2 * Math.PI * 85; // 85 is the radius
    const offset = circumference - (percent / 100) * circumference;
    
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;
    
    setTimeout(() => {
        circle.style.strokeDashoffset = offset;
    }, 200);
}

animateCircularProgress();

// Real-time Clock (optional)
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    // Update any clock elements if present
    const clockElements = document.querySelectorAll('.dashboard-clock');
    clockElements.forEach(clock => {
        clock.textContent = timeString;
    });
}

setInterval(updateClock, 1000);

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to open add task modal
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        addTaskBtn.click();
    }
    
    // Escape to close modal
    if (e.key === 'Escape' && addTaskModal.classList.contains('active')) {
        closeModal();
    }
});

// Auto-save functionality (optional)
let autoSaveTimer;
const autoSaveDelay = 3000; // 3 seconds

function autoSave() {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
        console.log('Auto-saving dashboard state...');
        // Save current filters, task states, etc. to localStorage
        const dashboardState = {
            activeFilter: document.querySelector('.filter-btn.active').getAttribute('data-filter'),
            completedTasks: Array.from(document.querySelectorAll('.task-checkbox input:checked')).map(cb => cb.id)
        };
        localStorage.setItem('dashboardState', JSON.stringify(dashboardState));
    }, autoSaveDelay);
}

// Trigger auto-save on any change
document.querySelectorAll('.task-checkbox input').forEach(checkbox => {
    checkbox.addEventListener('change', autoSave);
});

// Load saved state on page load
window.addEventListener('DOMContentLoaded', () => {
    const savedState = localStorage.getItem('dashboardState');
    if (savedState) {
        const state = JSON.parse(savedState);
        
        // Restore active filter
        if (state.activeFilter) {
            const filterBtn = document.querySelector(`[data-filter="${state.activeFilter}"]`);
            if (filterBtn) filterBtn.click();
        }
        
        // Restore completed tasks
        if (state.completedTasks) {
            state.completedTasks.forEach(taskId => {
                const checkbox = document.getElementById(taskId);
                if (checkbox) {
                    checkbox.checked = true;
                    checkbox.closest('.task-item').querySelector('.task-content').classList.add('completed');
                }
            });
        }
    }
});

// Drag and Drop for Tasks (optional enhancement)
let draggedTask = null;

taskItems.forEach(task => {
    task.setAttribute('draggable', 'true');
    
    task.addEventListener('dragstart', function() {
        draggedTask = this;
        this.style.opacity = '0.5';
    });
    
    task.addEventListener('dragend', function() {
        this.style.opacity = '1';
    });
    
    task.addEventListener('dragover', function(e) {
        e.preventDefault();
    });
    
    task.addEventListener('drop', function(e) {
        e.preventDefault();
        if (draggedTask !== this) {
            const taskList = this.parentNode;
            const allTasks = [...taskList.children];
            const draggedIndex = allTasks.indexOf(draggedTask);
            const targetIndex = allTasks.indexOf(this);
            
            if (draggedIndex < targetIndex) {
                this.parentNode.insertBefore(draggedTask, this.nextSibling);
            } else {
                this.parentNode.insertBefore(draggedTask, this);
            }
        }
    });
});
