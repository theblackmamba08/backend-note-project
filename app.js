const express = require('express');
const mongoose = require('mongoose');
const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
const path = require('path');
const notesRouter = require('./Controllers/notes');

const app = express();

logger.info('Connecting to', config.MONGODB_URI);

mongoose
    .connect(config.MONGODB_URI)
    .then(() => {
        logger.info('Connected to MongoDB');
    })
    .catch((error) => {
        logger.error('Error connecting to MongoDB:', error.message);
    });

app.use(express.static('dist'));
app.use(express.json());
app.use(middleware.requestLogger);

app.get('/', (request, response) => {
    response.sendFile(path.resolve(__dirname, 'dist', 'index.html')); 
});

app.use('/api/notes', notesRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;