import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [world, set_world] = useState("");

  useEffect(() => {
    fetch("/api/hello").then((res) => res.text())
      .then((res) => {
        console.log(res);

        set_world(res);
      });
  }, []);

  return (
    <div>
      <h1>Hello</h1>
      <h2>{world}</h2>
      <pre>{JSON.stringify(import.meta.env)}</pre>
    </div>
  );
}

export default App;
