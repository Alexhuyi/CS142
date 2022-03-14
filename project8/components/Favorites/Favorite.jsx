import React from "react";
import {Dialog, DialogTitle, DialogContent, Card, CardHeader,CardMedia,IconButton} from "@material-ui/core";
import { Clear } from "@material-ui/icons";
import axios from "axios";


class Favorite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
  }

  handleDeleteFavorite = (event) => {
    event.preventDefault();
    axios.get(`/deleteFavorite/${this.props.photo._id}`)
    .then(() => {this.props.refreshCards();})
    .catch(err => {console.error(err.message);});
  };

  handleOpenModal = () => {
    this.setState({ showModal: true });
  };
  
  handleCloseModal = () => {
    this.setState({ showModal: false });
  };


  render() {
    return (
      <div>
        <Card>
          <CardHeader
            action={(
              <IconButton onClick={event => this.handleDeleteFavorite(event)}>
                <Clear />
              </IconButton>
            )}
          />
          <CardMedia
            component="img"
            image={`/images/${this.props.photo.file_name}`}
            onClick={this.handleOpenModal}
          />
        </Card>
        <Dialog
          onClose={this.handleCloseModal}
          aria-labelledby="customized-dialog-title"
          open={this.state.showModal}
        >
          <DialogTitle onClose={this.handleCloseModal}>
            {this.props.photo.date_time}
          </DialogTitle>
          <DialogContent>
            <img
              className="modal-image"
              src={`/images/${this.props.photo.file_name}`}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default Favorite;