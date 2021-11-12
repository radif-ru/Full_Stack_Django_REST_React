import {PureComponent} from "react";

export class UserItem extends PureComponent {
    render() {
        const {user} = this.props

        return (
            <tr>
                <td>
                    {user.firstName}
                </td>
                <td>
                    {user.lastName}
                </td>
                <td>
                    {user.middleName}
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
}