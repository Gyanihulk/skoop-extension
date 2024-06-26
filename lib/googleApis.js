// GoogleApi.js
const getUserInfo = async (token) => {
  const userInfoEndpoint = 'https://www.googleapis.com/oauth2/v1/userinfo'

  try {
    const response = await fetch(userInfoEndpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch user info: ${response.statusText}`)
    }

    const userInfo = await response.json()
    return userInfo
  } catch (error) {
    return null
  }
}

export default getUserInfo
