import React from 'react';
import {
  Grid, Typography
} from '@material-ui/core';
import { Link } from "react-router-dom";
import './userDetail.css';
import fetchModel from "../../lib/fetchModelData";

/**
 * Define UserDetail, a React componment of CS142 project #5
 */
class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      user:undefined
    };
    let newUserId = props.match.params.userId;
    console.log(newUserId);
    let promise = fetchModel(`http://localhost:3000/user/${newUserId}`);
    promise.then(response => {
      let newUser = response.data;
      this.setState({user:newUser});
      this.props.changeView(
        `${newUser.first_name} ${newUser.last_name}`
      );
    });
  }

  componentDidUpdate = () => {
    let newUserId = this.props.match.params.userId;
    if ((this.state.user && this.state.user._id) !== newUserId) {
      let promise = fetchModel(`http://localhost:3000/user/${newUserId}`);
      promise.then(response => {
        let newUser = response.data;
        this.setState({user:newUser});
        this.props.changeView(
          `${newUser.first_name} ${newUser.last_name}`
        );
      });
    }
  };

  render() {
    return this.state.user ? (
      <Grid
      container
      direction="column"
      justify="space-between"
      alignItems="flex-start"
      >
        <Typography variant="h3" color="inherit">
          {`${this.state.user.first_name} ${this.state.user.last_name}`}
        </Typography>
        <Typography variant="h5">
          Occupation: {`${this.state.user.occupation}`}
        </Typography>
        <Typography variant="h5">
          Location: {`${this.state.user.location}`}
        </Typography>
        <Typography variant="body1">
          Description: {`${this.state.user.description}`}
        </Typography>
        <Typography variant="h3">
          <Link to={`/photos/${this.state.user._id}`}>Photos</Link>
        </Typography>
      </Grid>
    ) : <div/>;
  }
}

export default UserDetail;
