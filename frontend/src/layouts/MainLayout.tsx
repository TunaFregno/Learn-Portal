import { Outlet, useLocation  } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import './MainLayout.css';

const MainLayout = () => {

  const location = useLocation();
  const noNavbarPaths = ['/']; 
  const shouldShowNavbar = !noNavbarPaths.includes(location.pathname);

  return (
    <>
      <div className="gradient"></div>
      {shouldShowNavbar && <Navbar />}
      <Outlet/>
    </>
  )
}

export default MainLayout
