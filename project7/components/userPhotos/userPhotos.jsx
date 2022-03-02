import React from 'react';
import {
  Grid,Card,  CardContent, CardHeader, CardMedia,CardActionArea, Typography,Input, TextField
} from '@material-ui/core';
import { Link } from "react-router-dom";
import './userPhotos.css';
//import fetchModel from "../../lib/fetchModelData";
import axios from 'axios';

/**
 * Define UserPhotos, a React componment of CS142 project #5
 */
class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comment:undefined,
      photos:undefined
    };
  }

  componentDidMount = () => {
    let userId = this.props.match.params.userId;
    axios.get(`http://localhost:3000/photosOfUser/${userId}`)
    .then(response => {
      this.setState({photos: response.data});
    })
    .catch(err => {console.error(err);});
  };

  handleCommentChange = (event) => {
    this.setState({comment: event.target.value});
  };

  handleAddComment = (event, photo_id) => {
    axios.post(`/commentsOfPhoto/${photo_id}`, { comment: this.state.comment })
    .then(res => {
      console.log(res.data);
      axios.get(`/photosOfUser/${this.props.match.params.userId}`)
      .then(response => {
        this.setState({photos:response.data,comment:""});
      })
      .catch(err1 => {console.log(err1.response.data);});
    })
    .catch(err => {console.log(err.response.data);});
  };
  // componentWillUnmount = () => {
  //   this.props.changeView("");
  // };
  
  // componentDidUpdate = (prevProps) => {
  //   let newUserID = this.props.match.params.userId;
  //   if (prevProps.match.params.userId !== newUserID) {
  //     let userId = this.props.match.params.userId;
  //     axios.get(`http://localhost:3000/photosOfUser/${userId}`)
  //     .then(response => {
  //       this.setState({photos: response.data});
  //     })
  //     .catch(err => {console.error(err);});
  
  //     axios.get(`http://localhost:3000/user/${userId}`)
  //     .then(response => {
  //       this.setState({user: response.data});
  //       this.props.changeView(`Photos of ${this.state.user.first_name} ${this.state.user.last_name}`);
  //     })
  //     .catch(err => {console.log(err);});
  //   }
  // };

  render() {
    return this.state.photos ? (
      <Grid container justify="space-evenly" alignItems="flex-start">
      {this.state.photos.map((photo) => {
        return (
          <Grid item xs={5} key={photo._id}>
            <Card>
            <CardActionArea>
              <CardHeader
              title={`${photo.file_name}`}
              subheader={`Creation Time: ${photo.date_time}`}
              />
              <CardMedia
                component="img"
                height="200"
                width="200"
                image={`./images/${photo.file_name}`}
                alt="green iguana"
              />
              <CardContent>
                {photo.comments ? photo.comments.map((comment) => {
                  return (
                    <Grid container direction="column" key={comment._id}>
                      <Typography variant="body2" color="inherit">
                      {comment.date_time}  
                      </Typography>
                      <Typography variant="body2" color="inherit">
                        <Link to={`/users/${comment.user._id}`}>
                          {`${comment.user.first_name} ${comment.user.last_name}`}
                        </Link>
                      </Typography>
                      <Typography variant="body2" color="secondary">
                      {comment.comment}
                      </Typography>
                    </Grid>
                    );
                  }) : <div />}
                  <form onSubmit={event => this.handleAddComment(event, photo._id)}>
                    <label>
                      <TextField 
                        type="text"
                        label="add comment"
                        id={photo._id}
                        onChange={this.handleCommentChange}
                      />
                    </label><br />
                    <Input type="submit" value="Add Comment" />
                  </form>
              </CardContent>
            </CardActionArea>
            </Card>
          </Grid>
        );})
      }
      </Grid>
    ) : <div/>;
  }
}

export default UserPhotos;
