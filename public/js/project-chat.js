// Project Chat JavaScript

// Initialize Socket.io connection
const socket = io();

// Connection status indicator
let isConnected = false;

// Check Socket.io connection
socket.on('connect', () => {
    console.log('✓ Socket.io connected:', socket.id);
    isConnected = true;
    updateConnectionStatus(true);
});

socket.on('connect_error', (error) => {
    console.error('✗ Socket.io connection error:', error);
    isConnected = false;
    updateConnectionStatus(false);
});

socket.on('disconnect', () => {
    console.log('✗ Socket.io disconnected');
    isConnected = false;
    updateConnectionStatus(false);
});

// Update connection status in UI
function updateConnectionStatus(connected) {
    const statusIndicator = document.querySelector('.online-status');
    if (statusIndicator) {
        if (connected) {
            statusIndicator.classList.remove('offline');
            statusIndicator.classList.add('online');
        } else {
            statusIndicator.classList.remove('online');
            statusIndicator.classList.add('offline');
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const messagesContainer = document.getElementById('messagesContainer');
    const messageInput = document.getElementById('messageInput');
    const chatForm = document.getElementById('chatForm');
    const sendBtn = document.getElementById('sendBtn');
    const toggleMembersBtn = document.getElementById('toggleMembersBtn');
    const membersSidebar = document.getElementById('membersSidebar');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    const typingIndicator = document.getElementById('typingIndicator');
    const loadingOverlay = document.getElementById('loadingOverlay');

    // Get project ID from URL
    const projectId = window.location.pathname.split('/')[2];
    
    // Get current user data (from template)
    const currentUserId = document.body.dataset.userId;
    const currentUserName = document.body.dataset.userName;

    console.log('Chat initialized:', { projectId, currentUserId, currentUserName });

    // Join project room
    socket.emit('joinProject', projectId);
    console.log('✓ Joined project room:', projectId);

    // Listen for new messages
    socket.on('newMessage', function(message) {
        console.log('✓ New message received via Socket.io:', message._id);
        addMessageToUI(message);
        scrollToBottom();
        
        // Play notification sound (optional)
        // playNotificationSound();
    });
    
    // Listen for user joined
    socket.on('userJoined', function(data) {
        console.log('✓ User joined the chat:', data.socketId);
        // Optionally show a notification
    });
    
    // Listen for user left
    socket.on('userLeft', function(data) {
        console.log('✗ User left the chat:', data.socketId);
        // Optionally show a notification
    });

    // Listen for typing indicator
    socket.on('userTyping', function(data) {
        if (data.userId !== currentUserId) {
            showTypingIndicator(data.userName);
        }
    });

    // Listen for stop typing
    socket.on('userStoppedTyping', function(data) {
        if (data.userId !== currentUserId) {
            hideTypingIndicator();
        }
    });

    // Auto-resize textarea
    if (messageInput) {
        messageInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        });

        // Handle Enter key
        messageInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                chatForm.dispatchEvent(new Event('submit'));
            }
        });
    }

    // Toggle members sidebar
    if (toggleMembersBtn && membersSidebar) {
        toggleMembersBtn.addEventListener('click', function() {
            membersSidebar.classList.toggle('hidden');
        });
    }

    // Close sidebar
    if (closeSidebarBtn && membersSidebar) {
        closeSidebarBtn.addEventListener('click', function() {
            membersSidebar.classList.add('hidden');
        });
    }

    // Submit message
    if (chatForm) {
        chatForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const messageText = messageInput.value.trim();
            if (!messageText) return;
            
            // Check if connected
            if (!isConnected) {
                showError('Not connected to chat server. Trying to reconnect...');
                socket.connect();
                return;
            }

            try {
                // Show loading state
                sendBtn.disabled = true;
                sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                messageInput.disabled = true;

                // Send message to server
                const response = await fetch(`/projects/${projectId}/chat`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message: messageText })
                });

                if (response.ok) {
                    const data = await response.json();
                    
                    // Clear input
                    messageInput.value = '';
                    messageInput.style.height = 'auto';
                    
                    // Message will be added via Socket.io event automatically
                    // Don't add it manually to avoid duplicates
                    console.log('✓ Message sent successfully:', data.message._id);
                    
                    // Stop typing indicator
                    socket.emit('stopTyping', { 
                        projectId, 
                        userId: currentUserId 
                    });
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to send message');
                }
            } catch (error) {
                console.error('✗ Error sending message:', error);
                showError(error.message || 'Failed to send message. Please try again.');
            } finally {
                // Reset button and input
                sendBtn.disabled = false;
                sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
                messageInput.disabled = false;
                messageInput.focus();
            }
        });
    }

    // Scroll to bottom of messages
    function scrollToBottom() {
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    // Add message to UI
    function addMessageToUI(message) {
        // Check if message already exists (prevent duplicates)
        const existingMessage = messagesContainer.querySelector(`[data-message-id="${message._id}"]`);
        if (existingMessage) {
            console.log('Message already exists, skipping:', message._id);
            return;
        }
        
        const messageDiv = document.createElement('div');
        const isSent = message.sender._id === currentUserId;
        messageDiv.className = `message ${isSent ? 'message-sent' : 'message-received'}`;
        messageDiv.setAttribute('data-message-id', message._id);
        
        let avatarHTML = '';
        if (!isSent) {
            if (message.sender.profilePicture) {
                avatarHTML = `
                    <div class="message-avatar">
                        <img src="${message.sender.profilePicture}" alt="${message.sender.name}">
                    </div>
                `;
            } else {
                avatarHTML = `
                    <div class="message-avatar">
                        <div class="avatar-placeholder">
                            ${message.sender.name.charAt(0).toUpperCase()}
                        </div>
                    </div>
                `;
            }
        }
        
        const time = new Date(message.timestamp).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        let contentHTML = '';
        if (!isSent) {
            contentHTML = `
                <div class="message-content">
                    <div class="message-header">
                        <span class="sender-name">${message.sender.name}</span>
                        <span class="message-time">${time}</span>
                    </div>
                    <div class="message-bubble">
                        <p>${escapeHtml(message.content)}</p>
                    </div>
                </div>
            `;
        } else {
            contentHTML = `
                <div class="message-content">
                    <div class="message-bubble">
                        <p>${escapeHtml(message.content)}</p>
                        <span class="message-time">${time}</span>
                    </div>
                </div>
            `;
        }
        
        messageDiv.innerHTML = avatarHTML + contentHTML;
        messagesContainer.appendChild(messageDiv);
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Show typing indicator
    function showTypingIndicator(userName) {
        if (typingIndicator) {
            const typingName = typingIndicator.querySelector('.typing-name');
            if (typingName) {
                typingName.textContent = userName;
            }
            typingIndicator.style.display = 'flex';
            scrollToBottom();
        }
    }

    // Hide typing indicator
    function hideTypingIndicator() {
        if (typingIndicator) {
            typingIndicator.style.display = 'none';
        }
    }

    // Initial scroll to bottom
    scrollToBottom();

    // Show error message
    function showError(message) {
        // Create error toast
        const toast = document.createElement('div');
        toast.className = 'error-toast';
        toast.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('hiding');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Typing indicator with Socket.io
    let typingTimeout;
    if (messageInput) {
        messageInput.addEventListener('input', function() {
            // Clear previous timeout
            clearTimeout(typingTimeout);

            // Emit typing event
            socket.emit('typing', { 
                projectId, 
                userId: currentUserId,
                userName: currentUserName
            });

            // Hide typing indicator after 2 seconds of inactivity
            typingTimeout = setTimeout(() => {
                socket.emit('stopTyping', { 
                    projectId, 
                    userId: currentUserId 
                });
            }, 2000);
        });
    }
    
    // Leave room when page unloads
    window.addEventListener('beforeunload', function() {
        socket.emit('leaveProject', projectId);
    });

    // File attachment (placeholder)
    const attachFileBtn = document.getElementById('attachFileBtn');
    if (attachFileBtn) {
        attachFileBtn.addEventListener('click', function() {
            console.log('File attachment coming soon!');
            showError('File attachment feature coming soon!');
        });
    }

    // Emoji picker (placeholder)
    const emojiBtn = document.getElementById('emojiBtn');
    if (emojiBtn) {
        emojiBtn.addEventListener('click', function() {
            console.log('Emoji picker coming soon!');
            showError('Emoji picker feature coming soon!');
        });
    }

    // Search messages (placeholder)
    const searchMessagesBtn = document.getElementById('searchMessagesBtn');
    if (searchMessagesBtn) {
        searchMessagesBtn.addEventListener('click', function() {
            console.log('Search messages coming soon!');
            showError('Search feature coming soon!');
        });
    }

    // Hide loading overlay
    if (loadingOverlay) {
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 500);
    }

    // Responsive sidebar handling
    function handleResize() {
        if (window.innerWidth > 1024 && membersSidebar) {
            membersSidebar.classList.remove('hidden');
        } else if (membersSidebar) {
            membersSidebar.classList.add('hidden');
        }
    }

    // Initial check
    handleResize();

    // Listen for resize
    window.addEventListener('resize', handleResize);

    console.log('✓ Project chat initialized');
});

// Add CSS for error toast
const style = document.createElement('style');
style.textContent = `
    .error-toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 15px 20px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        font-size: 0.95rem;
        font-weight: 500;
    }
    
    .error-toast.hiding {
        animation: slideOutRight 0.3s ease-out forwards;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
