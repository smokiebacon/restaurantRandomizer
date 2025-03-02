import Link from "next/link";
import Image from "next/image";
import Sidebar from "./sidebar";
export const dynamic = "force-dynamic";

// This is a private page: It's protected by the layout.js component which ensures the user is authenticated.
// It's a server compoment which means you can fetch data (like the user profile) before the page is rendered.
// See https://shipfa.st/docs/tutorials/private-page
export default async function Dashboard() {
  return (
    <div className="flex min-h-screen">
      {/* Main content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Alert banner */}
          <div className="bg-green-100 p-4 rounded-lg mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg
                className="w-6 h-6 text-amber-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span className="text-gray-700">
                Connect your social media accounts to start posting
              </span>
            </div>
            <Link href="/dashboard/accounts" className="mb-8">
              <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm">
                Connect Accounts
              </button>
            </Link>
          </div>

          {/* Create post section */}
          <div>
            <h2 className="text-2xl font-medium text-gray-800 mb-6">
              Create a post
            </h2>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <div className="flex">
                <button className="px-6 py-2 border-b-2 border-green-500 text-green-500 font-medium">
                  Media Post
                </button>
                <button className="px-6 py-2 text-gray-500 font-medium">
                  Text Post
                </button>
              </div>
            </div>

            {/* Upload area */}
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 mb-4 text-green-400">
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Click to upload or drag and drop
              </h3>
              <p className="text-gray-500 mb-1">
                or paste image from clipboard
              </p>
              <p className="text-gray-500 text-sm">
                Image(s) or Video (max 100MB)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
