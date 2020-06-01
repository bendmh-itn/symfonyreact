import axios from "axios";
import jwtDecode from "jwt-decode";
import { LOGIN_API } from "../config";

/**
 * Au moment de la connexion on passe les credentials, on ajoute ce token au localStorage et on donne à axios ce token pour la suite des requetes
 * @param {object} credentials
 */
function login(credentials) {
  return axios
    .post(LOGIN_API, credentials)
    .then((response) => response.data.token)
    .then((token) => {
      // je stocke le token dans le localStorage
      window.localStorage.setItem("authToken", token);

      // on previent axios qu'on a un header pour toutes nos requêtes HTTP
      setAxiosToken(token);

      return true;
    });
}
/**
 * Suppression du token dans le localStorage et dans axios
 */
function logout() {
  window.localStorage.removeItem("authToken");
  delete axios.defaults.headers["Authorization"];
}
/**
 * On ajoute le token a axios pour toutes les requetes suivantes
 * @param {string} token
 */
function setAxiosToken(token) {
  axios.defaults.headers["Authorization"] = "Bearer " + token;
}

/**
 * Permet de récupérer le token
 */
function getToken() {
  return window.localStorage.getItem("authToken");
}
/**
 * Permet de vérifier si le token n'a pas expiré
 * @param token
 */
function notExpiredToken(token) {
  const { exp: expiration } = jwtDecode(token);
  if (expiration * 1000 > new Date().getTime()) {
    return true;
  }
  return false;
}

/**
 * On vérifie si le est encore valide au moment du chargement de la page
 */
function setUp() {
  // Vérifier si on a un token
  const token = getToken();
  // Si le token est valide avec la date
  if (token) {
    const { exp: expiration } = jwtDecode(token);
    if (expiration * 1000 > new Date().getTime()) {
      setAxiosToken(token);
    }
  }
}

/**
 * Permet de récupérer les rôles. Permet d'afficher des onglets supplémentaires dans la navbar
 */
function getRoles() {
  if (isAuthenticated) {
    const token = getToken();
    if (token) {
      const { roles } = jwtDecode(token);
      return roles;
    }
  }
  return [];
}

/**
 * Permet de vérifier si on est authentifié ou pas
 */
function isAuthenticated() {
  const token = getToken();
  // Si le token est valide avec la date
  if (token) {
    const { exp: expiration } = jwtDecode(token);
    if (expiration * 1000 > new Date().getTime()) {
      return true;
    }
    return false;
  }
}

export default {
  login,
  logout,
  setUp,
  isAuthenticated,
  getRoles,
};
