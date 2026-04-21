import { Suspense } from "react"
import ProfileAddressesClient from "./profile-addresses-client"

export default function ProfileAddressesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ProfileAddressesClient />
    </Suspense>
  )
}
