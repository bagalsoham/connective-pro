// ============================================================================
// IMPORTS SECTION
// ============================================================================
import { getAllUsers } from "@/config/redux/action/authAction";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import styles from "./index.module.css";
import { BASE_URL } from "@/config";

// ============================================================================
// MAIN DISCOVER COMPONENT
// ============================================================================
export default function Discover() {
  // ----------------------------------------------------------------------------
  // HOOKS SETUP
  // ----------------------------------------------------------------------------
  const router = useRouter();
  const dispatch = useDispatch();

  // Redux state selectors
  const authState = useSelector((state) => state.auth);

  // ----------------------------------------------------------------------------
  // STATE VARIABLES
  // ----------------------------------------------------------------------------
  // Authentication state
  const [isTokenThere, setIsTokenThere] = useState(false);

  // ============================================================================
  // EFFECTS (COMPONENT LIFECYCLE)
  // ============================================================================

  /**
   * Check authentication on component mount
   * Redirect to login if no token found
   */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setIsTokenThere(true);
    }
  }, []);

  /**
   * Load initial data when authenticated
   * Fetches all users for discovery
   */
  useEffect(() => {
    if (isTokenThere) {
      dispatch(getAllUsers());
    }
  }, [isTokenThere, dispatch]);

  // ============================================================================
  // RENDER LOGIC
  // ============================================================================

  // Show main discover page if user is authenticated and loaded
  if (authState?.user) {
    // Extract users from Redux state
    const allUsers = authState?.allUsers || [];

    return (
      <UserLayout>
        <DashboardLayout>
          <div className={styles.scrollComponent}>
            {/* ================================================================ */}
            {/* DISCOVER HEADER SECTION */}
            {/* ================================================================ */}
            <div className={styles.discoverHeader}>
              <h1 className={styles.pageTitle}>Discover People</h1>
              <p className={styles.pageSubtitle}>
                Connect with professionals in your network
              </p>
            </div>

            {/* ================================================================ */}
            {/* USERS LIST SECTION */}
            {/* ================================================================ */}
            <div className={styles.usersContainer}>
              {/* Loading state */}
              {authState?.isLoading && (
                <div className={styles.loadingState}>
                  <div className={styles.spinner}></div>
                  Loading users...
                </div>
              )}

              {/* Error state */}
              {authState?.isError && (
                <div className={styles.errorState}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                  </svg>
                  Error loading users: {authState.message}
                </div>
              )}

              {/* Horizontal Users List */}
              {Array.isArray(allUsers) && allUsers.length > 0
                ? allUsers.map((user) => (
                    <div key={user._id || user.id} className={styles.userCard}>
                      {/* Profile Image */}
                      <img
                        className={styles.userProfileImage}
                        src={
                          user.profilePicture
                            ? `${BASE_URL}/${user.profilePicture}`
                            : `${BASE_URL}/default.jpg`
                        }
                        alt={user.name || "User"}
                        onError={(e) => {
                          e.target.src = `${BASE_URL}/default.jpg`;
                        }}
                      />

                      {/* User Info */}
                      <div className={styles.userInfo}>
                        <h3 className={styles.userName}>
                          {user.name || "Unknown User"}
                        </h3>
                        <p className={styles.userHandle}>
                          @{user.username || "user"}
                        </p>
                      </div>

                      {/* Action Button */}
                      <button
                        className={styles.viewProfileButton}
                        onClick={() => {
                          router.push(`/profile/${user._id || user.id}`);
                        }}
                      >
                        View Profile
                      </button>
                    </div>
                  ))
                : /* Empty state when no users exist */
                  !authState?.isLoading && (
                    <div className={styles.emptyState}>
                      <svg
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 11h-4" />
                        <path d="M16 7l4 4-4 4" />
                      </svg>
                      <h3>No users found</h3>
                      <p>
                        Check back later to discover new people in your network!
                      </p>
                    </div>
                  )}
            </div>
          </div>
        </DashboardLayout>
      </UserLayout>
    );
  } else {
    // ============================================================================
    // LOADING STATE (When user data is being fetched)
    // ============================================================================
    return (
      <UserLayout>
        <DashboardLayout>
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <h2>Loading discover page...</h2>
          </div>
        </DashboardLayout>
      </UserLayout>
    );
  }
}