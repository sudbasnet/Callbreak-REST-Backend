const express = require('express');

const app = express();

const path = require('path');

const mongoose = require('mongoose');

require('dotenv').config();

const cors = require('cors');

const errorHandler = require('./middlewares/error-handler');

const isUserAuthenticated = require('./middlewares/user-authentication-verification');

// Routes
const userRoutes = require('./user/user.routes');
const gameRoutes = require('./game/game.routes');

// Middlewares
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND }));
// app.use(express.static(path.join(__dirname, 'public'))); // not required for REST as not using anything public elements
app.use(errorHandler);

app.use('/user', userRoutes);
app.use('/game', isUserAuthenticated, gameRoutes);

app.get('/', (req, res, next) => {
    res.send({ message: 'Default route' });
});

// Database Connection
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(function (reason) {
        console.log('Unable to connect to the mongodb instance. Error: ', reason);
    });

// Server 
const server = app.listen(process.env.PORT, () => { console.log("Server is running.") });

// Socket.IO
const io = require('socket.io')(server);
io.on('connection', socket => {
    console.log('Websockets connected.');
});


