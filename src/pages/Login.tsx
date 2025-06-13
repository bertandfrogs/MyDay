import { useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FirebaseManager from "../managers/FirebaseManager";


function Login() {
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();
  const firebaseManager = new FirebaseManager();

  const passwordRegEx = new RegExp(/(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}/);

  const isValidPassword = () => {
    return passwordRegEx.test(password);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    let successful = false;

    if (form.checkValidity() === false || (isCreatingAccount && !isValidPassword())) {
      event.preventDefault();
      event.stopPropagation();
    }
    else {
      successful = true;
    }

    setValidated(true);

    if (successful) {
      navigate("/");
    }
  };

  const handleGoogleLogin = () => {
    firebaseManager.signInFirebase();
  }

  return (
    <Container className="login mt-4" style={{ maxWidth: "500px" }}>
      <h1>
        {isCreatingAccount ? "Create Account" : "Login"}
      </h1>
      <Button className="google-login" onClick={handleGoogleLogin}>Login with Google</Button>
      <Card className="p-4 shadow-sm mt-3">
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          {isCreatingAccount ? (
            <>
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" required />
                <Form.Control.Feedback type="invalid">
                  Please enter a valid email.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formNewPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Create a password"
                  isValid={isValidPassword()}
                  isInvalid={!isValidPassword()}
                  required
                />
                <Form.Text>
                  Password must be at least 8 characters long and must contain
                  one or more lowercase letter, uppercase letter, and number.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                Create Account
              </Button>
            </>
          ) : (
            <>
              <Form.Group className="mb-3" controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" required />
              </Form.Group>
              
              <Button variant="primary" type="submit" className="w-100">
                Login
              </Button>
            </>
          )}
        </Form>

        <div className="text-center mt-3">
          <small className="text-muted">
            {isCreatingAccount
              ? "Already have an account?"
              : "Don't have an account?"}
          </small>
          <Button
            variant="link"
            size="sm"
            onClick={() => setIsCreatingAccount(!isCreatingAccount)}
          >
            {isCreatingAccount ? "Log In" : "Create Account"}
          </Button>
        </div>
      </Card>
    </Container>
  );
}

export default Login;
