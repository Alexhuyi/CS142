import React from 'react';
import './Switch.css';

import States from "../states/States";
import Example from "../example/Example";

class Switch extends React.Component {
  constructor (props) {
      super(props);
      this.state = {
        view: "State",
      };
  }

  handleExampleClick = () => {
    this.setState({ view: "Example" });
  };

  handleStateClick = () => {
    this.setState({ view: "State" });
  };

  render () {
    let button;
    if (this.state.view === "State"){
      button = <button className='cs142-switch-button' onClick={this.handleExampleClick}>Switch to Example</button>;
    }
    else{
      button = <button className='cs142-switch-button' onClick={this.handleStateClick}>Switch to State</button>;
    }

    return (
      <div>
        {button}
        {this.state.view==="State" ? <States /> : <Example />}
      </div>
    );
  }
}

export default Switch;