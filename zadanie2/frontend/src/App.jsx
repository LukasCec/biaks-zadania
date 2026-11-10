import { useState } from "react";
import LoginForm from "./LoginForm.jsx";
import Landing from "./Landing.jsx";

export default function App() {
  const [user, setUser] = useState(null);

  if (user) {
    return <Landing username={user} onLogout={() => setUser(null)} />;
  }

  return <LoginForm onLogin={setUser} />;
}
