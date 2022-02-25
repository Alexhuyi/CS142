import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter, Route, Switch
} from 'react-router-dom';
import {
  Grid, Paper
} from '@material-ui/core';
import './styles/main.css';

// import necessary components
import TopBar from './components/topBar/TopBar';
import UserDetail from './components/userDetail/userDetail';
import UserList from './components/userList/userList';
import UserPhotos from './components/userPhotos/userPhotos';
//import axios from 'axios';

class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: "Welcome to the photosharing app!"
    };
    // this.changeView = this.changeView.bind(this);
  }

  changeView = (newView) => {
    this.setState({ view: newView});
  };

  // componentDidMount = () => {
  //   axios.get("http://localhost:3000/test/info")
  //   .then((response) => {
  //     this.setState({ version: response.data.__v});
  //     this.changeView("Welcome to the photosharing app!");
  //   })
  //   .catch((error) => {console.log(error);});
  // }

  // componentDidUpdate = (prevProps) => {
  //   if (prevProps.view !== this.props.view) {
  //     //this.setState({ view: this.props.view });
  //     axios.get("http://localhost:3000/test/info")
  //     .then((response) => {
  //       this.setState({ version: response.data.__v,view: this.props.view });
  //     })
  //     .catch((error) => {console.log(error);});
  //   }
  // };

  render() {
    return (
      <HashRouter>
      <div>
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <TopBar changeView={this.changeView} view={this.state.view}/>
        </Grid>
        <div className="cs142-main-topbar-buffer"/>
        <Grid item sm={3}>
          <Paper className="cs142-main-grid-item">
            <UserList changeView={this.changeView}/>
          </Paper>
        </Grid>
        <Grid item sm={9}>
          <Paper className="cs142-main-grid-item">
            <Switch>
              <Route path="/users/:userId"
                render={ props => <UserDetail {...props} changeView={this.changeView} /> }
              />
              <Route path="/photos/:userId"
                render ={ props => <UserPhotos {...props} changeView={this.changeView} /> }
              />
              <Route path="/users" component={UserList}  />
            </Switch>
          </Paper>
        </Grid>
      </Grid>
      </div>
      </HashRouter>
    );
  }
}


ReactDOM.render(
  <PhotoShare />,
  document.getElementById('photoshareapp'),
);
