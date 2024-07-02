export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/campgrounds/new',
    '/api/subscribe',
    '/api/campgrounds',
    '/campgrounds/:id/confirm',
  ],
  pages: {
    signIn: '/auth/login',
  },
}
