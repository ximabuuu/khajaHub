// socket.js
const RiderLocation = require('./models/user.model.js'); // Assuming you have a RiderLocation model

export function setupSocket(io) {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // Handle location update from rider
        socket.on('updateLocation', (orderId, location) => {
            console.log(`Rider location updated for order ${orderId}:`, location);

            // Save to DB and emit to users every 5 seconds
            setInterval(async () => {
                const newLocation = new RiderLocation({
                    orderId,
                    latitude: location.latitude,
                    longitude: location.longitude,
                });

                await newLocation.save();
                console.log('Saved rider location to DB:', newLocation);

                // Emit to the users
                io.to(orderId).emit('riderLocationUpdate', newLocation);
            }, 5000); // Update every 5 seconds
        });

        // Handle user subscription to an order
        socket.on('subscribeToOrder', (orderId) => {
            console.log(`User subscribed to order ${orderId}`);
            socket.join(orderId); // Join the room for real-time updates
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
}


