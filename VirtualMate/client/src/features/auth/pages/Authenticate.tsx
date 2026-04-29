import React, { useState } from "react";
import { auth } from "../configs/firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuthUser } from "./../hooks/useAuth";

export default function Authenticate() {
  // Using our new scalable TanStack Query hook to get the logged-in user
  const { data: user, isLoading } = useAuthUser();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleAuthentication = async () => {
    setIsAuthenticating(true);
    try {
      const provider = new GoogleAuthProvider();
      // The popup completes, which automatically triggers the global `onAuthStateChanged`
      // observer inside `useAuthUser` hook. That hook will then make the request
      // to your backend, store the cookie, and finally update the `user` state.
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Error in authentication", err);
      setIsAuthenticating(false); // Reset on error
    }
    // We don't need to setIsAuthenticating(false) on success because the `user` state 
    // will populate and switch the UI view automatically.
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-5">
      {isLoading || (isAuthenticating && !user) ? (
        <p className="text-lg font-medium animate-pulse">Loading user state...</p>
      ) : user ? (
        <div className="text-center">
          <p className="mb-4">Welcome, {user.displayName}!</p>
          <img
            src={user.photoURL || ""}
            alt="Profile"
            className="w-16 h-16 rounded-full mx-auto mb-4"
          />
          <button
            onClick={() => {
              auth.signOut();
              setIsAuthenticating(false);
            }}
            className="p-3 rounded-2xl bg-red-600 text-white font-semibold cursor-pointer hover:bg-red-700 transition shadow-md"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="mb-4 text-lg">Login with Google!</p>
          <button
            onClick={handleAuthentication}
            className="px-6 py-3 rounded-2xl bg-amber-600 text-white font-semibold cursor-pointer hover:bg-amber-700 transition shadow-lg"
          >
            Authenticate
          </button>
        </div>
      )}
    </div>
  );
}
