import React from 'react';
import {
  Grid, Typography,Card,  CardContent,CardMedia
} from '@material-ui/core';
import { Link } from "react-router-dom";
import axios from 'axios';
import './userDetail.css';
import Mentioned from './Mentioned';
//import fetchModel from "../../lib/fetchModelData";

/**
 * Define UserDetail, a React componment of CS142 project #5
 */
class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      user:this.props.current_User,
    };
    // this.loaded =false;
  }

  componentDidMount = () => {
    let newUserId = this.props.match.params.userId;
    console.log(newUserId);
    axios.get(`/user/${newUserId}`)
    .then(response => {
      let newUser = response.data;
      this.setState({user:newUser});
      this.props.changeView(
        `${newUser.first_name} ${newUser.last_name}`
      );
    })
    .catch(error => {console.log(error);});

  };

  componentDidUpdate = () => {
    let newUserId = this.props.match.params.userId;
    if ((this.state.user && this.state.user._id) !== newUserId) {
      axios.get(`/user/${newUserId}`)
      .then(response => {
        let newUser = response.data;
        this.setState({user:newUser});
        this.props.changeView(
          `${newUser.first_name} ${newUser.last_name}`
        );
      })
      .catch(error => {console.log(error);}); 
    }

  };

  componentWillUnmount = () => {
    this.props.changeView("");
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

        <Typography variant="h5">
            Recent uploaded photo and most-commented photo
        </Typography>
        <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
          >
          <Grid item >
          {this.state.user.recentPhoto ? (
            <Card>
              <Link to={`/photos/${this.state.user.recentPhoto.owner_id}`}>
                <CardMedia
                  component="img"
                  height="100"
                  width="100"
                  image={`/images/${this.state.user.recentPhoto.file_name}`}
                />
              </Link>
              <CardContent>
                <Typography variant="caption">
                  Date:
                  {`${this.state.user.recentPhoto.date_time}`}
                </Typography>
              </CardContent>
            </Card>
            ): <div>None</div>
          }
          </Grid>
          <Grid item >
          {this.state.user.mostCommentsPhoto ? (
            <Card>
              <Link to={`/photos/${this.state.user.mostCommentsPhoto.owner_id}`}>
                <CardMedia
                  component="img"
                  height="100"
                  width="100"
                  image={`/images/${this.state.user.mostCommentsPhoto.file_name}`}
                />
              </Link>
              <CardContent>
                <Typography variant="caption">
                  Comments Count:
                  {`${this.state.user.mostCommentsPhoto.commentLength}`}
                </Typography>
              </CardContent>
            </Card>
            ) : <div> None</div>
          }
          </Grid>
        </Grid>
        <Typography variant="h5">
          Mentioned in:
        </Typography>
        {this.state.user.mentioned.length > 0 ? (
          this.state.user.mentioned.map((photoId,index) => {
            return <Mentioned key={photoId+index} photo_id={photoId}/>;
          })
        ) : <Typography>None</Typography>}
        
      </Grid>
    ) : <div/>;
  }
}

export default UserDetail;
