import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Pre-launch beta gate.
 *
 * Enabled:  set BETA_PASSWORD in Netlify environment variables
 * Disabled: remove BETA_PASSWORD (or leave unset) — gate is a no-op
 * Remove entirely: delete this file at public launch
 *
 * To set the password: Netlify dashboard → Site configuration →
 * Environment variables → Add variable: BETA_PASSWORD = <your password>
 */
export function middleware(request: NextRequest) {
  const betaPassword = process.env.BETA_PASSWORD
  if (!betaPassword) return NextResponse.next()

  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Basic ')) {
    const decoded = Buffer.from(authHeader.slice(6), 'base64').toString()
    const password = decoded.split(':').slice(1).join(':')
    if (password === betaPassword) return NextResponse.next()
  }

  return new NextResponse('Beta access required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Spendable Beta"',
    },
  })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
