import { useState } from 'react'
import { CREATE_USER_MUTATION } from '../GraphQL/Mutations'
import { useMutation } from '@apollo/client'

const SignUp = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [status, setStatus] = useState('')

  const [createUser, { error }] = useMutation(CREATE_USER_MUTATION)

  const checkEmail = (emailToTest) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToTest)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!checkEmail(email)) {
      setStatus('Email is invalid')
      return
    }

    const hasProperLength = password.length >= 10 && password.length <= 25
    let hasCapital = false
    let hasNumber = false
    const capitalRegex = /[A-Z]/
    const numberRegex = /[0-9]/

    for (const char of password) {
      if (capitalRegex.test(char)) {
        hasCapital = true
      } else if (numberRegex.test(char)) {
        hasNumber = true
      }
    }

    if (!hasProperLength || !hasCapital || !hasNumber) {
      setStatus(
        'Password must contain a capital letter, a number, and be between 10-25 characters',
      )
      return
    }

    if (password !== confirm) {
      setStatus('Passwords must match')
      return
    }

    try {
      const response = await createUser({
        variables: {
          name,
          email,
          password,
        },
      })

      if (error) {
        setStatus('An error has occured')
        return
      }

      if (!response.data.createUser.success) {
        setStatus(response.data.createUser.message)
        return
      }
    } catch (e) {
      setStatus('An error has occurred')
      return
    }

    setStatus('Success!')
  }

  return (
    <>
      <h1>SignUp</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          type="text"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
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
        <input
          type="text"
          placeholder="Confirm"
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button
          type="submit"
          disabled={
            name.length === 0 ||
            email.length === 0 ||
            password.length === 0 ||
            confirm.length === 0
          }
        >
          Submit
        </button>
      </form>
      {status.length !== 0 && <p>{status}</p>}
    </>
  )
}

export default SignUp
