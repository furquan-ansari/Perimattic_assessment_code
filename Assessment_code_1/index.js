// Import necessary libraries
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { Sequelize, Model, DataTypes } = require('sequelize');
const dbConfig = require('./config/db.config');

// Create an instance of Express.js
const app = express();
app.use(express.json());

// Configure Sequelize ORM
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
});

// Define the model for API entries
class APIEntry extends Model {}
APIEntry.init({
  API: DataTypes.STRING,
  Description: DataTypes.STRING,
  Auth: DataTypes.STRING,
  HTTPS: DataTypes.BOOLEAN,
  Cors: DataTypes.STRING,
  Link: DataTypes.STRING,
  Category: DataTypes.STRING,
}, {
  sequelize,
  modelName: 'APIEntry',
  tableName: 'api_entries',
});

// Fetch JSON data from the API and push to MySQL
async function fetchAndPushData() {
  try {
    const response = await axios.get('https://api.publicapis.org/entries');
    const { entries } = response.data;

    await sequelize.sync();
    await APIEntry.bulkCreate(entries);
    console.log('Data has been pushed to MySQL successfully!');
  } catch (error) {
    console.error('Error while fetching and pushing data:', error);
  }
}

// Define the CRUD operations API
app.get('/api_entries', async (req, res) => {
  try {
    const apiEntries = await APIEntry.findAll();
    res.json(apiEntries);
  } catch (error) {
    console.error('Error while retrieving API entries:', error);
    res.status(500).json({ error: 'An error occurred while retrieving API entries.' });
  }
});

// Get all data in pagination form
// app.get('/api_entries', async (req, res) => {
//   try {
//     const { limit = 10, offset = 0 } = req.query; // Default limit: 10, offset: 0

//     // Retrieve the API entries with pagination
//     const apiEntries = await APIEntry.findAll({
//       limit: parseInt(limit),
//       offset: parseInt(offset),
//     });

//     res.json(apiEntries);
//   } catch (error) {
//     console.error('Error while retrieving API entries:', error);
//     res.status(500).json({ error: 'An error occurred while retrieving API entries.' });
//   }
// });


app.get('/api_entries/:id', async (req, res) => {
  try {
    const apiEntry = await APIEntry.findByPk(req.params.id);
    if (apiEntry) {
      res.json(apiEntry);
    } else {
      res.status(404).json({ error: 'API entry not found.' });
    }
  } catch (error) {
    console.error('Error while retrieving API entry:', error);
    res.status(500).json({ error: 'An error occurred while retrieving API entry.' });
  }
});

app.post('/api_entries', async (req, res) => {
  try {
    const apiEntry = await APIEntry.create(req.body);
    res.json(apiEntry);
  } catch (error) {
    console.error('Error while creating API entry:', error);
    res.status(500).json({ error: 'An error occurred while creating API entry.' });
  }
});

app.put('/api_entries/:id', async (req, res) => {
  try {
    const apiEntry = await APIEntry.findByPk(req.params.id);
    if (apiEntry) {
      await apiEntry.update(req.body);
      res.json(apiEntry);
    } else {
      res.status(404).json({ error: 'API entry not found.' });
    }
  } catch (error) {
    console.error('Error while updating API entry:', error);
    res.status(500).json({ error: 'An error occurred while updating API entry.' });
  }
});

app.delete('/api_entries/:id', async (req, res) => {
  try {
    const apiEntry = await APIEntry.findByPk(req.params.id);
    if (apiEntry) {
      await apiEntry.destroy();
      res.json({ message: 'API entry has been deleted.' });
    } else {
      res.status(404).json({ error: 'API entry not found.' });
    }
  } catch (error) {
    console.error('Error while deleting API entry:', error);
    res.status(500).json({ error: 'An error occurred while deleting API entry.' });
  }
});

// Start the server
// const PORT = 3000;
app.listen(process.env.PORT, () => {
  console.log(`Server listening on port`, process.env.PORT);
  fetchAndPushData();
});
