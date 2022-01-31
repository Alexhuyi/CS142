import React from 'react';
import './States.css';

/**
 * Define States, a React componment of CS142 project #4 problem #2.  The model
 * data for this view (the state names) is available
 * at window.cs142models.statesModel().
 */
class States extends React.Component {
  constructor(props) {
    super(props);
    console.log('window.cs142models.statesModel()', window.cs142models.statesModel());
    this.state = {
      stateslist:window.cs142models.statesModel(),
      substring: '',
    };
  }

  handleStringChange = event => {
    this.setState({ substring: event.target.value });
  };

  render() {
    let results = this.state.stateslist.filter((state) => state.toLowerCase()
    .includes(this.state.substring.toLowerCase()));
    results = results.sort(function (a, b) 
    {return a.toLowerCase().localeCompare(b.toLowerCase());});
    let output = results.map((state) => <li key={state}>{state}</li>);
    return (
      <div>
        <div>
          Substring:
          <input id="inId" type="text" value={this.state.substring} onChange={this.handleStringChange} />
        </div>
        <div className='cs142-states-output'>
        <span>States that have {this.state.substring}:</span>
        <ul>
          {output.length ===0 ? "No states matched!!" : output}
        </ul>
        </div>
      </div>
    );
  }
}

export default States;
