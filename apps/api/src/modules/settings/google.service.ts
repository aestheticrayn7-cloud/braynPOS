import { google } from 'googleapis'
import { prisma } from '../../lib/prisma.js'

export class GoogleService {
  private oauth2Client

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    )
  }

  getAuthUrl(channelId: string) {
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/drive.file',
    ]

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: scopes,
      state: channelId, // Pass channelId as state to know who is authenticating
    })
  }

  async handleCallback(code: string, channelId: string) {
    const { tokens } = await this.oauth2Client.getToken(code)
    
    this.oauth2Client.setCredentials(tokens)
    const oauth2 = google.oauth2({ version: 'v2', auth: this.oauth2Client })
    const userInfo = await oauth2.userinfo.get()

    // Assuming we attach the Google Account to the Channel
    // As per the schema update, it was added to User. I'll update the User.
    const userEmail = userInfo.data.email || ''

    // The state parameter passed in 'getAuthUrl' can be the userId instead of channelId.
    const userId = channelId 

    await prisma.user.update({
      where: { id: userId },
      data: {
        googleAccessToken: tokens.access_token,
        googleRefreshToken: tokens.refresh_token,
        googleTokenExpiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        googleEmail: userEmail,
      },
    })

    return { email: userEmail }
  }

  async getAuthenticatedClient(userId: string) {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { googleAccessToken: true, googleRefreshToken: true, googleTokenExpiresAt: true },
    })

    if (!user.googleAccessToken) {
      throw { statusCode: 400, message: 'Google account not connected.' }
    }

    const client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    )

    client.setCredentials({
      access_token: user.googleAccessToken,
      refresh_token: user.googleRefreshToken,
      expiry_date: user.googleTokenExpiresAt?.getTime(),
    })

    client.on('tokens', async (tokens) => {
      await prisma.user.update({
        where: { id: userId },
        data: {
          googleAccessToken: tokens.access_token,
          ...(tokens.refresh_token ? { googleRefreshToken: tokens.refresh_token } : {}),
          ...(tokens.expiry_date ? { googleTokenExpiresAt: new Date(tokens.expiry_date) } : {})
        }
      })
    })

    return client
  }
}

export const googleService = new GoogleService()
