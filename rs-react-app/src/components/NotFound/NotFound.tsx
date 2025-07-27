import { NavLink } from 'react-router';

export default function NotFound() {
  return (
    <>
      <p>404 Not found</p>
      <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
        Home
      </NavLink>
    </>
  );
}
