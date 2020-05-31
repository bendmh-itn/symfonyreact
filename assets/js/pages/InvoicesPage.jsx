import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import InvoicesAPI from "../services/invoicesAPI";
import MomentAPI from "../services/momentAPI";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";

const STATUS_CLASSES = {
  PAID: "success",
  SENT: "info",
  CANCELED: "danger",
};

const STATUS_LABELS = {
  PAID: "Payée",
  SENT: "Envoyée",
  CANCELED: "Annulée",
};

const InvoicesPage = (props) => {
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    try {
      const data = await InvoicesAPI.findAll();
      setInvoices(data);
      setLoading(false);
    } catch (error) {
      toast.error("Un erreur est survenue lors du chargement des factures");
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Gestion du format de date grâce à moment
  // const formatDate = (str) => moment(str).format('DD/MM/YYYY');

  // Gestion de la suppression d'une invoice
  const handleDelete = async (id) => {
    const originalInvoices = [...invoices];
    //approche optimiste => je suppose que l'API va fonctionner. Je supprime le invoice du tableau directement
    setInvoices(invoices.filter((invoice) => invoice.id !== id));

    //approche pessimiste => je remets dans le setinvoices le tableau original si l'api bug
    try {
      await InvoicesAPI.delete(id);
      toast.success("La facture a bien été supprimée");
    } catch (error) {
      setInvoices(originalInvoices);
      toast.error("Une erreur est survenue");
    }
  };

  // Gestion du changement de page
  const handlePageChange = (page) => setCurrentPage(page);

  /* Gestion de la recherche => 
     1. on va récupérer la valeur dans le champ
     2. on change la const search avec la caleur obtenue
     3. On remet la current page à 1 pour permettre de rechercher sur toute les pages (obligatoire)
    */
  const handleSearch = (event) => {
    const value = event.currentTarget.value;
    setSearch(value);
    setCurrentPage(1);
  };

  const itemsPerPages = 10;

  const filteredInvoices = invoices.filter(
    (i) =>
      i.customer.firstname.toLowerCase().includes(search.toLowerCase()) ||
      i.customer.lastname.toLowerCase().includes(search.toLowerCase()) ||
      i.amount.toString().startsWith(search.toLowerCase()) ||
      STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
  );

  // Pagination des données (c'est ici qu'on récupère les cutomers à afficher)
  const paginatedInvoices = Pagination.getData(
    filteredInvoices,
    currentPage,
    itemsPerPages
  );

  return (
    <>
      <div className=" mb-3 d-flex justify-content-between align-items-center">
        <h1>Liste des factures</h1>
        <Link to="/invoices/new" className="btn btn-primary">
          Créer une facture
        </Link>
      </div>

      <div className="form-group">
        <input
          type="text"
          onChange={handleSearch}
          value={search}
          className="form-control recherche"
          placeholder="Rechercher ..."
        />
      </div>

      <table className="table table-hover">
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Client</th>
            <th className="text-center">Date d'envoie</th>
            <th className="text-center">Status</th>
            <th className="text-center">Montant</th>
            <th></th>
          </tr>
        </thead>
        {!loading && (
          <tbody>
            {paginatedInvoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>{invoice.chrono}</td>
                <td>
                  <Link to={"/customers/" + invoice.customer.id}>
                    {invoice.customer.firstname} {invoice.customer.lastname}
                  </Link>
                </td>
                <td className="text-center">
                  {MomentAPI.dayMonthYears(invoice.sentAt)}
                </td>
                <td className="text-center">
                  <span
                    className={"badge badge-" + STATUS_CLASSES[invoice.status]}
                  >
                    {STATUS_LABELS[invoice.status]}
                  </span>
                </td>
                <td className="text-center">
                  {invoice.amount.toLocaleString()} €
                </td>
                <td>
                  <Link
                    className="btn btn-sm btn-primary mr-1"
                    to={"/invoices/" + invoice.id}
                  >
                    Editer
                  </Link>
                  <button
                    onClick={() => handleDelete(invoice.id)}
                    className="btn btn-sm btn-danger"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
      {loading && <TableLoader />}

      {itemsPerPages < filteredInvoices.length && (
        <Pagination
          currentPage={currentPage}
          itemsPerPages={itemsPerPages}
          length={filteredInvoices.length}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
};

export default InvoicesPage;
