import React from "react";
import { Grid, Typography, Input, TextField} from "@material-ui/core";
// import {Visibility, VisibilityOff} from "@material-ui/icons";
import axios from "axios";

class LoginRegister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            failedLogin: "",
            login_name:"",
            password: "",
            register_name:"",
            register_password_1: "",
            register_password_2: "",
            failedRegister: "",
            first_name: "",
            last_name: "",
            location: "",
            description: "",
            occupation: ""
        };
    }

    handleLogin = (event) => {
        event.preventDefault();
        console.log("test");
        console.log(this.state.login_name);
        axios.post("/admin/login",{login_name:this.state.login_name, password:this.state.password})
        .then( response => {
            let user = response.data;
            this.setState({failedLogin:""});
            this.props.changeLoggedIn(user);
            window.location.href = `#/users/${user._id}`;
        })
        .catch( err => this.setState({failedLogin:err.response.data}));
    };

    handleChangeInput = (updatedState) => {
        this.setState(updatedState);
    };

    handleRegister = (event) => {
        if (this.state.register_password_1 !== this.state.register_password_2){
            this.setState({failedRegister:"Two passwords don't match! Try again!"});
        } else {
            event.preventDefault();
            axios.post("/user",{
                login_name:this.state.register_name,
                password:this.state.register_password_1,
                first_name:this.state.first_name,
                last_name:this.state.last_name,
                location:this.state.location,
                description:this.state.description,
                occupation:this.state.occupation
            })
            .then( response => {
                this.setState({failedRegister:"Register Successfully"});
                console.log(response.data);
                // let user = response.data;
                // this.props.changeLoggedIn(user);
            })
            .catch( err => this.setState({failedRegister:err.response.data}));
        }
    };


    render() {


        return (
            <Grid container direction="row" justifyContent="space-between" alignItems="flex-start">
                <Grid item xs>
                    <Typography variant="h3" color="inherit">Login</Typography>
                    <Typography variant="body1" color="error">{this.state.failedLogin}</Typography>
                    <form onSubmit={this.handleLogin}>
                        <label >
                            <TextField
                              required 
                              label="Username"
                              id="Username"
                              type="text"
                              value={this.state.login_name}
                              onChange = {event => this.handleChangeInput({
                                  login_name:event.target.value
                                })}
                              variant="standard"
                            />
                        </label> <br />
                        <label>
                            <TextField
                                required
                                label="Password"
                                type="password"
                                value={this.state.password}
                                onChange={event => this.handleChangeInput({
                                    password: event.target.value
                                })}
                                variant="standard"
                            />
                        </label> <br />
                        <Input type="submit" value="Submit" />
                    </form>
                </Grid>

                <Grid item xs>
                    <Typography variant="h3" color="inherit">Register</Typography>
                    <Typography variant="body1" color="error">{this.state.failedRegister}</Typography>
                    <form onSubmit={this.handleRegister}>
                        <label>
                            <TextField 
                                required
                                label="Username"
                                type="text"
                                value={this.state.register_name}
                                onChange = {event => this.handleChangeInput({
                                    register_name:event.target.value
                                })}
                                variant="standard"
                            />
                        </label> <br />
                        <label>
                            <TextField 
                                required
                                label="Password"
                                type="password"
                                value={this.state.register_password_1}
                                onChange = {event => this.handleChangeInput({
                                    register_password_1:event.target.value
                                })}
                                variant="standard"
                            />
                        </label> <br />
                        <label>
                            <TextField 
                                required
                                label="Confirm Password"
                                type="password"
                                value={this.state.register_password_2}
                                onChange = {event => this.handleChangeInput({
                                    register_password_2:event.target.value
                                })}
                                variant="standard"
                                // endAdornment={(
                                //     <InputAdornment position="end">
                                //       <IconButton
                                //         aria-label="toggle password visibility"
                                //         onClick={() => this.handleClickShowPassword()}
                                //         onMouseDown={event => handleMouseDownPassword(event)}
                                //         edge="end"
                                //       >
                                //     {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                                //       </IconButton>
                                //     </InputAdornment>
                                // )}
                            />
                        </label> <br />
                        <label>
                            <TextField
                                required
                                label="First name"
                                type="text"
                                value={this.state.first_name}
                                onChange={event => this.handleChangeInput({ 
                                    first_name: event.target.value 
                                })}
                                variant="standard"
                            />
                        </label> <br />
                        <label>
                            <TextField
                                required
                                label="Last name"
                                type="text"
                                value={this.state.last_name}
                                onChange={event => this.handleChangeInput({ 
                                    last_name: event.target.value 
                                })}
                                variant="standard"
                            />
                        </label> <br />
                        <label>
                            <TextField
                                required
                                label="Location"
                                type="text"
                                value={this.state.location}
                                onChange={event => this.handleChangeInput({ 
                                    location: event.target.value 
                                })}
                                variant="standard"
                            />
                        </label> <br />
                        <label>
                            <TextField
                                required
                                label="Description"
                                type="text"
                                value={this.state.description}
                                onChange={event => this.handleChangeInput({ 
                                    description: event.target.value 
                                })}
                                variant="standard"
                            />
                        </label> <br />
                        <label>
                            <TextField
                                required
                                label="Occupation"
                                type="text"
                                value={this.state.occupation}
                                onChange={event => this.handleChangeInput({ 
                                    occupation: event.target.value 
                                })}
                                variant="standard"
                            />
                        </label> <br />
                        <Input type="submit" value="Register Me!" />
                    </form>
                </Grid>
            </Grid>
        );
    }
}

export default LoginRegister;