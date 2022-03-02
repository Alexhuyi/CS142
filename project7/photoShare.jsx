import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter, Route, Switch, Redirect
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
import LoginRegister from "./components/LoginRegister/LoginRegister";

class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: "Welcome to the photosharing app!",
      current_User: undefined
    };
  }

  changeView = (newView) => {
    this.setState({ view: newView});
  };

  changeLoggedIn = (newUser) => {
    this.setState({current_User:newUser});
  };

  render() {
    
    return (
      <HashRouter>
      <div>
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <TopBar changeLoggedIn={this.changeLoggedIn} current_User={this.state.current_User} view={this.state.view}/>
        </Grid>
        <div className="cs142-main-topbar-buffer"/>
        <Grid item sm={3}>
          <Paper className="cs142-main-grid-item">
            {this.state.current_User ? <UserList /> : <div/>}
          </Paper>
        </Grid>
        <Grid item sm={9}>
          <Paper className="cs142-main-grid-item">
            <Switch>
              <Route path="/login-register" render={ props => (
                <LoginRegister {...props} changeLoggedIn={this.changeLoggedIn} /> 
                )}
              />
              {this.state.current_User ? (
                  <Route 
                    path="/users/:userId"
                    render={ props => (
                      <UserDetail 
                        {...props} 
                        changeView={this.changeView} />
                      )}
                  />
                ) :(
                  <Redirect to="/login-register" />
              )}
              {this.state.current_User ? (
                  <Route 
                    path="/photos/:userId"
                    render ={ props => (
                      <UserPhotos 
                        {...props} 
                        changeView={this.changeView} />
                      )}
                  />
              ) : (
                  <Redirect to="/login-register" />
              )}
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
