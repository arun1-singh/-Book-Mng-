import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CreateBook = () => {
    const [values, setValues] = useState({
        publisher: "",
        name: "",
        date: '',
        cost: '',
        edition: ""
    })
    const token = localStorage.getItem("token")
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:5000/create', values, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(res => navigate('/'))
        .catch(err => console.log(err))
    }

    return (
        <div className='d-flex align-items-center flex-column mt-3'>
            <h2>Add a Book</h2>
            <form className='wt-50' onSubmit={handleSubmit}>
                <div className="mb-3 mt-3">
                    <label htmlFor="publisher" className="form-label">Publisher</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Publisher name"
                        name="publisher"
                        onChange={(e) => setValues({ ...values, publisher: e.target.value })}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Book name:</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Book name"
                        name="name"
                        onChange={(e) => setValues({ ...values, name: e.target.value })}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="date" className="form-label">Publish Date:</label>
                    <input
                        type="date"
                        className="form-control"
                        name="date"
                        onChange={(e) => setValues({ ...values, date: e.target.value })}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="cost" className="form-label">Cost:</label>
                    <input
                        type="number"
                        className="form-control"
                        name="cost"
                        min="0"
                        step="0.01"
                        placeholder="Enter cost (e.g. 399)"
                        onChange={(e) => setValues({ ...values, cost: parseFloat(e.target.value) })}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="edition" className="form-label">Edition:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="edition"
                        placeholder="Enter edition"
                        onChange={(e) => setValues({ ...values, edition: e.target.value })}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default CreateBook
