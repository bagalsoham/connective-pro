import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.css";
import { loginUser, registerUser } from "@/config/redux/action/authAction";

function LoginComponent() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const [isLoginMethod, setIsLoginMethod] = useState(true); // Fixed: should default to true for login

  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn, router]);

  const dispatch = useDispatch();
  const [email, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");

  const handleRegister = () => {
    console.log("Registering");
    dispatch(
      registerUser({
        username,
        password,
        email,
        name,
      })
    );
  };

  const handleLogin = () => {
    console.log("Logging in");
    dispatch(loginUser({ email, password }));
  };

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer__left}>
            <p className={styles.cardLeft__heading}>
              {isLoginMethod ? "Sign In" : "Sign Up"}
            </p>

            {/* Show loading state */}
            {authState.isLoading && <p>Loading...</p>}

            {/* Show messages */}
            {authState.message && (
              <p
                style={{
                  color: authState.isError ? "red" : "green",
                  margin: "10px 0",
                }}
              >
                {authState.message}
              </p>
            )}

            <div className={styles.inputContainer}>
              {/* Show username and name only for signup */}
              {!isLoginMethod && (
                <div className={styles.inputRow}>
                  <input
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.inputField}
                    type="text"
                    placeholder="Username"
                    value={username}
                  />
                  <input
                    onChange={(e) => setName(e.target.value)}
                    className={styles.inputField}
                    type="text"
                    placeholder="Name"
                    value={name}
                  />
                </div>
              )}

              <input
                onChange={(e) => setEmailAddress(e.target.value)}
                className={styles.inputField}
                type="email"
                placeholder="Email"
                value={email}
              />

              <input
                onChange={(e) => setPassword(e.target.value)}
                className={styles.inputField}
                type="password"
                placeholder="Password"
                value={password}
              />

              <div
                onClick={() => {
                  if (authState.isLoading) return; // Prevent multiple clicks

                  if (isLoginMethod) {
                    handleLogin();
                  } else {
                    handleRegister();
                  }
                }}
                className={styles.buttonWithOutLine}
                style={{
                  cursor: authState.isLoading ? "not-allowed" : "pointer",
                  opacity: authState.isLoading ? 0.6 : 1,
                }}
              >
                <p>
                  {authState.isLoading
                    ? "Processing..."
                    : isLoginMethod
                    ? "Sign In"
                    : "Sign Up"}
                </p>
              </div>
            </div>
          </div>

          <div className={styles.cardContainer__right}>
            <div className={styles.rightSideContent}>
              {isLoginMethod ? (
                // When in login mode, show signup option
                <div className={styles.switchModeContainer}>
                  <p className={styles.rightDescription}>
                    Don't have an account?
                  </p>
                  <div
                    onClick={() => setIsLoginMethod(false)}
                    className={styles.buttonWithOutLine}
                  >
                    <p>Sign Up</p>
                  </div>
                </div>
              ) : (
                // When in signup mode, show login option
                <div className={styles.switchModeContainer}>
                  <p className={styles.rightDescription}>
                    Already have an account?
                  </p>
                  <div
                    onClick={() => setIsLoginMethod(true)}
                    className={styles.buttonWithOutLine}
                  >
                    <p>Sign In</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default LoginComponent;
