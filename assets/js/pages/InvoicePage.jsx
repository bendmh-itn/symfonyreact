import React, { useState, useEffect } from "react";
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";
import { Link } from "react-router-dom";
import InvoicesAPI from "../services/invoicesAPI";
import CustomersAPI from "../services/customersAPI";
import axios from "axios";
import { toast } from "react-toastify";

const InvoicePage = ({ match, history }) => {
  const { id = "new" } = match.params;

  const [customers, setCustomers] = useState([]);

  const [invoice, setInvoice] = useState({
    amount: "",
    customer: "",
    status: "SENT",
  });

  const [error, setError] = useState({
    amount: "",
    customer: "",
    status: "",
  });

  const [editing, setEditing] = useState(false);

  const fetchCustomers = async () => {
    try {
      const data = await CustomersAPI.findAll();
      setCustomers(data);
      if (!invoice.customer) setInvoice({ ...invoice, customer: data[0].id });
    } catch (error) {
      toast.error("Impossible de charger les clients");
      history.replace("/invoices");
    }
  };
  /**
   * Récupération de l'invoice selon son id
   * @param {number} id
   */
  const fetchInvoice = async (id) => {
    try {
      const { amount, status, customer } = await InvoicesAPI.findOne(id);
      setInvoice({ amount, status, customer: customer.id });
    } catch (error) {
      toast.error("Impossible de charger la facture demandée");
      history.replace("/invoices");
    }
  };

  /**
   * Gestion des inputs dans le formulaire
   */
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setInvoice({ ...invoice, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setError({});
      if (editing) {
        const response = await InvoicesAPI.update(id, invoice);
        toast.success("La facture a bien été modifiée");
      } else {
        await InvoicesAPI.create(invoice);
        toast.success("La facture a bien été enregistrée");
        history.replace("/invoices");
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

  useEffect(() => {
    if (id !== "new") {
      setEditing(true);
      fetchInvoice(id);
    }
  }, [id]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <>
      {(!editing && <h1>Création d'une facture</h1>) || (
        <h1>Modification d'une facture</h1>
      )}

      <form onSubmit={handleSubmit}>
        <Field
          name="amount"
          type="number"
          placeholder="Montant de la facture"
          label="Montant"
          onChange={handleChange}
          value={invoice.amount}
          error={error.amount}
        />

        <Select
          name="customer"
          label="Clients"
          value={invoice.customer}
          error={error.customer}
          onChange={handleChange}
        >
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.firstname} {customer.lastname}
            </option>
          ))}
        </Select>

        <Select
          name="status"
          label="Status"
          value={invoice.status}
          error={error.status}
          onChange={handleChange}
        >
          <option value="SENT">Envoyée</option>
          <option value="PAID">Payée</option>
          <option value="CANCELED">Annulée</option>
        </Select>

        <div className="for-group">
          <button type="submit" className="btn btn-success">
            Enregistrer
          </button>
          <Link to="/invoices" className="btn btn-link">
            Retour aux factures
          </Link>
        </div>
      </form>
    </>
  );
};

export default InvoicePage;
