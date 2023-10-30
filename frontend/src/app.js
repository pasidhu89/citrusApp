import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import HomeScreen from '../SCREENS/HomeScreen';
import ProductScreen from '../SCREENS/ProductScreen';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { Store } from './Store';
import CartScreen from './SCREENS/CartScreen';
import SigninScreen from '../SCREENS/SigninScreen';
import ShippingAddressScreen from './SCREENS/ShippingAddressScreen';
import SignupScreen from '../SCREENS/SignupScreen';
import PaymentMethodScreen from './SCREENS/PaymentMethodScreen';
import PlaceOrderScreen from './SCREENS/PlaceOrderScreen';
import OrderScreen from './SCREENS/OrderScreen';
import OrderHistoryScreen from './SCREENS/OrderHistoryScreen';
import ProfileScreen from '../SCREENS/ProfileScreen';
import Button from 'react-bootstrap/Button';
import { getError } from './utils';
import axios from 'axios';
import SearchBox from './components/SearchBox';
import SearchScreen from '../SCREENS/SearchScreen';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardScreen from '../SCREENS/DashboardScreen';
import AdminRoute from './components/AdminRoute';
import ProductListScreen from '../SCREENS/ProductListScreen';
import ProductEditScreen from '../SCREENS/ProductEditScreen';
import OrderListScreen from './SCREENS/OrderListScreen';
import UserListScreen from '../SCREENS/UserListScreen';
import UserEditScreen from '../SCREENS/UserEditScreen';
import MapScreen from './SCREENS/MapScreen';
import TreatmentListScreen from '../SCREENS/TreatmentListScreen';
import TreatmentEditScreen from '../SCREENS/TreatmentEditScreen';
import TreatmentCreateScreen from '../SCREENS/TreatmentCreateScreen';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { fullBox, cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };
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
    

      <div
        className={
          sidebarIsOpen
            ? fullBox
              ? 'site-container active-cont d-flex flex-column full-box'
              : 'site-container active-cont d-flex flex-column'
            : fullBox
            ? 'site-container d-flex flex-column full-box'
            : 'site-container d-flex flex-column'
        }
      >
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar bg="light" variant="light" expand="lg">
            <Container>
           
              <Button
                variant="light"
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              >
                <i className="fas fa-bars"></i>
              </Button>
              
              
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <SearchBox />

                <div style={{ paddingLeft: '40px' }}>
                <LinkContainer to="/">
                <Navbar.Brand>HOME</Navbar.Brand>
                </LinkContainer>
                </div>

                <Nav className="me-auto  w-100  justify-content-end">
                  {userInfo ? (
                    <NavDropdown title={userInfo.name} id="basic-nav-dropdown" >
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>User Profile</NavDropdown.Item>
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
                  {userInfo && userInfo.isAdmin && (
                    <NavDropdown title="admin" id="admin-nav-dropdown">
                      
                      <LinkContainer to="/admin/products">
                        <NavDropdown.Item>Add post</NavDropdown.Item>
                      </LinkContainer>
                      {/* <LinkContainer to="/admin/orders">
                        <NavDropdown.Item>Add order</NavDropdown.Item>
                      </LinkContainer> */}
                      <LinkContainer to="/admin/treatments">
                        <NavDropdown.Item>Add Tratments</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/users">
                        <NavDropdown.Item>Users</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>

          <br />



        </header>
        <div
  className={`side-navbar d-flex justify-content-between flex-wrap flex-column ${sidebarIsOpen ? 'active-nav' : ''}`}
  style={{
    backgroundColor: 'black', // Change the background color
    padding: '20px', // Add some padding
  }}
>
  <Nav className="flex-column text-white w-100">
   
 


    {userInfo && userInfo.isAdmin && (
      <div>
        
        <h4 style={{ color: 'white', margin: '10px 0' }}>Admin Panel</h4>
        
        <LinkContainer to="/admin/products">
          <Nav.Link style={{ color: 'red', margin: '5px 0' }} onClick={() => setSidebarIsOpen(false)}>Add Post</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/admin/treatments">
          <Nav.Link style={{ color: 'red', margin: '5px 0' }} onClick={() => setSidebarIsOpen(false)}>Add Treatment</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/admin/users">
          <Nav.Link style={{ color: 'red', margin: '5px 0' }} onClick={() => setSidebarIsOpen(false)}>Users</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/home">
          <Nav.Link style={{ color: 'red', margin: '5px 0' }} onClick={() => setSidebarIsOpen(false)}>Posts</Nav.Link>
        </LinkContainer>
      </div>
    )}
  </Nav>
</div>

        <main >
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/map"
                element={
                  <ProtectedRoute>
                    <MapScreen />
                  </ProtectedRoute>
                }
              />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/orderhistory"
                element={
                  <ProtectedRoute>
                    <OrderHistoryScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/shipping"
                element={<ShippingAddressScreen />}
              ></Route>
              <Route path="/payment" element={<PaymentMethodScreen />}></Route>
              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <OrderListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UserListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <ProductListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/product/:id"
                element={
                  <AdminRoute>
                    <ProductEditScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/user/:id"
                element={
                  <AdminRoute>
                    <UserEditScreen />
                  </AdminRoute>
                }
              >

              </Route>


                  <Route 
                      path="admin/treatments" 
                      element={
                    <AdminRoute>
                        <TreatmentListScreen />
                    </AdminRoute>
                               } 
                  ></Route>

<Route path="/admin/treatments/create" element={
 <AdminRoute>
<TreatmentCreateScreen />
</AdminRoute>
} />
<Route path="/admin/treatments/:id" element={
<AdminRoute>
<TreatmentEditScreen />
</AdminRoute>
} />



<Route path="/home" element={<HomeScreen />} />
           


<Route path="/" element={<DashboardScreen />} />
              
            </Routes>
          </Container>
        </main>
        <footer>
          
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
