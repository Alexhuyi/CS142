import React from "react";
import { Card, CardMedia, CardContent } from "@material-ui/core";
import { Link } from "react-router-dom";
import axios from 'axios';

class Mentioned extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photo: undefined
    };
  }

  componentDidMount = () => {
    let photo_id = this.props.photo_id;
    axios.get(`/photo/${photo_id}`)
    .then(response => {
        this.setState({ photo: response.data });
    })
    .catch(err => {
        console.log(err);
    });
  };

  render() {
    return this.state.photo ? (
      <Card>
        <Link to={`/photos/${this.state.photo.owner_id}`}>
          <CardMedia
            component="img"
            height="100"
            width="100"
            image={`/images/${this.state.photo.file_name}`}
          />
        </Link>
        <CardContent>
            Photo owner:
            <Link to={`/users/${this.state.photo.owner_id}`}>
            {`${this.state.photo.owner_first_name} ${this.state.photo.owner_last_name}`}
            </Link>
        </CardContent>
      </Card>
    ) : null;
  }
}
export default Mentioned;