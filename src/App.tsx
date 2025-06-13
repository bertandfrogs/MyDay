import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navigation from "./components/Navigation";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import Habits from "./pages/Habits";
import Todo from "./pages/Todo";
import Welcome from "./pages/Welcome";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";

function App() {
  return (
	<Router basename={import.meta.env.BASE_URL} >
		<Navigation></Navigation>
		<Routes>
			<Route index element={<Welcome/>} />
      <Route path="/welcome" element={<Welcome/>} />
      <Route path="/about" element={<About/>} />
      <Route path="/privacy" element={<Privacy/>} />
      <Route path="/contact" element={<Contact/>} />
			<Route path="/dashboard" element={<Dashboard/>} />
			<Route path="/calendar" element={<Calendar/>} />
			<Route path="/habits" element={<Habits/>} />
			<Route path="/todo" element={<Todo/>} />
		</Routes>
	</Router>
  );
}

export default App;
