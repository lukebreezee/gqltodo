import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  from,
  ApolloProvider,
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { setContext } from '@apollo/client/link/context'
import { Routes, Route } from 'react-router'
import { Link } from 'react-router-dom'
import Home from './Pages/Home'
import SignIn from './Pages/SignIn'
import SignUp from './Pages/SignUp'

const errorLink = onError(({ graphqlErrors, networkError }) => {
  if (graphqlErrors) {
    graphqlErrors.map(({ message }) => {
      alert(`Network Error: ${message}`)
    })
  }
})

const link = from([
  errorLink,
  new HttpLink({ uri: 'http://localhost:4000/graphql' }),
])

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('GQL TODO ACCESS TOKEN')

  return {
    headers: {
      ...headers,
      'x-access-token': token || '',
    },
  }
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(link),
})

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <nav>
          <ul>
            <Link to="/">Home</Link>
            <Link to="sign-up">Sign Up</Link>
            <Link to="sign-in">Sign In</Link>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="sign-up" element={<SignUp />} />
          <Route path="sign-in" element={<SignIn />} />
        </Routes>
      </div>
    </ApolloProvider>
  )
}

export default App
