const { MongoClient, ServerApiVersion } = require('mongodb');

class MongoDBClient {
  constructor(uri) {
    this.client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
  }

  async connect() {
    try {
      await this.client.connect();
      await this.client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (err) {
      console.error("Failed to connect to MongoDB", err);
      throw err;
    }
  }

  async close() {
    await this.client.close();
  }

  async saveScore(name, score) {
    try {
      await this.connect();
      const db = this.client.db('snake');
      const scoresCollection = db.collection('Puntuacio');
      const result = await scoresCollection.insertOne({ name, score, date: new Date() });
      console.log("Score saved:", result);
      await this.updateTopScores();
    } catch (err) {
      console.error("Failed to save score", err);
      throw err;
    } finally {
      await this.close();
    }
  }

  async getTopScores() {
    try {
      await this.connect();
      const db = this.client.db('snake');
      const scoresCollection = db.collection('Puntuacio');
      const topScores = await scoresCollection
        .find({})
        .sort({ score: -1 })
        .limit(3)
        .toArray();
      return topScores;
    } catch (err) {
      console.error("Failed to get top scores", err);
      throw err;
    } finally {
      await this.close();
    }
  }

  async updateTopScores() {
    try {
      await this.connect();
      const db = this.client.db('snake');
      const scoresCollection = db.collection('Puntuacio');
      const topScores = await scoresCollection
        .find({})
        .sort({ score: -1 })
        .limit(3)
        .toArray();

      const lowestTopScore = topScores.length === 3 ? topScores[2].score : null;
      if (lowestTopScore !== null) {
        await scoresCollection.deleteMany({ score: { $lt: lowestTopScore } });
      }
    } catch (err) {
      console.error("Failed to update top scores", err);
      throw err;
    } finally {
      await this.close();
    }
  }
}



// Usage example
// (async () => {
//   const uri = "mongodb+srv://admin:<password>@snake.ufxsfy9.mongodb.net/?retryWrites=true&w=majority&appName=snake";
//   const mongoClient = new MongoDBClient(uri);

//   try {
//     await mongoClient.saveScore("Alice", 100);
//   } catch (err) {
//     console.error("An error occurred:", err);
//   }
// })();

module.exports = MongoDBClient;
