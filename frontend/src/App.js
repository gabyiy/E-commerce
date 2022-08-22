import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from 'react-router-bootstrap';
import Container from 'react-bootstrap/Container';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import { useContext, useEffect, useState } from 'react';
import { Store } from './Store';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreem.';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { toast, ToastContainer } from 'react-toastify';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignUpScreen from './screens/SignUpScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import Button from 'react-bootstrap/esm/Button';
import { getError } from './utils';
import axios from 'axios';
import SearchBox from './components/SearchBox';
//Pentru a uploada la heroku trebuie scoase toate repositoarele de git din client si server si facut doar unu in folderu unde avem aplicatia

// pentru a schimba erroarea de la login importam npm i --force react-toastify

function App() {
  //iar asa scotem cart,userInfo din state, la useContext specificam de unde vrem sa primim datele
  //iar aici creem ctxDispachu
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  //creem handleru asta cand vrem sa facem signout
  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    //iar dupoa golim userInfo din browser si sheepingAddress  si paymentu
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    //asta facem ca sa anulam erroarea cand schimbam datele userului
    window.location.href = '/signin';
  };

  //astea le folosim pentru a arata sidebaru si categoriile
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  return (

    <BrowserRouter>
      {/* aici facem un turnary in functie daca sidebaru este true sau fals, si asa ne adauga sau scoate clasa active-cont */}
      <div
        className={
          sidebarIsOpen
            ? 'd-flex flex-column site-container active-cont'
            : 'd-flex flex-column site-container'
        }
      >
        {/* specifdicam sa ne arate cate 1 signur toatast */}
        <ToastContainer position="bottom-center" limit={1} />
        {/* acum putem folosi direct componentele din boostrap ca nume bineinteles instaland  
    npm install react-bootstrap bootstrap si npm i react-router-bootsrap */}
        <header>
          <Navbar bg="dark" variant="dark">
            <Container>
              {/* cu buttonu asta schimbam is open din true in fals si invers */}
              <Button
                variant="dark"
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              >
                <i className="fas fa-bars"></i>
              </Button>
              <LinkContainer to="/">
                <Navbar.Brand>E-commerce</Navbar.Brand>
              </LinkContainer>
              {/* acest nav il utilizam ca sa vedem cate produse adaugam in cart  */}
              <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id='basic-navbar nav'>
                <SearchBox/>
              <Nav className="me-auto w-100 justifi-content-end">
                <Link to="/cart" className="nav-link">
                  Cart
                  {/* iar aici facem logica ca daca avem in cart mai mult decat 0 sa ne arate cate avem ex 1 2 3 */}
                  {/* pentru a vedea cantitate folosim redeuce */}
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg="danger">
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </Badge>
                  )}
                </Link>
                {/* aici faceim o verifcare sa vedem daca avem userInfo  sau nu*/}
                {userInfo ? (
                  <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>User Profile</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/orderhistory">
                      <NavDropdown.Item>Order History</NavDropdown.Item>
                    </LinkContainer>

                    <NavDropdown.Divider />
                    <Link
                      className="dropdown-item"
                      to="#signout"
                      onClick={signoutHandler}
                    >
                      Sign Out
                    </Link>
                  </NavDropdown>
                ) : (
                  <Link className="nav-link" to="/signin">
                    Sign In
                  </Link>
                )}
              </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        {/* divu asta o sa ne arate sidebaru si folosim tureneru pentru a se activa sau nu in caz ca sidebarISOpen este true*/}
        <div
          className={
            sidebarIsOpen
              ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column '
              : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
          }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              {/* aici facem un map pentru ;a categorys si cu un link care o sa ne duca la cetogira respectiva */}
              <strong>Categories</strong>
              {categories.map((category) => (
                <Nav.Item key={category}>
                  <LinkContainer
                    to={`/search?category=${category}`}
                    onClick={() => setSidebarIsOpen(false)}
                  >
                    <Nav.Link>{category}</Nav.Link>
                  </LinkContainer>
                </Nav.Item>
              ))}
            </Nav.Item>
          </Nav>
        </div>
        <main>
          <Container className="mt-3">
            <Routes>
              {/* fiecare ruta trebuie sa aibe un path gen / care este home , si element ce pagina vrem sa vedem*/}
              {/* iar aici am definit o ruta care o sa ne arate o descriptie a fiefcarui produs
      iar la element o sa avem pagina care o sa ne arate produsu ala de forma dinamica
      asta este page ref cu :slug(referinta asta o vom utiliza in ProductScreen) */}
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/" element={<HomeScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="shipping" element={<ShippingAddressScreen />} />
              <Route path="/signup" element={<SignUpScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/order/:id" element={<OrderScreen />} />
              <Route path="/orderhistory" element={<OrderHistoryScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
            </Routes>
          </Container>
        </main>
        <footer>
          {/* aici utilizam clase din bootstrap */}
          <div className="text-center">All rights reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
