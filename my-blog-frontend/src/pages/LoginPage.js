import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const response = await signInWithEmailAndPassword(
        getAuth(),
        email,
        password
      );
      if (response) {
        console.log("succesfully logged in", response);
        navigate("/articles");
      } else {
        console.log("Not logged in", response);
      }
    } catch (err) {
      console.log("error occurred", err);
      setError(err.message);
    }
  };
  return (
    <>
      <h1>Log in</h1>
      {error && <p className="error">{error}</p>}
      <input
        type="email"
        placeholder="Your email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={login}>Log in</button>
      <Link to="/create-account">Don't have an account? Create one here</Link>
    </>
  );
};

export default LoginPage;
