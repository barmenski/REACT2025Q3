import React from 'react';
import Logo from '../../assets/rick_and_morty_logo.png';

class Header extends React.Component {
  render() {
    return <img className="logo" src={Logo} alt={'Logo'} />;
  }
}

export default Header;
