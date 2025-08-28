import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/")
      .then(res => res.text())
      .then(data => setMessage(data));
  }, []);

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold">{message}</h1>
    </div>
  );
}

export default App;
