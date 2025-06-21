import React, { useEffect, useState } from "react";

const App = () => {
  const [document, setDocument] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:5000/ws");
    setSocket(newSocket);

    newSocket.onopen = () => {
      console.log("Web Socket connection Establish");
    };

    newSocket.onmessage = (message) => {
      try {
        const parseMessage = JSON.parse(message.data);
        if (parseMessage.type === "init") {
          setDocument(parseMessage.data);
        } else if (message.type === "update") {
          setDocument(parseMessage.data);
        }
      } catch (error) {
        console.error(error, "Error parsing message");
      }
    };

    newSocket.close = () => {
      console.log("Web Socket connection closed");
    };
    newSocket.onerror = (error) => {
      console.log("WebSocket Error", error);
    };

    return () => {
      newSocket.close();
    };
  }, []);

  const handleChange = (e) => {
    const newDocument = e.target.value;
    setDocument(newDocument);
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: "update",
          data: newDocument,
        })
      );
    }
  };
  return (
    <>
      <div>
        <h1>Collaborative Editor</h1>
        <div>
          <textarea
            name="editor"
            id="editor"
            cols="30"
            rows="10"
            value={document}
            onChange={handleChange}
          ></textarea>
        </div>
      </div>
    </>
  );
};

export default App;
