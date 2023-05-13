
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

const feedbackSchema = new mongoose.Schema({
  id: Number,
  name: String,
  email: String,
  feedback: String,
})

const Feedback = mongoose.model('Feedback', feedbackSchema)

app.get('/feedbacks', async (req, res) => {
  const feedbacks = await Feedback.find()
  res.json(feedbacks)
})

app.post('/feedbacks', async (req, res) => {
  const newFeedback = new Feedback(req.body)
  await newFeedback.save()
  res.json(newFeedback)
})

app.put('/feedbacks/:_id', async (req, res) => {
  const updatedFeedback = await Feedback.findByIdAndUpdate(
    req.params._id,
    req.body,
    { new: true }
  )
  res.json(updatedFeedback)
})

app.delete('/feedbacks/:id', async (req, res) => {
  await Feedback.findByIdAndDelete(req.params.id)
  res.json({ message: 'Feedback deleted' })
})

app.listen(5000, () => {
  console.log('Server is running on port 5000')
})
