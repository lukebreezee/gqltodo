import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { SIGN_IN_MUTATION } from '../GraphQL/Mutations'

const SignIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')

  const [signIn, { error }] = useMutation(SIGN_IN_MUTATION)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const response = await signIn({
      variables: {
        email,
        password,
      },
    })

    if (error) {
      setStatus('An error has occurred')
      return
    }

    const { success, message, accessToken, refreshToken } = response.data.signIn
    if (!success) {
      setStatus(message)
      return
    }

    localStorage.setItem('GQL TODO ACCESS TOKEN', accessToken)
    localStorage.setItem('GQL TODO REFRESH TOKEN', refreshToken)

    setStatus(`Access token is ${accessToken}`)
  }

  return (
    <>
      <h1>SignIn</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          type="text"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          disabled={email.length === 0 || password.length === 0}
        >
          Submit
        </button>
      </form>
      {status.length !== 0 && <p>{status}</p>}
    </>
  )
}

export default SignIn
