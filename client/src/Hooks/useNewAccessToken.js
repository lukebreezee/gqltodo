import { useMutation } from '@apollo/client'
import { GENERATE_NEW_TOKEN_MUTATION } from '../GraphQL/Mutations'

const useNewAccessToken = () => {
  const [generateNewToken, { error }] = useMutation(GENERATE_NEW_TOKEN_MUTATION)

  return {
    async saveNewToken() {
      try {
        const response = await generateNewToken({
          variables: {
            refreshToken: localStorage.getItem('GQL TODO REFRESH TOKEN'),
          },
        })

        if (error) return { success: false, code: 500 }

        const { success, accessToken, code } = response.data.generateNewToken
        if (success) {
          localStorage.setItem('GQL TODO ACCESS TOKEN', accessToken)
          console.log(accessToken)
          return { success: true }
        }
        return { success: false, code }
      } catch (e) {
        return { success: false }
      }
    },
  }
}

export default useNewAccessToken
