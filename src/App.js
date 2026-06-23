import logo from './logo.svg';
import './App.css';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Stack, Container, Card, Row, Col, Dropdown } from 'react-bootstrap';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Added Link here
import Weather_Forecast from './pages/Weather_Forecast';

// Temporary placeholder for the Demographic page
const Demographic = () => <Container className="mt-4"><h2>Coming Soon</h2></Container>;

function App() {
  return (
    <Router>
      {/* Navigation Bar */}
      <Navbar expand="lg" className="bg-success text-white navigation-bar">
        <Container>
          <Navbar.Brand className="text-white"  as={Link} to="/">Track Philippines</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {/* as={Link} prevents full page reloads */}
              <Nav.Link className="text-white" as={Link} to="/">Weather</Nav.Link>
              <Nav.Link className="text-white" as={Link} to="/demographic">Demographic</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Page Content Routes */}
      <Routes>
        <Route path="/" element={<Weather_Forecast />} />
        <Route path="/demographic" element={<Demographic />} />
      </Routes>
    </Router>
  );
}

export default App;
