import React from 'react';

export default function DocumentationPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">App Documentation</h1>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Overview</h2>
        <p>
          This app is a luxury car sales platform built with Next.js and Firebase. It features a public-facing site for browsing and searching vehicles, and an admin dashboard for managing inventory, sales, and admin users.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Backend Implementation</h2>
        <ol className="list-decimal ml-6 mb-2">
          <li><b>Firebase Setup:</b> Create a Firebase project, enable Firestore, Authentication, and Storage. Copy your Firebase config and set it in your environment variables.</li>
          <li><b>Environment Variables:</b> Set all required Firebase and service account credentials in your <code>.env.local</code> file.</li>
          <li><b>API Endpoints:</b> The app provides endpoints for admin creation, admin verification, and Firebase connection testing. All admin routes are protected and require proper authentication.</li>
        </ol>
        <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto mb-2">
{`
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY=your_service_account_private_key
`}
        </pre>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Admin Dashboard Usage</h2>
        <ul className="list-disc ml-6 mb-2">
          <li><b>Login:</b> Go to <code>/admin/login</code> and log in with an <code>@admin.com</code> email.</li>
          <li><b>Dashboard:</b> View quick stats, recent activity, and use quick actions to manage vehicles and settings.</li>
          <li><b>Vehicle Management:</b> Add, edit, delete, and filter vehicles by status (All, Available, Sold, Pending, Featured).</li>
          <li><b>Admin Users:</b> Super Admins can create new admin users. All admins are listed with their roles and creation dates.</li>
          <li><b>Settings:</b> Change your password and manage your admin account.</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Category Images</h2>
        <p>
          Category images are stored in <code>public/categories/</code> (e.g., <code>sedan.jpg</code>, <code>suv.jpg</code>). Update these files to change the images shown in "Browse by Category".
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Security</h2>
        <ul className="list-disc ml-6 mb-2">
          <li>Only users with <code>@admin.com</code> emails can log in or be created as admins.</li>
          <li>All admin routes are protected both client-side and server-side.</li>
          <li>Admin verification is enforced via Firebase and backend checks.</li>
        </ul>
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-2">Tips</h2>
        <ul className="list-disc ml-6">
          <li>Use the sidebar to navigate between Dashboard, Vehicle Management, Analytics, Settings, and Documentation.</li>
          <li>Use the logout button in the sidebar or settings page to securely log out.</li>
        </ul>
      </section>
    </div>
  );
} 