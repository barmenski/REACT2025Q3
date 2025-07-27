import { NavLink } from 'react-router';

export default function About() {
  return (
    <>
      <ul>
        <li></li>
        <a
          href="https://github.com/barmenski"
          target="_blank"
          rel="noopener noreferrer"
        >
          Author: Alexandr Bondar (@barmenski)
        </a>
        <li></li>
        <a
          href="https://github.com/rolling-scopes-school/tasks/blob/master/react"
          target="_blank"
          rel="noopener noreferrer"
        >
          RS School. React.
        </a>
      </ul>
      <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
        Home
      </NavLink>
    </>
  );
}
