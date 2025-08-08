// File: src/components/navbar.js

import React from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { reset } from "@/config/redux/reducer/authReducer";

export default function NavBarComponent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(reset()); // ✅ Fix: dispatch must call the function
    router.push("/login"); // ✅ Fix: closing quote was incorrect
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navBar}>
        <h1
          style={{ cursor: "pointer" }}
          onClick={() => router.push("/")}
        >
          Connect
        </h1>

        <div className={styles.navBarOptionContainer}>
          {!authState?.loggedIn ? (
            <div
              onClick={() => router.push("/login")}
              className={styles.buttonJoin}
            >
              <p>Be a part</p>
            </div>
          ) : (
            <>
              <div
                className={styles.profileButton}
                onClick={() => router.push("/profile")}
              >
                <p>Profile</p>
              </div>
              <div
                className={styles.logoutButton}
                onClick={handleLogout}
              >
                <p>Logout</p>
              </div>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
