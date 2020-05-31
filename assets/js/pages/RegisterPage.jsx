import React, { useState } from "react";
import Field from "../components/forms/Field";
import { Link } from "react-router-dom";
import userAPI from "../services/userAPI";
import { toast } from "react-toastify";

const RegisterPage = ({ history }) => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  /**
   * Gestion des inputs dans le formulaire
   */
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setUser({ ...user, [name]: value });
  };

  /**
   * Gestion de la soumission du formulaire
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    const apiErrors = {};
    if (user.password !== user.passwordConfirm) {
      apiErrors.passwordConfirm =
        "Les deux mots de passe ne sont pas identiques";
      setErrors(apiErrors);
      toast.error("Il y a des erreurs dans votre formulaire");
      return;
    }
    try {
      await userAPI.register(user);
      setErrors({});
      toast.success("Vous êtes désormais inscrit. VOus pouvez vous connecter");
      history.replace("/login");
    } catch ({ response }) {
      const { violations } = response.data;
      if (violations) {
        violations.forEach(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });
        setErrors(apiErrors);
        toast.error("Il y a des erreurs dans votre formulaire");
      }
    }
  };

  return (
    <>
      <h1>Inscription</h1>

      <form onSubmit={handleSubmit}>
        <Field
          name="lastName"
          label="Nom de famille"
          placeholder="Votre nom de famille"
          value={user.lastName}
          onChange={handleChange}
          error={errors.lastName}
        />
        <Field
          name="firstName"
          label="Prénom"
          placeholder="Votre prénom"
          value={user.firstName}
          onChange={handleChange}
          error={errors.firstName}
        />
        <Field
          name="email"
          label="Email"
          placeholder="Votre email"
          type="email"
          value={user.email}
          onChange={handleChange}
          error={errors.email}
        />
        <Field
          name="password"
          label="Mot de passe"
          type="password"
          placeholder="Votre mot de passe"
          value={user.password}
          onChange={handleChange}
          error={errors.password}
        />
        <Field
          name="passwordConfirm"
          label="Retapez votre mot de passe"
          type="password"
          placeholder="Confirmez votre MDP"
          value={user.passwordConfirm}
          onChange={handleChange}
          error={errors.passwordConfirm}
        />

        <div className="for-group">
          <button type="submit" className="btn btn-success">
            Confirmation
          </button>
          <Link to="/login" className="btn btn-link">
            J'ai déjà un compte
          </Link>
        </div>
      </form>
    </>
  );
};

export default RegisterPage;
