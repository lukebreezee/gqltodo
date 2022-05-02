import { useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { GENERATE_NEW_TOKEN_MUTATION } from '../GraphQL/Mutations'
import { GET_NAME } from '../GraphQL/Queries'
import useNewAccessToken from '../Hooks/useNewAccessToken'

const Home = () => {
  const [name, setName] = useState('')

  const { getNameErr, loading, data } = useQuery(GET_NAME)
  const { saveNewToken } = useNewAccessToken()

  const getName = async () => {
    if (!data || getNameErr) {
      setName('Error')
      return
    }

    if (data.getUser.success) {
      setName(data.getUser.user.name)
      return
    }

    if (data.getUser.code !== 403) {
      // Handle extraneous errors
    }

    const { success } = await saveNewToken()
    if (!success) {
      setName('Error')
      return
    }

    // getName()
  }

  return (
    <>
      <h1>Home</h1>
      {localStorage.getItem('GQL TODO ACCESS TOKEN') && (
        <button onClick={() => getName()}>Get Name</button>
      )}
      {name && <p>{name}</p>}
    </>
  )
}

export default Home
