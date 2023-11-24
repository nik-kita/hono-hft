import { tw } from "../utils/tw";
import "./App.css";
import CredentialsForm from "./components/credentials-form/CredentialsForm";

function App() {
  return (
    <div className={tw("h-screen w-screen")}>
      <CredentialsForm />
    </div>
  );
}

export default App;
