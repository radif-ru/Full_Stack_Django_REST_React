import React from "react";
import './App.css';
import UsersList from './Users';
import axios from 'axios';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'users': []
        }
    }

    componentDidMount() {
        axios
            .get('http://localhost:3333/api/users/')
            .then(response => {
                const users = response.data;
                this.setState(
                    {
                        'users': users
                    }
                );
            })
            .catch(error => console.log(error))
    }

    render() {
        return (
            <div><UsersList users={this.state.users}/></div>
        )
    }
}

export default App;
