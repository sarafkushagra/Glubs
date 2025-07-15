import React from "react";
import ClubNavbar from "../Clubs/ClubNavbar";

export default function OrganizerSignIn() {
  return (
    <>
    <ClubNavbar/>
    <div className="min-h-screen mt-30 mb-10 flex items-center justify-center bg-gradient-to-r from-blue-100 via-blue-50 to-green-100 px-0 py-0">
      <div className="w-full h-full min-h-screen flex items-center justify-center">
        <div className="w-full max-w-2xl p-12 rounded-none shadow-xl border border-gray-200 bg-white mx-4 my-8">
          <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">
            Organizer Sign In
          </h2>
          <form className="space-y-6">
            <div>
              <label
                htmlFor="orgname"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                type="text"
                id="orgname"
                placeholder="Enter your full name"
                required
                className="mt-2 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div>
              <label
                htmlFor="orgemail"
                className="block text-sm font-medium text-gray-700"
              >
                Official Email
              </label>
              <input
                type="email"
                id="orgemail"
                placeholder="Enter your club or college email"
                required
                className="mt-2 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div>
              <label
                htmlFor="designation"
                className="block text-sm font-medium text-gray-700"
              >
                Designation
              </label>
              <input
                type="text"
                id="designation"
                placeholder="e.g., Club President, Event Head"
                required
                className="mt-2 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div>
              <label
                htmlFor="clubname"
                className="block text-sm font-medium text-gray-700"
              >
                Club / Organization Name
              </label>
              <input
                type="text"
                id="clubname"
                placeholder="e.g., Code Club, Robotics Society"
                required
                className="mt-2 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Create password"
                required
                className="mt-2 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div>
              <label
                htmlFor="confirm"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm"
                placeholder="Re-enter password"
                required
                className="mt-2 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-white py-3 rounded-lg mt-6 hover:bg-green-600 transition"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}
