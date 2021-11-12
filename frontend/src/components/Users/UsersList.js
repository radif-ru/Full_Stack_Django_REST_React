import {PureComponent} from "react";
import {UserItem} from "./UserItem";

export class UsersList extends PureComponent {
    render() {
        const {users} = this.props

        return (
            <div>
                <h3>Users</h3>
                <table className='table'>
                    <thead>
                    <tr>
                        <th>
                            First name
                        </th>
                        <th>
                            Last name
                        </th>
                        <th>
                            Middle name
                        </th>
                        <th>
                            Email
                        </th>
                        <th>
                            Birthdate
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user, idx) =>
                        <UserItem key={idx} user={user}/>)}
                    </tbody>
                </table>
            </div>
        )
    }
}
