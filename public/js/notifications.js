// Notifications Page JavaScript

// Elements
const markAllReadBtn = document.getElementById('markAllReadBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const filterBtns = document.querySelectorAll('.filter-btn');
const notificationItems = document.querySelectorAll('.notification-item');
const notificationsList = document.querySelector('.notifications-list');
const emptyState = document.getElementById('emptyState');

let currentFilter = 'all';

// Mark all as read
markAllReadBtn.addEventListener('click', () => {
    const unreadNotifications = document.querySelectorAll('.notification-item.unread');
    
    if (unreadNotifications.length === 0) {
        alert('No unread notifications');
        return;
    }
    
    if (confirm('Mark all notifications as read?')) {
        unreadNotifications.forEach(notification => {
            notification.classList.remove('unread');
            
            // Remove the mark as read button
            const markReadBtn = notification.querySelector('.action-btn[title="Mark as read"]');
            if (markReadBtn) {
                markReadBtn.remove();
            }
        });
        
        // Update counts
        updateNotificationCounts();
        
        // Show success animation
        gsap.fromTo('.notification-item',
            { backgroundColor: '#fff3cd' },
            { backgroundColor: '#ffffff', duration: 0.5, ease: 'power2.out' }
        );
        
        console.log('All notifications marked as read');
    }
});

// Clear all notifications
clearAllBtn.addEventListener('click', () => {
    if (notificationItems.length === 0) {
        alert('No notifications to clear');
        return;
    }
    
    if (confirm('Delete all notifications? This action cannot be undone.')) {
        // Animate out
        gsap.to('.notification-item', {
            opacity: 0,
            x: 50,
            duration: 0.3,
            stagger: 0.05,
            ease: 'power2.in',
            onComplete: () => {
                notificationsList.innerHTML = '';
                showEmptyState();
            }
        });
        
        console.log('All notifications cleared');
    }
});

// Filter notifications
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active filter
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Get filter type
        currentFilter = btn.dataset.filter;
        
        // Filter notifications
        filterNotifications();
        
        // Animate filter change
        gsap.fromTo('.notification-item',
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
        );
    });
});

// Filter notifications based on selected filter
function filterNotifications() {
    let visibleCount = 0;
    
    notificationItems.forEach(item => {
        const itemType = item.dataset.type;
        const isUnread = item.classList.contains('unread');
        
        let shouldShow = false;
        
        if (currentFilter === 'all') {
            shouldShow = true;
        } else if (currentFilter === 'unread') {
            shouldShow = isUnread;
        } else {
            shouldShow = itemType === currentFilter;
        }
        
        if (shouldShow) {
            item.style.display = 'flex';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });
    
    // Show/hide empty state
    if (visibleCount === 0) {
        showEmptyState();
    } else {
        hideEmptyState();
    }
}

// Individual notification actions
notificationItems.forEach(item => {
    // Mark as read button
    const markReadBtn = item.querySelector('.action-btn[title="Mark as read"]');
    if (markReadBtn) {
        markReadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            item.classList.remove('unread');
            markReadBtn.remove();
            updateNotificationCounts();
            
            // Animation
            gsap.fromTo(item,
                { backgroundColor: '#fff3cd' },
                { backgroundColor: '#ffffff', duration: 0.5, ease: 'power2.out' }
            );
        });
    }
    
    // Delete button
    const deleteBtn = item.querySelector('.action-btn[title="Delete"]');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            if (confirm('Delete this notification?')) {
                // Animate out
                gsap.to(item, {
                    opacity: 0,
                    x: 50,
                    height: 0,
                    marginBottom: 0,
                    padding: 0,
                    duration: 0.4,
                    ease: 'power2.in',
                    onComplete: () => {
                        item.remove();
                        updateNotificationCounts();
                        
                        // Check if list is empty
                        const remainingItems = document.querySelectorAll('.notification-item');
                        if (remainingItems.length === 0) {
                            showEmptyState();
                        }
                    }
                });
            }
        });
    }
    
    // Click on notification to mark as read
    item.addEventListener('click', () => {
        if (item.classList.contains('unread')) {
            item.classList.remove('unread');
            const markReadBtn = item.querySelector('.action-btn[title="Mark as read"]');
            if (markReadBtn) {
                markReadBtn.remove();
            }
            updateNotificationCounts();
        }
    });
});

// Update notification counts
function updateNotificationCounts() {
    const allCount = document.querySelectorAll('.notification-item').length;
    const unreadCount = document.querySelectorAll('.notification-item.unread').length;
    const projectsCount = document.querySelectorAll('.notification-item[data-type="projects"]').length;
    const teamCount = document.querySelectorAll('.notification-item[data-type="team"]').length;
    const systemCount = document.querySelectorAll('.notification-item[data-type="system"]').length;
    
    // Update filter button counts
    document.querySelector('.filter-btn[data-filter="all"] .count').textContent = allCount;
    document.querySelector('.filter-btn[data-filter="unread"] .count').textContent = unreadCount;
    document.querySelector('.filter-btn[data-filter="projects"] .count').textContent = projectsCount;
    document.querySelector('.filter-btn[data-filter="team"] .count').textContent = teamCount;
    document.querySelector('.filter-btn[data-filter="system"] .count').textContent = systemCount;
}

// Show empty state
function showEmptyState() {
    notificationsList.style.display = 'none';
    emptyState.style.display = 'block';
    
    gsap.fromTo(emptyState,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.2)' }
    );
}

// Hide empty state
function hideEmptyState() {
    notificationsList.style.display = 'flex';
    emptyState.style.display = 'none';
}

// Notification hover effects
notificationItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        gsap.to(this, {
            x: 5,
            boxShadow: '0 8px 24px rgba(17, 41, 58, 0.12)',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    item.addEventListener('mouseleave', function() {
        gsap.to(this, {
            x: 0,
            boxShadow: '0 2px 8px rgba(17, 41, 58, 0.08)',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// Auto-refresh notifications (in production, use WebSocket or polling)
function refreshNotifications() {
    // In production, fetch new notifications from server
    console.log('Checking for new notifications...');
}

// Refresh every 30 seconds
setInterval(refreshNotifications, 30000);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // 'r' to mark all as read
    if (e.key === 'r' && !e.ctrlKey && !e.metaKey) {
        markAllReadBtn.click();
    }
    
    // 'Delete' to clear all
    if (e.key === 'Delete' && (e.ctrlKey || e.metaKey)) {
        clearAllBtn.click();
    }
});

// Initialize
updateNotificationCounts();
filterNotifications();

console.log('Notifications page initialized');
