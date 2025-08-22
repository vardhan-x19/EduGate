import { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [message, setMessage] = useState<string>("Loading...");

  useEffect(() => {
    axios.get("http://localhost:5000/") // backend API
      .then((res) => setMessage(res.data))
      .catch((err) => setMessage("Error connecting to backend ❌"));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>React + TypeScript Frontend</h1>
      <p>Backend says: {message}</p>
    </div>
  );
}

export default Home;
