import { redirect } from 'next/navigation'

// This is a redirect page - users should go to locale-specific pages
export default function RootPage() {
  // Redirect to default locale
  redirect('/en-US')
}