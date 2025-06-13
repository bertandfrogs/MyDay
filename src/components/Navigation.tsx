import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppData } from "../AppDataContext";

function Navigation() {
  const { dataManager, currentUser, setCurrentUser } = useAppData();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    await dataManager
      .signIn()
      .then((user) => {
        if (user) {
          setCurrentUser(user);
        }
      })
      .then(async () => {
        await navigate("/dashboard");
      });
  };

  const handleGoogleLogout = async () => {
    await dataManager
      .signOut()
      .then(() => {
        setCurrentUser(null);
      })
      .then(async () => {
        await navigate("/");
      });
  };

  return (
    <Navbar className="mb-3" expand="md">
      <Container>
        <NavLink className="nav-link brand" to="/">
          <Navbar.Brand>
            {/* <svg className="myday-logo" href="../assets/MyDay.svg"></svg> */}
            <i className="bi bi-pencil-square pe-3"></i>
            MyDay
          </Navbar.Brand>
        </NavLink>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {currentUser ? (
            <Nav className="ms-auto">
              <NavLink className="nav-link" to="/dashboard">
                Dashboard
              </NavLink>
              <NavLink className="nav-link" to="/calendar">
                Calendar
              </NavLink>
              <NavLink className="nav-link" to="/habits">
                Habits
              </NavLink>
              <NavLink className="nav-link" to="/todo">
                To-Do
              </NavLink>
              <NavDropdown className="ms-3" title={<i className="bi bi-question-circle"></i>}>
                <NavLink className="nav-link" to="/about">
                  About
                </NavLink>
                <NavLink className="nav-link" to="/privacy">
                  Privacy
                </NavLink>
                <NavLink className="nav-link" to="/contact">
                  Contact
                </NavLink>
              </NavDropdown>
            </Nav>
          ) : (
            <Nav className="ms-auto">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
              <NavLink className="nav-link" to="/about">
                About
              </NavLink>
              <NavLink className="nav-link" to="/privacy">
                Privacy
              </NavLink>
              <NavLink className="nav-link" to="/contact">
                Contact
              </NavLink>
            </Nav>
          )}
          <Nav className="ms-auto">
            {currentUser ? (
              <div className="account">
                <div className="user">
                  {currentUser && currentUser.photoURL && (
                    <img className="user-img" src={currentUser.photoURL} referrerPolicy="no-referrer"></img>
                  )}
                  <div className="user-name">{currentUser.displayName}</div>
                </div>
                <Button className="bg-accent" onClick={handleGoogleLogout}>
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
