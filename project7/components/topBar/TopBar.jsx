import React from 'react';
import {
  Grid, AppBar, Toolbar, Typography,Input,Button, Dialog, DialogTitle
} from '@material-ui/core';
import './TopBar.css';
// import fetchModel from "../../lib/fetchModelData";
import axios from 'axios';

/**
 * Define TopBar, a React componment of CS142 project #5
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // view: this.props.view,
      dialog:false
    };
  }
  
  // componentDidMount = () => {
  //   axios.get("http://localhost:3000/test/info")
  //   .then((response) => {
  //     this.setState({ version: response.data.__v});
  //     this.props.changeView("Welcome to the photosharing app!");
  //   })
  //   .catch((error) => {console.log(error);});
  // };

  // componentDidUpdate = (prevProps) => {
  //   if (prevProps.view !== this.props.view) {
  //     this.setState({ view: this.props.view });
  //    }
  // };

  handleCloseUpload = () => {
    this.setState({ dialog: false});
  };

  handleOpenUpload = () => {
    this.setState({ dialog: true});
  };

  handleLogOut = () => {
    this.props.changeLoggedIn(undefined);
  };

//this function is called when user presses the update button
  handleUploadButtonClicked = (e) => {
    e.preventDefault();
    if (this.uploadInput.files.length > 0) {

     // Create a DOM form and add the file to it under the name uploadedphoto
     const domForm = new FormData();
     domForm.append('uploadedphoto', this.uploadInput.files[0]);
     axios.post('/photos/new', domForm)
       .then((res) => {
         console.log(res);
         this.setState({dialog:false});
       })
       .catch(err => console.log(`POST ERR: ${err}`));
    }
  };

  render() {
    return (
      <AppBar className="cs142-topbar-appBar" position="absolute">
        <Toolbar>
        {this.props.current_User ? (
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            {/* <Grid item xs>
            <Typography variant="h5" color="inherit">
              {this.state.view}
            </Typography>
            </Grid> */}
            <Grid item xs>
              <Typography variant="h5" color="inherit">
                  Hi {this.props.current_User.first_name}
              </Typography>
            </Grid>
            <Grid item xs>
              <Button variant="contained" onClick={this.handleOpenUpload} >
                  Add Photo
              </Button>
              <Dialog open={this.state.dialog} onClose={this.handleCloseUpload}>
                <DialogTitle>Upload new Photo</DialogTitle>
                  <form onSubmit={this.handleUploadButtonClicked}>
                    <label>
                      <input
                        type="file"
                        accept="image/*"
                        ref={domFileRef => {
                          this.uploadInput = domFileRef;
                        }}
                      />
                    </label> <br />
                    <Input type="submit" value="Upload" />
                  </form>
              </Dialog>
            </Grid>
            <Grid item xs>
              <Button variant="contained" onClick={this.handleLogOut}>
                Log out
              </Button>
            </Grid>
          </Grid>
            ) : <Typography variant="h5">Please login</Typography>
          }
        </Toolbar>
      </AppBar>
    );
  }
}

export default TopBar;
