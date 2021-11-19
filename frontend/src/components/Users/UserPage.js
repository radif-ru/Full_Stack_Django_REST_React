import {useParams} from 'react-router-dom';

import dateFormat from 'dateformat';


export const UserPage = (props) => {

  const {id} = useParams();
  const {users} = props
  const user = users.filter((user) => user.id.toString() === id)
  const noData = 'нет данных!'

  return (
    <div className='user'>
      {user.map((data, idx) => <div key={idx}>
        <p>Id: <span className='user-data'>{data.id}</span>
        </p>
        <p>Login: <span
          className='user-data'>{data.username}</span></p>
        <p>Имя: <span
          className='user-data'>{data.firstName || noData}</span></p>
        <p>Фамилия: <span
          className='user-data'>{data.lastName || noData}</span></p>
        <p>Отчество: <span
          className='user-data'>{data.middleName || noData}</span></p>
        <p>Электронная почта: <span
          className='user-data'>{data.email}</span></p>
        <p>Дата рождения: <span
          className='user-data'>{data.birthdate ?
          dateFormat(data.birthdate, 'fullDate') : noData}
        </span>
        </p>
      </div>)}
    </div>
  )
}
