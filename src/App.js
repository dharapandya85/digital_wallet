import React,{useState,useEffect} from "react";
import {BrowserRouter as Router,Routes,Route,Link} from 'react-router-dom';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/home";
import 'bootstrap/dist/css/bootstrap.min.css';
import Transaction from './pages/transaction';
import {Navbar,Nav,Container,NavDropdown} from "react-bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  const [isOpen,setIsOpen]=useState(false);
  const [user,setUser]=useState(null);
  const toggleMenu=()=>{
    setIsOpen(!isOpen);
  };
  useEffect(()=>{
    const storedUser=JSON.parse(localStorage.getItem('user'));
    if(storedUser){
      setUser(storedUser);
    }
},[]);
const handleLogout=()=>{
  localStorage.removeItem('user');
  setUser(null);
};

  return (
    <div >
    <Router>
    <div>
    <Navbar bg="primary" variant="dark" expand="md" sticky="top">
    <Container>
    <Navbar.Brand as={Link} to="/">Fast-Pay</Navbar.Brand>
    <Navbar.Toggle aria-controls="navbar-nav"/>
    <Navbar.Collapse id="navbar-nav">
    <Nav className="ml-auto">
    {user?(
      <>
      <Nav.Link as={Link} to="/transaction">Home</Nav.Link>
      <NavDropdown title={<><i className="bi-bi-person-circle">
        </i>{user.email}</>}
        id="nav-dropdown">
        <NavDropdown.Item onClick={handleLogout}>Logout
        </NavDropdown.Item>
        </NavDropdown>
      </>
      ):(
      <>
      <Nav.Link as={Link} to="/login">Login</Nav.Link>
      <Nav.Link as={Link} to="/signup">SignUp</Nav.Link>
      </>
    )}
    </Nav>
    </Navbar.Collapse>
    </Container>
    </Navbar>
      <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/transaction" element={<Transaction/>}/>
      </Routes>
    </div>
    </Router>
    </div>
  );
}

export default App;
