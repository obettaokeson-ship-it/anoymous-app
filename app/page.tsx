"use client";

import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  getFirestore,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";

// Paste your real Firebase config here
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Home() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "message"), (snapshot) => {
      const msgs: any[] = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (message.trim() === "") return;

    await addDoc(collection(db, "message"), {
      name: name || "Anonymous",
      message: message,
      createdAt: new Date(),
    });

    setMessage("");
    setName("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "40px",
      }}
    >
      <h1>Anonymous Messages</h1>

      <input
        type="text"
        placeholder="Your name (optional)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          marginBottom: "10px",
          borderRadius: "5px",
          border: "none",
        }}
      />

      <input
        type="text"
        placeholder="Enter message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          borderRadius: "5px",
          border: "none",
        }}
      />

      <button
        onClick={sendMessage}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          backgroundColor: "#2563eb",
          color: "white",
        }}
      >
        Send
      </button>

      <div
        style={{
          height: "400px",
          overflowY: "auto",
          marginTop: "20px",
          width: "300px",
        }}
      >
        {messages.map((msg: any, index: number) => (
          <div
            key={index}
            style={{
              marginTop: "10px",
              padding: "8px",
              backgroundColor: "#222",
              borderRadius: "5px",
              color: "white",
            }}
          >
            <h3 style={{ margin: "0 0 5px 0" }}>{msg.name}</h3>
            <p style={{ margin: 0 }}>{msg.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}