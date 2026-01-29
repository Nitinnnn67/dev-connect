/**
 * Socket.io Main Setup
 * Initializes and configures Socket.io server
 */

module.exports = (io) => {
    console.log('✓ Socket.io initialized');
    
    // Load chat handler
    require('./chatHandler')(io);
    
    // Future handlers can be added here:
    // require('./notificationHandler')(io);
    // require('./presenceHandler')(io);
};
