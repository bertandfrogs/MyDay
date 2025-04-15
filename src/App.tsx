import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Schedule from "./pages/Schedule";
import Login from "./pages/Login";
import Goals from "./pages/Goals";
import Habits from "./pages/Habits";
import Todo from "./pages/Todo";

function App() {
  return (
	<Router basename={import.meta.env.BASE_URL} >
		<Navigation></Navigation>
		<Routes>
			<Route index element={<Home/>} />
			<Route path="/" element={<Home/>} />
			<Route path="/schedule" element={<Schedule/>} />
			<Route path="/habits" element={<Habits/>} />
			<Route path="/todo" element={<Todo/>} />
			<Route path="/login" element={<Login/>} />
		</Routes>
	</Router>
  );
}

export default App;
