import React, { useState, useEffect } from "react";
import Field from "../components/forms/Field";
import { Link } from "react-router-dom";
import customersAPI from "../services/customersAPI";
import { toast } from "react-toastify";

const CustomerPage = ({ match, history }) => {
  const { id = "new" } = match.params;

  const [customer, setCustomer] = useState({
    lastname: "",
    firstname: "",
    email: "",
    company: "",
  });

  const [error, setError] = useState({
    lastname: "",
    firstname: "",
    email: "",
    company: "",
  });

  const [editing, setEditing] = useState(false);

  /**
   * Récupération du customer selon son id
   * @param {number} id
   */
  const fetchCustomer = async (id) => {
    try {
      const {
        firstname,
        lastname,
        email,
        company,
      } = await customersAPI.findOne(id);
      setCustomer({ firstname, lastname, email, company });
    } catch (error) {
      toast.error("Impossible de charger le client demandé");
      history.replace("/customers");
    }
  };

  /**
   * Chargement du customer si besoin au chargement du composant ou au chargement de l'id
   */
  useEffect(() => {
    if (id !== "new") {
      setEditing(true);
      fetchCustomer(id);
    }
  }, [id]);

  /**
   * Gestion des inputs dans le formulaire
   */
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setCustomer({ ...customer, [name]: value });
  };

  /**
   * Gestion de la soumission du formulaire
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setError({});
      if (editing) {
        const response = await customersAPI.update(id, customer);
        toast.success("Le client a bien été modifié");
      } else {
        await customersAPI.create(customer);
        toast.success("Le client a bien été enregistré");
        history.replace("/customers");
      }
    } catch ({ response }) {
      const { violations } = response.data;
      if (violations) {
        const apiErrors = {};
        violations.forEach(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });
        setError(apiErrors);
        toast.error("Des erreurs dans votre formulaire");
      }
    }
  };

  return (
    <>
      {(!editing && <h1>Création d'un client</h1>) || (
        <h1>Modification du client</h1>
      )}

      <form onSubmit={handleSubmit}>
        <Field
          name="lastname"
          label="Nom de famille"
          placeholder="Nom de famille du client"
          value={customer.lastname}
          onChange={handleChange}
          error={error.lastname}
        />
        <Field
          name="firstname"
          label="Prénom"
          placeholder="Prénom du client"
          value={customer.firstname}
          onChange={handleChange}
          error={error.firstname}
        />
        <Field
          name="email"
          label="Email"
          placeholder="Email du client"
          type="email"
          value={customer.email}
          onChange={handleChange}
          error={error.email}
        />
        <Field
          name="company"
          label="Entreprise"
          placeholder="Entreprise du client"
          value={customer.company}
          onChange={handleChange}
          error={error.company}
        />

        <div className="for-group">
          <button type="submit" className="btn btn-success">
            Enregistrer
          </button>
          <Link to="/customers" className="btn btn-link">
            Retour aux clients
          </Link>
        </div>
      </form>
    </>
  );
};

export default CustomerPage;
