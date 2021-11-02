import React from "react";

const UserItem = ({user}) => {
    return (
        <tr>
            <td>
                {user.first_name}
            </td>
            <td>
                {user.last_name}
            </td>
            <td>
                {user.middle_name}
            </td>
            <td>
                {user.email}
            </td>
            <td>
                {user.birthdate}
            </td>
        </tr>
    )
}

const UsersList = ({users}) => {
    return (
        <table>
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
            {users.map((user) => <UserItem user={user}/>)}
            </tbody>
        </table>
    )
}

export default UsersList;