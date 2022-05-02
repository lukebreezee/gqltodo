import { useQuery, gql } from '@apollo/client'
import { useEffect, useState } from 'react'
import { LOAD_USER_EMAILS } from '../GraphQL/Queries'

const GetUserEmails = () => {
  const [userEmails, setUserEmails] = useState([])

  const { error, loading, data } = useQuery(LOAD_USER_EMAILS)

  useEffect(() => {
    if (data) {
      setUserEmails(data.getAllUsers)
    }
  }, [data])

  return (
    <div>
      {userEmails.map((obj) => (
        <p key={obj.id}>{obj.email}</p>
      ))}
    </div>
  )
}

export default GetUserEmails
