// Books.js
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleUpdate = (book) => {
    navigate("/update", { state: { book } });
  };

  const handleDelete = (bookId) => {
    const token = localStorage.getItem("token"); //get token
    axios
      .delete(`http://localhost:5000/delete/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,   //  sending Token with every req
        },
      }
      )
      .then(() => {
        setBooks(books.filter((book) => book.id !== bookId));
      })
      .catch((err) => console.log(err));
  };
useEffect(() => {
  const token = localStorage.getItem("token"); //get token

  if (!token) {
    console.log("No token found — redirecting to login");
    navigate("/login");
    return;
  }

  axios
    .get("http://localhost:5000/", {
      headers: {
        Authorization: `Bearer ${token}`, //  sending Token with every req
      },
    })
    .then((res) => {
      setBooks(res.data);
    })
    .catch((err) => {
      console.log("JWT Error:", err.response?.data);
    });

}, [navigate]);

  // Search logic
  const filteredBooks = books.filter(
    (book) =>
      book.name.toLowerCase().includes(search.toLowerCase()) ||
      book.publisher.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="container">
      <Link to="/create" className="btn btn-success mb-3">
        Create Book
      </Link>

      {/*  Search Input */}
<div className="flex justify-end mb-3">
  <input
    type="text"
    placeholder="Search by book name or publisher..."
    className="w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>



      {filteredBooks.length !== 0 ? (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Publisher</th>
              <th>Book</th>
              <th>Date</th>
              <th>Cost</th>
              <th>Edition</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((book) => (
              <tr key={book.id}>
                <td>{book.publisher}</td>
                <td>{book.name}</td>
                <td>{book.date}</td>
                <td>Rs. {book.cost}</td>
                <td>{book.edition}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleUpdate(book)}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-danger ms-2"
                    onClick={() => handleDelete(book.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <h4 className="text-center">No records found</h4>
      )}
    </div>
  );
};

export default Books;
