const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const path = require('path');

const app = express();

const port = process.env.PORT || 3000;

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} request to ${req.url}`);
  next();
});

const corsOptions = {
  origin: 'http://localhost:8080', // Change this to your local Vue.js server address
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

const dbConnectionString = 'mongodb+srv://greensoul818:green123@cluster0.6ihyjvd.mongodb.net/';
const dbName = 'classlessons';

let db;

MongoClient.connect(dbConnectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database');
    db = client.db(dbName);
  })
  .catch(error => {
    console.error('Database connection error:', error);
    process.exit(1);
  });

app.use('/images', express.static(path.join(__dirname, 'images')));

app.get('/lessons', (req, res) => {
  db.collection('lessons').find().toArray()
    .then(lessons => {
      res.json(lessons);
    })
    .catch(error => {
      console.error('Error fetching lessons:', error);
      res.status(500).json({ error: 'An error occurred while fetching lessons.' });
    });
});

app.get('/orders', async (req, res) => {
  try {
    const orders = await db.collection('orders').find().toArray();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'An error occurred while fetching orders.' });
  }
});

app.post('/order', async (req, res) => {
  try {
    const orderResult = await db.collection('orders').insertOne({
      customerName: req.body.customerName,
      customerPhone: req.body.customerPhone,
      items: req.body.items,
    });

    const updates = req.body.items.map(item =>
      db.collection('lessons').updateOne(
        { _id: new ObjectId(item.id) },
        { $inc: { spaces: -item.quantity } }
      )
    );

    await Promise.all(updates);

    res.json({ success: true, message: 'Order saved successfully', orderId: orderResult.insertedId });
  } catch (error) {
    console.error('Error processing order:', error);
    res.status(500).json({ error: 'An error occurred while processing the order.' });
  }
});

app.put('/lessons/:id', (req, res) => {
  const lessonId = req.params.id;
  const spaces = req.body.spaces;

  db.collection('lessons').updateOne({ _id: new ObjectId(lessonId) }, { $set: { spaces: spaces } })
    .then(result => res.json({ success: true, message: 'Lesson updated successfully', result: result }))
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while updating the lesson.' });
    });
});

app.get('/lessons/:id', async (req, res) => {
  try {
    const lesson = await db.collection('lessons').findOne({ _id: new ObjectId(req.params.id) });
    if (lesson) {
      res.json(lesson);
    } else {
      res.status(404).json({ error: 'Lesson not found.' });
    }
  } catch (error) {
    console.error('Error fetching lesson:', error);
    res.status(500).json({ error: 'An error occurred while fetching the lesson.' });
  }
});

app.get('/search', (req, res) => {
  const query = req.query.q;
  db.collection('lessons').find({ $text: { $search: query } }).toArray()
    .then(results => res.json(results))
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'An error occurred during the search.' });
    });
});

app.use((req, res, next) => {
  res.status(404).send('You are not in the right place!!');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.sendFile(path.join(__dirname, '../public/500.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
