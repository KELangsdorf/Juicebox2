const express = require("express");
const app = express();
require('dotenv').config();

app.use(express.json());
app.use('/api/posts', require ('./routes/API/posts'))
app.use('/auth', require ('./auth/index'))

// Start the server
const port = 3000;
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Export the server instance for testing purposes
module.exports = server;
