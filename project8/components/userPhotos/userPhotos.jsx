import React from 'react';
import {
  IconButton, Grid,Card,  CardContent, CardHeader, CardMedia, CardActions,Typography,Button
} from '@material-ui/core';
import { Favorite, FavoriteBorder, ThumbUp,ThumbUpOutlined } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { MentionsInput, Mention } from 'react-mentions';
import axios from 'axios';
import './userPhotos.css';
import defaultStyle from "./defaultStyle";
import defaultMentionStyle from "./defaultMentionStyle";

const regdisplay = /@\[(\S+ \S+)( )*\]\(\S+\)/g;
/**
 * Define UserPhotos, a React componment of CS142 project #5
 */
class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comment:undefined,
      photos:undefined,
      mentionsToAdd:[],
      users: undefined,
      current_userId:undefined,
      favorite_ids:[]
    };
    this.userId = props.match.params.userId;
    this.liked=[];
  }

  componentDidMount = () => {
    // let userId = this.props.match.params.userId;
    axios.get(`/photosOfUser/${this.userId}`)
    .then(response => {
      this.setState({photos: response.data});
    })
    .catch(err => {console.error(err);});

    axios.get("/getFavorites")
    .then(response => {
      let favorite_ids = response.data.map(photo => photo._id);
      this.setState({ favorite_ids });
    })
    .catch((err) => {
      console.err(err.message);
      this.setState({ favorite_ids: [] });
    });

    axios.get("/current/user")
    .then(response => {
      this.setState({current_userId: response.data});
    })
    .catch(err => {console.error(err);});

    axios.get("/mentionlist")
    .then(response => {
      this.setState({users: response.data});
    })
    .catch(err => {console.log(err.response.data);});
  };

  refreshCards = () => {
    axios.get(`/photosOfUser/${this.userId}`)
    .then(response => {
      this.setState({photos:response.data});
    })
    .catch(err1 => {console.log(err1.response.data);});
    
    axios.get("/getFavorites")
    .then(response => {
      let favorite_ids = response.data.map(photo => photo._id);
      this.setState({ favorite_ids });
    })
    .catch((err) => {
      console.err(err.message);
      this.setState({ favorite_ids: [] });
    });
  };

  handleCommentChange = (event) => {
    this.setState({comment: event.target.value});
  };

  handleAddComment = (event, photo_id) => {
    event.preventDefault();
    axios.post(`/commentsOfPhoto/${photo_id}`, { comment: this.state.comment ,mentions:this.state.mentionsToAdd})
    .then(res => {
      console.log(res.data);
      this.setState({comment:"",mentionsToAdd:[]});
      this.refreshCards();
    })
    .catch(err => {console.log(err.response.data);});
  };

  handleLikeOrUnlike = (event,photo) => {
    event.preventDefault();
    axios.post(`/likeOrUnlike/${photo._id}`, {
        like: !(photo.liked.indexOf(this.state.current_userId) > -1) 
      })
    .then(() => {
        this.refreshCards();
    }).catch(err => console.error(err.message));
  };

  handleFavorite = (event, photo) => {
    event.preventDefault();
    axios.post(`/addFavorites`, { photo_id: photo._id })
    .then(() => {
      this.refreshCards();
    })
    .catch(err => {
      console.log(err.response);
    });
  };

  render() {
    return this.state.photos ? (
      <Grid container justify="space-evenly" alignItems="flex-start">
      {this.state.photos.sort((photo1, photo2) => (
        photo2.liked.length - photo1.liked.length || new Date(photo2.date_time) > new Date(photo1.date_time))
      ).map((photo) => {
        return (
          <Grid item xs={5} key={photo._id} >
            <Card>
            {/* <CardActionArea> */}
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

              <CardActions disableSpacing>
                <IconButton
                  disabled={this.state.favorite_ids.indexOf(photo._id) > -1}
                  aria-label="add to favorites"
                  onClick={(event) => this.handleFavorite(event,photo)}
                >
                  {(this.state.favorite_ids.indexOf(photo._id) > -1) ? (
                    <Favorite color="success" />
                  ) : (
                    <FavoriteBorder />
                  )}
                </IconButton>
                <IconButton aria-label="like" onClick={(event) => this.handleLikeOrUnlike(event,photo)}>
                    {(photo.liked.indexOf(this.state.current_userId) > -1) ? (
                    <ThumbUp color="primary" />
                    ) : (
                    <ThumbUpOutlined />
                    )}
                </IconButton>
                <Typography variant="h4" color="primary">
                    {photo.liked.length}
                </Typography>
              </CardActions>

              <CardContent>
                <form onSubmit={event => this.handleAddComment(event, photo._id)}>
                  <label>
                    <MentionsInput
                      value={this.state.comment}
                      onChange={this.handleCommentChange}
                      allowSuggestionsAboveCursor
                      style={defaultStyle}
                      placeholder={"Mention people using '@'"}
                      a11ySuggestionsListLabel={"Suggested mentions"}
                    >
                      <Mention
                        trigger="@"
                        data={this.state.users}
                        style={defaultMentionStyle}
                        displayTransform={(id, display) => {return `@${display}`;}}
                        onAdd={(id) => {
                          let mentions = this.state.mentionsToAdd;
                          mentions.push(id);
                          this.setState({mentionsToAdd:mentions});
                        }}
                      />
                    </MentionsInput>
                  </label>
                  <Button type="submit">Add Comment</Button>
                </form>
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
                      {/* {comment.comment} */}
                      {comment.comment.replace(
                          regdisplay,
                          (match, p1) => {
                            //p1 refers to the displayed name,
                            //p2 refers to the id
                            return `@${p1}`;
                          }
                        )}
                      </Typography>
                    </Grid>
                    );
                  }) : <div />}
              </CardContent>
            {/* </CardActionArea> */}
            </Card>
          </Grid>
        );})
      }
      </Grid>
    ) : <div/>;
  }
}

export default UserPhotos;