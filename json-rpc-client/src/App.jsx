import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [number, setNumber] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const serverUrl = "http://localhost:3000/rpc"; // Your JSON-RPC server URL

  const handleSubmit = async (event) => {
    event.preventDefault();
    setResult(null);
    setError(null);

    const requestPayload = {
      jsonrpc: "2.0",
      method: "factorial",
      params: [parseInt(number)],
      id: 1,
    };

    try {
      const response = await fetch(serverUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      });

      const data = await response.json();

      if (data.result !== undefined) {
        setResult(data.result);
      } else if (data.error) {
        setError(data.error.message);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Unable to connect to the server.");
    }
  };

  return (
    <div className="App">
      <h1>Factorial Calculator</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter a number:
          <input
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
          />
        </label>
        <button type="submit">Calculate</button>
      </form>
      {result !== null && <h2>Result: {result}</h2>}
      {error && <h2 style={{ color: "red" }}>Error: {error}</h2>}
    </div>
  );
};

export default App;
