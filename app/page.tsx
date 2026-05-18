"use client";

import { useState, useEffect } from "react";

import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";

import app from "../firebase";

const db = getFirestore(app);

export default function Home() {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {

    const unsubscribe = onSnapshot(
      collection(db, "messages"),
      (snapshot) => {

        const msgs: any[] = [];

        snapshot.forEach((document) => {

          msgs.push({
            id: document.id,
            ...document.data(),
          });

        });

        setMessages(msgs);
      }
    );

    return () => unsubscribe();

  }, []);

  const sendMessage = async () => {

    if (message === "") {
      alert("Please type a message");
      return;
    }

    try {

      await addDoc(collection(db, "messages"), {
        text: message,
        createdAt: new Date(),
      });

      alert("Anonymous message sent 🚀");

      setMessage("");

    } catch (error) {

      alert("Error sending message");

    }
  };

  const deleteMessage = async (id: string) => {

    await deleteDoc(doc(db, "messages", id));

  };

  return (
    <div
      style={{
        textAlign: "center",
        padding: "40px",
        fontFamily: "Arial",
        backgroundColor: "#0f172a",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <h1>Anonymous Message App 🚀</h1>

      <p>Send anonymous messages to your friends</p>

      <div style={{ marginTop: "30px" }}>
        <input
          type="text"
          placeholder="Type your anonymous message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{
            padding: "12px",
            width: "300px",
            borderRadius: "8px",
            border: "1px solid gray",
            backgroundColor: "#1e293b",
            color: "white",
          }}
        />

        <br />
        <br />

        <button
          onClick={sendMessage}
          style={{
            padding: "12px 20px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Send Message
        </button>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h2>Anonymous Messages</h2>

        {messages.map((msg: any, index) => (
          <div
            key={index}
            style={{
              background: "#1f1f1f",
              color: "white",
              padding: "10px",
              margin: "10px auto",
              width: "300px",
              borderRadius: "8px",
            }}
          >
            <div>{msg.text}</div>

            <button
              onClick={() => deleteMessage(msg.id)}
              style={{
                marginTop: "10px",
                padding: "6px 10px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}