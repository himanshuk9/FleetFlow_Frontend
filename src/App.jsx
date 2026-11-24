
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import Home from "./pages/Home";
import Vehicles from "./pages/Vehicles";
import Drivers from "./pages/Drivers";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import ShowRides from "./pages/ShowRides";
import BookRide from "./pages/BookRide";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        {" | "}
      </nav>
   
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} />

        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/book-ride" element={<BookRide/>} />
        <Route
          path="/UserDashboard"
          element={<UserDashboard />}
        />
        <Route
          path="/driver-dashboard"
          element={<DriverDashboard />}
        />
        <Route path="/rides" element={<ShowRides />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
