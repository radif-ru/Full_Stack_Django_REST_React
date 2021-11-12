import {PureComponent} from "react";

export class TodoItem extends PureComponent {
    render() {
        const {todo} = this.props;

        return (
            <tr>
                <td>
                    <a target='_blank' rel='noreferrer' href={todo.url}>
                        {todo.url}
                    </a>
                </td>
                <td>
                    {todo.text}
                </td>
                <td>
                    <a target='_blank' rel='noreferrer' href={todo.project}>
                        {todo.project}
                    </a>
                </td>
                <td>
                    {todo.created}
                </td>
                <td>
                    {todo.updated}
                </td>
            </tr>
        )
    }
}
