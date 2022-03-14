import React from "react";
import { Typography, Grid} from "@material-ui/core";
import axios from "axios";
import Favorite from "./Favorite";
/**
 * Define Favorites
 */
class Favorites extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      favorites: [],
    //   showModal:false
    };
  }

  componentDidMount = () => {
      this.refreshCards();
  };

  refreshCards = () => {
    axios.get("/getFavorites")
    .then(response => {
        this.setState({ favorites: response.data });
    })
    .catch(err => {
        console.error(err.message);
        this.setState({favorites: []});
    });
  };

//   handleDeleteFavorite = (event,photo_id) => {
//     event.preventDefault();
//     axios.get(`/deleteFavorite/${photo_id}`)
//     .then(() => {this.refreshCards();})
//     .catch(err => {
//         console.error(err.message);
//         this.setState({favorites:[]});
//     });
//   };

//   handleOpenModal = () => {
//     this.setState({ showModal: true });
//   };
  
//   handleCloseModal = () => {
//     this.setState({ showModal: false });
//   };

  render() {
    return (
      <Grid container justify="space-evenly" alignItems="center">
        <Grid item xs={12}>
          <Typography variant="button">Your Favorite photos</Typography>
          <br />
        </Grid>
        {this.state.favorites.map(photo => (
          <Grid item xs={2} key={photo.file_name}>
              <Favorite photo={photo} refreshCards={this.refreshCards} />
            {/* <div>
                <Card>
                <CardHeader
                    action={(
                        <IconButton onClick={event => this.handleDeleteFavorite(event,photo._id)}>
                            <Clear />
                        </IconButton>
                    )}
                />
                <CardMedia
                    component="img"
                    image={`/images/${photo.file_name}`}
                    onClick={this.handleOpenModal}
                />
                </Card>
                <Dialog
                    onClose={this.handleCloseModal}
                    aria-labelledby="customized-dialog-title"
                    open={this.state.showModal}
                >
                    <DialogTitle onClose={this.handleCloseModal}>
                        {photo.date_time}
                    </DialogTitle>
                    <DialogContent>
                        <img src={`/images/${photo.file_name}`}/>
                    </DialogContent>
                </Dialog>
            </div> */}
          </Grid>
        ))}
      </Grid>
    );
  }
}

export default Favorites;