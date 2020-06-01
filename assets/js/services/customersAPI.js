import axios from "axios";
import Cache from "./cache";
import { CUSTOMERS_API } from "../config";

//Cette fonction renvoie les customers de l'utilisateur connecté
function findAll() {
  /*const cachedCustomers = await Cache.get("customers");

  if (cachedCustomers) return cachedCustomers;*/
  return axios.get(CUSTOMERS_API).then((response) => {
    const customers = response.data["hydra:member"];
    //Cache.set("customers", customers);
    return customers;
  });
}

function findOne(id) {
  /*const cachedCustomers = await Cache.get("customers." + id);
  console.log(cachedCustomers);

  if (cachedCustomers) return cachedCustomers;*/

  return axios.get(CUSTOMERS_API + "/" + id).then((response) => {
    const customer = response.data;
    //Cache.set("customers." + id, customer);
    return customer;
  });
}

function update(id, customer) {
  axios.put(
    CUSTOMERS_API + "/" + id,
    customer
  ) /*.then(async (response) => {
    const cachedCustomers = await Cache.get("customers");
    const cachedCustomer = await Cache.get("customer." + id);
    if (cachedCustomer) {
      Cache.set("customers." + id, response.data);
    }
    if (cachedCustomers) {
      const index = cachedCustomers.findIndex((c) => c.id == id);
      const newCachedCustomer = response.data;
      cachedCustomers[index] = newCachedCustomer;
    }
    return response;
  })*/;
}

function create(customer) {
  axios.post(
    CUSTOMERS_API,
    customer
  ) /*.then(async (response) => {
    const cachedCustomers = await Cache.get("customers");
    if (cachedCustomers) {
      Cache.set("customers", [...cachedCustomers, response.data]);
    }
    return response;
  })*/;
}

function deleteCustomer(id) {
  return axios.delete(
    CUSTOMERS_API + "/" + id
  ) /*.then(async (response) => {
    const cachedCustomers = await Cache.get("customers");
    if (cachedCustomers) {
      Cache.set(
        "customers",
        cachedCustomers.filter((c) => c.id !== id)
      );
    }
    return response;
  })*/;
}

export default {
  findAll,
  delete: deleteCustomer,
  update,
  create,
  findOne,
};
