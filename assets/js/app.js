/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

//les imports importants
import React, {useState, useContext} from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Switch, Route, withRouter } from "react-router-dom"
 
// any CSS you import will output into a single css file (app.css in this case)
import '../css/app.css'
import NavBar from './components/Navbar'
import HomePage from './pages/HomePage'
import CustomersPage from './pages/CustomersPage'
import CustomersPageWithPagination from './pages/CustomersPageWithPagination'
import InvoicesPage from './pages/InvoicesPage'
import LoginPage from './pages/LoginPage'
import LoginAPI from './services/loginAPI'
import AuthContext from './contexts/authContext'
import PrivateRoute from './components/PrivateRoute'
import loginAPI from './services/loginAPI'
import CustomerPage from './pages/CustomerPage'
import InvoicePage from './pages/InvoicePage'
import RegisterPage from './pages/RegisterPage'

// Need jQuery? Install it with "yarn add jquery", then uncomment to import it.
// import $ from 'jquery';

LoginAPI.setUp();
    

const App = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(LoginAPI.isAuthenticated())
    const [roles, setRoles] = useState(loginAPI.getRoles())

    const NavBarWithRouter = withRouter(NavBar);

    return (
        <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated, roles, setRoles}}>
            <HashRouter>
                <NavBarWithRouter />

                <main className="container pt-5">
                    <Switch>
                        <Route path="/login" component={LoginPage} />
                        <Route path="/register" component={RegisterPage} />
                        <PrivateRoute path="/invoices/:id" component={InvoicePage} />
                        <PrivateRoute path="/invoices" component={InvoicesPage} />
                        <PrivateRoute path="/customers/:id" component={CustomerPage} />
                        <PrivateRoute path="/customers" component={CustomersPage} />
                        <Route path="/" component={HomePage} />
                    </Switch>
                </main>
            </HashRouter>
        </AuthContext.Provider>
    )
}

const rootElement = document.querySelector('#app');
ReactDOM.render(<App />, rootElement);