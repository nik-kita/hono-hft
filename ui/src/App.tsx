import { useEffect, useState } from "react";
import "./App.css";
import { hc } from "hono/client";
import type { api } from "./api";
import { tw } from "./utils/tw";

const api_client = hc<typeof api>("/api");

function App() {
  const [world, set_world] = useState("");

  useEffect(() => {
    api_client.hello.$get().then((res) => res.text()).then(set_world);
  }, []);

  return (
    <div className={tw("bg-green-300")}>
      <h1>Hello</h1>
      <h2>{world}</h2>
      <pre>{JSON.stringify(import.meta.env)}</pre>
    </div>
  );
}

export default App;
