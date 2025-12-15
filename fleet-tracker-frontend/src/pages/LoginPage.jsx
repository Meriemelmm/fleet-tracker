import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, reset } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import "../styles/login.css"; // on sépare le CSS

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isError, message } = useSelector(
    (state) => state.auth
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));

    if (login.fulfilled.match(result)) {
      const role = result.payload.data.role;
      if (role === "admin") navigate("/admin");
      else navigate("/chauffeur");
    }
  };

  useEffect(() => {
    if (isError) alert(message);
    dispatch(reset());
  }, [isError, message, dispatch]);

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">FleetTrack Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
