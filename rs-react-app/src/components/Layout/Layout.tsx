import { Outlet, NavLink } from 'react-router';
import Header from '../Header/Header';

const Layout = () => (
  <div className="wrapper-main">
    <Header />
    <div className="wrapper-nav-link">
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? 'nav-link active' : 'nav-link'
        }
      >
        Home
      </NavLink>
      <NavLink
        to="/about"
        className={({ isActive }) =>
          isActive ? 'nav-link active' : 'nav-link'
        }
      >
        About
      </NavLink>
    </div>
    <Outlet />
  </div>
);

export default Layout;
