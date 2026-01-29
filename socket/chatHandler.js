/**
 * Chat Handler for Socket.io
 * Handles all real-time chat events
 */

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('✓ User connected:', socket.id);
        
        // ==================== Join Project Room ====================
        socket.on('joinProject', (projectId) => {
            socket.join(projectId);
            console.log(`User ${socket.id} joined project room: ${projectId}`);
            
            // Notify others in the room
            socket.to(projectId).emit('userJoined', {
                message: 'A user joined the chat'
            });
        });
        
        // ==================== Leave Project Room ====================
        socket.on('leaveProject', (projectId) => {
            socket.leave(projectId);
            console.log(`User ${socket.id} left project room: ${projectId}`);
            
            // Notify others
            socket.to(projectId).emit('userLeft', {
                message: 'A user left the chat'
            });
        });
        
        // ==================== Typing Indicator ====================
        socket.on('typing', (data) => {
            socket.to(data.projectId).emit('userTyping', {
                userId: data.userId,
                userName: data.userName
            });
        });
        
        // ==================== Stop Typing ====================
        socket.on('stopTyping', (data) => {
            socket.to(data.projectId).emit('userStoppedTyping', {
                userId: data.userId
            });
        });
        
        // ==================== Handle Disconnect ====================
        socket.on('disconnect', () => {
            console.log('✗ User disconnected:', socket.id);
        });
        
        // ==================== Error Handling ====================
        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });
    });
};
