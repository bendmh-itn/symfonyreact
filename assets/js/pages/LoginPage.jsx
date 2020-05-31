import React, { useState, useContext } from "react";
import loginAPI from "../services/loginAPI";
import AuthContext from "../contexts/authContext";
import Field from "../components/forms/Field";
import { toast } from "react-toastify";

const LoginPage = ({ history }) => {
  const { setIsAuthenticated, setRoles } = useContext(AuthContext);

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = ({ currentTarget }) => {
    const { value, name } = currentTarget;

    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await loginAPI.login(credentials);
      setError("");
      setIsAuthenticated(true);
      toast.success("Vous êtes désormais connecté ! 👍");
      setRoles(loginAPI.getRoles());
      history.replace("/customers");
    } catch (error) {
      console.log(error.response);
      setError("Identifiant et/ou mot de passe incorrect");
      toast.error("Une erreur est survenue");
    }
  };

  return (
    <>
      <h1>Connexion à l'application</h1>

      <form onSubmit={handleSubmit}>
        <Field
          label="Adresse Email"
          name="username"
          value={credentials.username}
          onChange={handleChange}
          placeholder="Adresse Email de connexion"
          error={error}
        />
        <Field
          label="Mot de passe"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          type="password"
        />
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Je me connecte
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginPage;
