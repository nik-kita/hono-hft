import { useState } from "react";
import { tw } from "../utils/tw";
import "./App.css";
import CredentialsFrom from "./credentials-form/CredentialsForm";

function App() {
  const [connection_url, set_connection_url] = useState("");

  return (
    <div className={tw("h-screen w-screen")}>
      {!connection_url
        ? <CredentialsFrom {...{ set_connection_url }} />
        : connection_url}
    </div>
  );
}

export default App;
