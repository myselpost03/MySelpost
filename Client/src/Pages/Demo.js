// Demo.js
import React, { useState, useEffect } from "react";

const Demo = () => {
  const [name, setName] = useState("");
  const [users, setUsers] = useState([]);

  // Open or create IndexedDB
  const openDB = () => {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open("MyDatabase", 1);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("users")) {
          db.createObjectStore("users", { keyPath: "id", autoIncrement: true });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event.target.error);
    });
  };

  // Add user to IndexedDB
  const addUser = async (user) => {
    const db = await openDB();
    const tx = db.transaction("users", "readwrite");
    const store = tx.objectStore("users");
    store.add(user);
    tx.oncomplete = () => fetchUsers();
  };

  // Get all users from IndexedDB
  const getAllUsers = async () => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("users", "readonly");
      const store = tx.objectStore("users");
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  // Fetch users and update state
  const fetchUsers = async () => {
    const allUsers = await getAllUsers();
    setUsers(allUsers);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = () => {
    if (!name) return;
    addUser({ name });
    setName("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>React + IndexedDB Example</h2>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name"
      />
      <button onClick={handleAddUser}>Add User</button>

      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Demo;
