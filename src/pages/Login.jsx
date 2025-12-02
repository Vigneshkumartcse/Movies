import React, { useState, useEffect } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import app from "../config/Firebase";

export default function GoogleLogin() {
  const [loading, setLoading] = useState(false);
  const [welcomeUser, setWelcomeUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [alreadyLoggedIn, setAlreadyLoggedIn] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setWelcomeUser(user.displayName);
        setAlreadyLoggedIn(true);
      } else {
        setWelcomeUser(null);
        setAlreadyLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setWelcomeUser(user.displayName);
      setShowModal(true);
      setAlreadyLoggedIn(true);
      setTimeout(() => {
        setShowModal(false);
      }, 5000);
    } catch (error) {
      alert("Login failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "20px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
          width: "380px",
          padding: "3rem 2rem",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "1.9rem",
            fontWeight: "700",
            marginBottom: "1rem",
            color: "#333",
          }}
        >
          Welcome to <span style={{ color: "#7c3aed" }}>GuessMovie</span>
        </h1>
        <p
          style={{
            color: "#666",
            marginBottom: "2rem",
            fontSize: "0.95rem",
          }}
        >
          Sign in to continue with your Google account
        </p>

        {alreadyLoggedIn ? (
          <div
            style={{
              color: "#16a34a",
              fontWeight: "600",
              fontSize: "1.1rem",
              marginBottom: "1.5rem",
              textAlign: "center",
            }}
          >
            Already logged in as {welcomeUser}
          </div>
        ) : (
          <button
            id="googleLogin"
            onClick={handleGoogleLogin}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.7rem",
              background: "#fff",
              color: "#333",
              border: "none",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(124, 58, 237, 0.08)",
              padding: "0.8rem 1.6rem",
              fontSize: "1.1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "box-shadow 0.2s",
              height: "48px",
              minWidth: "220px",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                height: "100%",
              }}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
                alt="Google"
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  marginRight: "0.5rem",
                  verticalAlign: "middle",
                }}
              />
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                height: "100%",
              }}
            >
              Sign in with Google
            </span>
          </button>
        )}

        <p
          style={{
            marginTop: "2rem",
            color: "#aaa",
            fontSize: "0.8rem",
          }}
        >
          By signing in, you agree to our{" "}
          <span style={{ color: "#7c3aed", cursor: "pointer" }}>
            Terms of Service
          </span>{" "}
          &{" "}
          <span style={{ color: "#7c3aed", cursor: "pointer" }}>
            Privacy Policy
          </span>
          .
        </p>
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(60, 60, 120, 0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              boxShadow: "0 4px 24px rgba(124, 58, 237, 0.18)",
              padding: "2.5rem 2.5rem",
              textAlign: "center",
              fontSize: "1.5rem",
              color: "#7c3aed",
              fontWeight: "700",
              minWidth: "280px",
            }}
          >
            Welcome, {welcomeUser}!
          </div>
        </div>
      )}
    </div>
  );
}
