import React from "react";

import axios from 'axios';

import './App.css';
import UsersList from './components/Users/Users';
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

// Применение архитектуры One Way Data Flow
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
            <div>
                <Header/>
                <UsersList users={this.state.users}/>
                <Footer/>
            </div>
        )
    }
}

export default App;
