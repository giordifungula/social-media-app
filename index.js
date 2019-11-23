const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = require('./config/config').PORT;
const compression = require('compression');
const helmet = require('helmet');

app.use(helmet()); // secure the app
app.use(cors()); // allow requests with cors
// cors middleware 
app.use(express.json());
// parsing json

// Database
const uri = require('./config/config').mongoURI;
 // grabs from the from config file
// will be our address to the database on atlas
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });
// connect to our database with some flags being passed
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

// Routes below
const userRouter = require('./routes/userRoute');
const authRouter = require('./routes/authRoutes')
app.use('/', userRouter)
app.use('/', authRouter)

app.get('/', (req,res) => {
    res.send('Server is running Whoop Whoop')
})

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({"error" : err.name + ": " + err.message})
    }
  })

app.listen(PORT, () =>
  console.log(`We are now app listening on port ${PORT}!`)
);