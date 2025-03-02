import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { signOut } from "next-auth/react";

export default async function Sidebar() {
  const session = await getServerSession();

  return (
    <aside className="w-60 border-r border-gray-200 p-6 flex flex-col">
      <div className="mb-8">
        <h1 className="text-xl font-medium flex items-center gap-2">
          <span className="text-gray-700">HashiPost</span>
        </h1>
      </div>

      <Link href="/dashboard/create" className="mb-8">
        <button className="bg-green-400 hover:bg-green-500 text-gray-800 font-medium py-2 px-4 rounded-md w-full flex items-center justify-center gap-2">
          <span className="text-lg">+</span> Create post
        </button>
      </Link>

      <nav className="flex-1">
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-700 mb-3">Content</h2>
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard/posts"
                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <span className="text-gray-700">My Posts</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/scheduled"
                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-gray-700">Scheduled</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/studio"
                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-gray-700">Studio</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-700 mb-3">
            Configuration
          </h2>
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard/accounts"
                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <span className="text-gray-700">Accounts</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
            S
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">
              {session.user.name}{" "}
            </p>
            <p className="text-xs text-gray-500">Free Plan</p>
          </div>
        </div>
        <button
          //   onClick={() => signOut()}
          type="submit"
          className="w-full flex items-center gap-2 p-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
