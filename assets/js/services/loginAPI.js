import axios from 'axios';
import jwtDecode from 'jwt-decode';

function login(credentials) {
    return axios
        .post("http://localhost:8000/api/login_check", credentials)
        .then(response => response.data.token)
        .then(token => {
            // je stocke le token dans le localStorage
            window.localStorage.setItem("authToken", token)

            // on previent axios qu'on a un header pour toutes nos requêtes HTTP
            setAxiosToken(token);

            return true
        })
}

function logout() {
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}

function setAxiosToken(token){
    axios.defaults.headers["Authorization"] = "Bearer " + token
}

/**
 * Permet de récupérer le token
 */
function getToken(){
    return window.localStorage.getItem("authToken");
}
/**
 * Permet de vérifier si le token n'a pas expiré
 * @param token 
 */
function notExpiredToken(token){
    const {exp : expiration} = jwtDecode(token);
    if(expiration*1000 > new Date().getTime()){
        return true
    }
    return false
}

function setUp() {
    // Vérifier si on a un token
    const token = getToken();
    // Si le token est valide avec la date
    if(token){
        const {exp : expiration} = jwtDecode(token);
        if(expiration*1000 > new Date().getTime()){
            setAxiosToken(token);
        }
    }
}

function getRoles(){
    if(isAuthenticated){
        const token = getToken();
        if(token){
            const {roles} = jwtDecode(token);
            return roles;
        }
    }
    return [];
}

function isAuthenticated() {

    const token = getToken();
    // Si le token est valide avec la date
    if(token){
        const {exp : expiration} = jwtDecode(token);
        if(expiration*1000 > new Date().getTime()){
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
    getRoles
}