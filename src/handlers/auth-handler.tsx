import { db } from "@/config/firebase.config";
import { LoaderPage } from "@/routes/loader-page";
import { User } from "@/types";
import { useAuth, useUser } from "@clerk/clerk-react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AuthHandler = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const pathname = useLocation().pathname;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storeUserData = async () => {
      if (isSignedIn && user) {
        setLoading(true);
        try {
          // Check if user document exists
          const userSnap = await getDoc(doc(db, "users", user.id));
          if (!userSnap.exists()) {
            console.log("Creating new user document for:", user.id);
            const userData: User = {
              id: user.id,
              name: user.fullName || user.firstName || "Anonymous",
              email: user.primaryEmailAddress?.emailAddress || "N/A",
              imageUrl: user.imageUrl,
              createdAt: serverTimestamp(),
              updateAt: serverTimestamp(),
            };

            // Store user data with Clerk user ID
            await setDoc(doc(db, "users", user.id), userData);
            console.log("User document created successfully");
          } else {
            console.log("User document already exists");
          }
        } catch (error) {
          console.error("Error storing user data:", error);
          // Continue without blocking the app
        } finally {
          setLoading(false);
        }
      } else if (!isSignedIn) {
        // Reset loading when user signs out
        setLoading(false);
      }
    };

    storeUserData();
  }, [isSignedIn, user, pathname, navigate]);

  if (loading) {
    return <LoaderPage />;
  }

  return null;
};

export default AuthHandler;
