import React from "react";
import axios from "axios";

class Activities extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: undefined,
        };
    }
    componentDidMount = () => {
        axios.get("/activity")
        .then((response) => {this.setState({data:response.data});})
        .catch((err) => {console.error(err.message);});
    };

    giveActivities = () => {
        if(this.state.data){
            console.log("No activity");
        }

    };
    
    render(){
    return (
        <div>
            {this.giveActivities()}
        </div>
    );
    }
}

export default Activities;