const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')

const bookRoutes = require('./routes/books')
const userRoutes = require('./routes/user')
const { pswApi, userNameApi } = require('./loginApi')

mongoose.connect(
  `mongodb+srv://${userNameApi}:${pswApi}@cluster0.o3eqgqu.mongodb.net/?retryWrites=true&w=majority`, 
  { 
    useNewUrlParser: true,
    useUnifiedTopology: true 
  }
)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express()
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json())

app.use('/api/auth', userRoutes)
app.use('/api/books', bookRoutes)
app.use('/images', express.static(path.join(__dirname, 'images')))

module.exports = app;