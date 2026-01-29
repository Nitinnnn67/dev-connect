// Project Detail Page JavaScript

// Join Project Button
const joinProjectBtn = document.getElementById('joinProjectBtn');
if(joinProjectBtn) {
    joinProjectBtn.addEventListener('click', async function() {
        const projectId = this.dataset.projectId;
        
        if(confirm('Do you want to join this project?')) {
            try {
                const response = await fetch(`/projects/${projectId}/join`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if(response.ok) {
                    this.innerHTML = '<i class="fas fa-check"></i> Request Sent';
                    this.disabled = true;
                    this.classList.remove('btn-primary');
                    this.classList.add('btn-secondary');
                    
                    // Show success message
                    alert('Join request sent! Project owner will review your request.');
                } else {
                    const data = await response.json();
                    alert(data.message || 'Failed to join project. Please try again.');
                }
            } catch(error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again later.');
            }
        }
    });
}

// Share Button
const shareBtn = document.getElementById('shareBtn');
if(shareBtn) {
    shareBtn.addEventListener('click', async function() {
        const url = window.location.href;
        
        if(navigator.share) {
            try {
                await navigator.share({
                    title: document.title,
                    url: url
                });
            } catch(error) {
                if(error.name !== 'AbortError') {
                    copyToClipboard(url);
                }
            }
        } else {
            copyToClipboard(url);
        }
    });
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Link copied to clipboard!');
    }).catch(() => {
        prompt('Copy this link:', text);
    });
}

// Join Request Modal
function showJoinRequestModal() {
    const projectId = window.location.pathname.split('/')[2];
    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h3>Request to Join Project</h3>
                <button onclick="this.closest('.custom-modal').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
            </div>
            <form action="/projects/${projectId}/request-join" method="POST">
                <div class="modal-body">
                    <div class="form-group">
                        <label for="joinMessage">Why do you want to join? (Optional)</label>
                        <textarea name="message" id="joinMessage" rows="4" class="form-control" placeholder="Tell the project owner about your interest and relevant skills..."></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" onclick="this.closest('.custom-modal').remove()" class="btn btn-secondary">Cancel</button>
                    <button type="submit" class="btn btn-primary">Send Request</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
}

// Invite Modal
function showInviteModal() {
    const projectId = window.location.pathname.split('/')[2];
    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h3>Invite User to Project</h3>
                <button onclick="this.closest('.custom-modal').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
            </div>
            <form action="/projects/${projectId}/invite" method="POST">
                <div class="modal-body">
                    <div class="form-group">
                        <label for="inviteUser">User ID or Username *</label>
                        <input type="text" name="userId" id="inviteUser" class="form-control" placeholder="Enter user ID" required>
                        <small class="text-muted">You can find user IDs from the search page</small>
                    </div>
                    <div class="form-group" style="margin-top: 15px;">
                        <label for="inviteMessage">Invitation Message (Optional)</label>
                        <textarea name="message" id="inviteMessage" rows="3" class="form-control" placeholder="Add a personal message..."></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" onclick="this.closest('.custom-modal').remove()" class="btn btn-secondary">Cancel</button>
                    <button type="submit" class="btn btn-primary">Send Invitation</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
}

// Task Filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const taskItems = document.querySelectorAll('.task-item');

if(filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            
            taskItems.forEach(task => {
                if(filter === 'all') {
                    task.style.display = 'flex';
                    if(typeof gsap !== 'undefined') {
                        gsap.fromTo(task, 
                            { opacity: 0, y: 20 },
                            { opacity: 1, y: 0, duration: 0.3 }
                        );
                    }
                } else if(task.dataset.status === filter) {
                    task.style.display = 'flex';
                    if(typeof gsap !== 'undefined') {
                        gsap.fromTo(task, 
                            { opacity: 0, y: 20 },
                            { opacity: 1, y: 0, duration: 0.3 }
                        );
                    }
                } else {
                    if(typeof gsap !== 'undefined') {
                        gsap.to(task, {
                            opacity: 0,
                            y: -20,
                            duration: 0.2,
                            onComplete: () => {
                                task.style.display = 'none';
                            }
                        });
                    } else {
                        task.style.display = 'none';
                    }
                }
            });
        });
    });
}

// GSAP Animations
if(typeof gsap !== 'undefined') {
    gsap.fromTo('.project-header',
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    );

    gsap.fromTo('.project-info-bar',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.2, ease: 'power2.out' }
    );

    gsap.fromTo('.content-card',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 0.4, ease: 'power2.out' }
    );

    gsap.fromTo('.sidebar-card',
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, delay: 0.6, ease: 'power2.out' }
    );
}
