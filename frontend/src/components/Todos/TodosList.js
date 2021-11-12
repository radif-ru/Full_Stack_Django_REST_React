import {PureComponent} from "react";
import {TodoItem} from "./TodoItem";

export class TodosList extends PureComponent {
    render() {
        const {todos} = this.props

        return (
            <div>
                <h3>Todos</h3>
                <table className='table'>
                    <thead>
                    <tr>
                        <th>
                            Url
                        </th>
                        <th>
                            Text
                        </th>
                        <th>
                            Project
                        </th>
                        <th>
                            Created
                        </th>
                        <th>
                            Updated
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {todos.map((todo, idx) =>
                        <TodoItem key={idx} todo={todo}/>)}
                    </tbody>
                </table>
            </div>
        )
    }
}