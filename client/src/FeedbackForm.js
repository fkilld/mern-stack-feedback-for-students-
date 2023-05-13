// FeedbackForm.js
import React, { useState, useEffect } from 'react'

const FeedbackForm = () => {
  const [form, setForm] = useState({
    _id: null,
    name: '',
    email: '',
    feedback: '',
  })
  const [feedbacks, setFeedbacks] = useState([])

  useEffect(() => {
    fetch('http://localhost:5000/feedbacks')
      .then((res) => res.json())
      .then((data) => setFeedbacks(data))
  }, [])

  const handleInputChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (form._id === null) {
      fetch('http://localhost:5000/feedbacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })
        .then((res) => res.json())
        .then((data) => setFeedbacks([...feedbacks, data]))
    } else {
      fetch(`http://localhost:5000/feedbacks/${form._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })
        .then((res) => res.json())
        .then((data) => {
          setFeedbacks(
            feedbacks.map((feedback) =>
              feedback._id === form._id ? data : feedback
            )
          )
        })
    }
    setForm({ _id: null, name: '', email: '', feedback: '' })
  }

  const handleEdit = (id) => {
    const feedback = feedbacks.find((feedback) => feedback._id === id)
    setForm(feedback)
  }

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/feedbacks/${id}`, {
      method: 'DELETE',
    }).then(() => {
      setFeedbacks(feedbacks.filter((feedback) => feedback._id !== id))
    })
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type='text'
            name='name'
            value={form.name}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type='email'
            name='email'
            value={form.email}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Feedback:
          <textarea
            name='feedback'
            value={form.feedback}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <button type='submit'>{form._id === null ? 'Submit' : 'Update'}</button>
      </form>

      <h2>Feedbacks:</h2>
      {feedbacks.map((feedback) => (
        <div key={feedback._id}>
          <h3>{feedback.name}</h3>
          <p>{feedback.email}</p>
          <p>{feedback.feedback}</p>
          <button onClick={() => handleEdit(feedback._id)}>Edit</button>
          <button onClick={() => handleDelete(feedback._id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}

export default FeedbackForm
