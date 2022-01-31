import React from 'react';
import './Header.css';

class Header extends React.Component {
  constructor (props) {
      super(props);
  }

  render() {
      return (
          <div className='cs142-header-container'>
              <img className='cs142-header-selfie' src='./components/header/selfie.png'/>
              <div className='cs142-header-affiliation' >Yi Hu</div>
              <div className='cs142-header-affiliation'>Stanford University</div>
              <div className='cs142-header-affiliation'>Materials Science and Engineering</div>
          </div>
      );
  }
}

export default Header;