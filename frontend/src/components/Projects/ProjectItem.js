export const ProjectItem = ({project}) => {
    return (
        <tr>
            <td>
                <a target='_blank' rel='noreferrer' href={project.url}>
                    {project.url}
                </a>
            </td>
            <td>
                {project.name}
            </td>
            <td>
                <a target='_blank' rel='noreferrer' href={project.repository}>
                    {project.repository}
                </a>
            </td>
            <td>
                {project.users.map((user, idx) => <p key={idx}>
                    <a target='_blank' rel='noreferrer' href={user}>
                        {user}
                    </a></p>)}
            </td>
        </tr>
    )
}
