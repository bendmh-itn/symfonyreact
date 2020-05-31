import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import CustomersAPI from "../services/customersAPI";
import { Link } from "react-router-dom";
import TableLoader from "../components/loaders/TableLoader";

const CustomersPage = (props) => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /*Pour permettre de lancer la fonction asynchrone il faut créer une nouvelle fonction. 
    Réact interdit d'utiliser une fonction asynchrone directement dans le useEffect
    */
  const fetchCustomers = async () => {
    try {
      const data = await CustomersAPI.findAll();
      setCustomers(data);
      setLoading(false);
    } catch (error) {
      toast.error("Un erreur est survenue lors du chargement des clients");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Gestion de la suppression d'un customer
  const handleDelete = async (id) => {
    const originalCustomers = [...customers];
    //approche optimiste => je suppose que l'API va fonctionner. Je supprime le customer du tableau directement
    setCustomers(customers.filter((customer) => customer.id !== id));

    //approche pessimiste => je remets dans le setCustomers le tableau original si l'api bug
    //méthode try and catch (plus intéressante)
    try {
      await CustomersAPI.delete(id);
      toast.success("Le client a bien été supprimée");
    } catch (error) {
      setCustomers(originalCustomers);
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

  // Filtrage des customers grâce aux différents champs de l'entité
  const filteredCustomers = customers.filter(
    (c) =>
      c.firstname.toLowerCase().includes(search.toLowerCase()) ||
      c.lastname.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
  );

  // Pagination des données (c'est ici qu'on récupère les cutomers à afficher)
  const paginatedCustomers = Pagination.getData(
    filteredCustomers,
    currentPage,
    itemsPerPages
  );

  return (
    <>
      <div className=" mb-3 d-flex justify-content-between align-items-center">
        <h1>Liste des clients</h1>
        <Link to="/customers/new" className="btn btn-primary">
          Créer un client
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
            <th>Id.</th>
            <th>Client</th>
            <th>Email</th>
            <th>Entreprise</th>
            <th className="text-center">Factures</th>
            <th className="text-center">Montant total</th>
            <th></th>
          </tr>
        </thead>
        {!loading && (
          <tbody>
            {paginatedCustomers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>
                  <Link to={"/customers/" + customer.id}>
                    {customer.firstname} {customer.lastname}
                  </Link>
                </td>
                <td>{customer.email}</td>
                <td>{customer.company}</td>
                <td className="text-center">
                  <span className="badge badge-light">
                    {customer.invoices.length}
                  </span>
                </td>
                <td className="text-center">
                  {customer.totalAmount.toLocaleString()} €
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(customer.id)}
                    disabled={customer.invoices.length > 0}
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

      {itemsPerPages < filteredCustomers.length && (
        <Pagination
          currentPage={currentPage}
          itemsPerPages={itemsPerPages}
          length={filteredCustomers.length}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
};

export default CustomersPage;
