import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useAppData } from "../AppDataContext";
import { useState } from "react";

function Navigation() {
  let firebase = useAppData().firebaseManager;
  let user = firebase.auth.currentUser;
  let [currentUser, setCurrentUser] = useState(user)

  const handleGoogleLogin = async () => {
    let cred = await firebase.signIn();
    if (cred) {
      setCurrentUser(cred.user);
    }
  };

  const handleLogout = async () => {
    firebase.signOut();
    setCurrentUser(null);
  };

  return (
    <Navbar className="mb-3" expand="md">
      <Container>
        <NavLink className="nav-link brand" to="/">
          <Navbar.Brand>
            <i className="bi bi-pencil-square pe-3"></i>
            MyDay
          </Navbar.Brand>
        </NavLink>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <NavLink className="nav-link" to="/">
              Home
            </NavLink>
            <NavLink className="nav-link" to="/schedule">
              Schedule
            </NavLink>
            <NavLink className="nav-link" to="/habits">
              Habits
            </NavLink>
            <NavLink className="nav-link" to="/todo">
              To-Do
            </NavLink>
          </Nav>
          <Nav className="ms-auto">
            {currentUser ? (
              <div className="account">
                <div className="user">
                  {currentUser.photoURL && (
                    <img className="user-img" src={currentUser.photoURL}></img>
                  )}
                  <div className="user-name">{currentUser.displayName}</div>
                </div>
                <Button className="bg-accent" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Button className="bg-accent" onClick={handleGoogleLogin}>
                Login with Google
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
