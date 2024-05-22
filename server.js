
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const MongoDBClient = require('./public/service'); // Asegúrate de que la ruta sea correcta

const app = express();
const port = 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(cors());

// Crear una instancia de MongoDBClient
const uri = "mongodb+srv://admin:EwnizEv5@snake.ufxsfy9.mongodb.net/?retryWrites=true&w=majority&appName=snake";
const mongoClient = new MongoDBClient(uri);

// Ruta para guardar la puntuación
app.post('/save-score', async (req, res) => {
  try {
    const { name, score } = req.body;
    await mongoClient.saveScore(name, score);
    res.status(200).send({ message: 'Score saved successfully' });
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).send('Error saving score');
  }
});

// Ruta para obtener las mejores puntuaciones
app.get('/top-scores', async (req, res) => {
  try {
    const topScores = await mongoClient.getTopScores();
    res.status(200).json(topScores);
  } catch (error) {
    console.error('Error fetching top scores:', error);
    res.status(500).send('Error fetching top scores');
  }
});

// Ruta para servir el archivo HTML principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
