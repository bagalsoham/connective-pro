import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  setTokenIsThere,
  setTokenIsNotThere,
} from "@/config/redux/reducer/authReducer";
import { getAllUsers } from "@/config/redux/action/authAction";
import { BASE_URL } from "@/config";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);

  // Fixed: Access the correct auth slice and map the correct properties
  const authState = useSelector((state) => state.auth || {});
  const { 
    allUsers = [], 
    isLoading = false, 
    isError = false,
    message = ""
  } = authState;

  // Handle server-side rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return; // Don't run on server-side

    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(setTokenIsNotThere());
      router.push("/login");
    } else {
      dispatch(setTokenIsThere());
      dispatch(getAllUsers());
    }
  }, [dispatch, router, mounted]);

  // Don't render until mounted (prevents SSR issues)
  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.homeContainer}>
        {/* ---------- LEFT SIDEBAR ---------- */}
        <div className={styles.homeContainer__leftBar}>
          {/* Home Option */}
          <div
            className={styles.sideBarOption}
            onClick={() => router.push("/dashboard")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={styles.icon}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 
                1.125 1.125H9.75v-4.875c0-.621.504-1.125 
                1.125-1.125h2.25c.621 0 1.125.504 
                1.125 1.125V21h4.125c.621 0 
                1.125-.504 1.125-1.125V9.75M8.25 
                21h8.25"
              />
            </svg>
            <p>Home</p>
          </div>

          {/* Discover Option */}
          <div
            className={styles.sideBarOption}
            onClick={() => router.push("/discover")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={styles.icon}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 
                0A7.5 7.5 0 103.75 10.5a7.5 
                7.5 0 0012.9 6.15z"
              />
            </svg>
            <p>Discover</p>
          </div>

          {/* My Connections Option */}
          <div
            className={styles.sideBarOption}
            onClick={() => router.push("/my_connections")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={styles.icon}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 
                3.75 0 11-7.5 0 
                3.75 3.75 0 
                017.5 0zM4.5 
                20.25a8.25 
                8.25 0 
                0115 0M18.75 
                13.5a1.5 1.5 
                0 100-3 1.5 
                1.5 0 
                000 3zM5.25 
                13.5a1.5 1.5 
                0 100-3 1.5 
                1.5 0 
                000 3z"
              />
            </svg>
            <p>My Connections</p>
          </div>
        </div>

        {/* ---------- FEED ---------- */}
        <div className={styles.homeContainer__feedContainer}>{children}</div>

        {/* ---------- TOP PROFILES ---------- */}
        <div className={styles.homeContainer__extraContainer}>
          <h3>Top Profiles</h3>

          {isLoading && <p>Loading...</p>}
          {isError && <p style={{ color: 'red' }}>{message || 'An error occurred'}</p>}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {allUsers?.slice(0, 5).map((user) => (
              <div key={user.id} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '8px'
              }}>
                <img
                  src={user.profilePicture ? `${BASE_URL}/${user.profilePicture}` : `${BASE_URL}/default.jpg`}
                  alt={user.name}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.src = `${BASE_URL}/default.jpg`;
                  }}
                />
                <div>
                  <h4 style={{ margin: 0, fontSize: '14px' }}>{user.name}</h4>
                  <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>@{user.username || 'user'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}