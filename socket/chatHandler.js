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
            console.log(`✓ User ${socket.id} joined project room: ${projectId}`);
            
            // Get room size for debugging
            const room = io.sockets.adapter.rooms.get(projectId);
            const roomSize = room ? room.size : 0;
            console.log(`  Room size: ${roomSize} users`);
            
            // Notify others in the room (not including sender)
            socket.to(projectId).emit('userJoined', {
                message: 'A user joined the chat',
                socketId: socket.id
            });
        });
        
        // ==================== Leave Project Room ====================
        socket.on('leaveProject', (projectId) => {
            socket.leave(projectId);
            console.log(`✗ User ${socket.id} left project room: ${projectId}`);
            
            // Notify others
            socket.to(projectId).emit('userLeft', {
                message: 'A user left the chat',
                socketId: socket.id
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
