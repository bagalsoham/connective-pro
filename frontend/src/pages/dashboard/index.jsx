import { createPost, getAllPost } from "@/config/redux/action/postAction";
import { getAboutUser } from "@/config/redux/action/authAction";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import styles from "./index.module.css";
import { BASE_URL } from "@/config";
import { Bodoni_Moda } from "next/font/google";

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const [isTokenThere, setIsTokenThere] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [fileContent, setFileContent] = useState(null);

  const handleUpload = async () => {
    await dispatch(createPost({ file: fileContent, body: postContent }));
    // Reset form after successful upload
    setPostContent("");
    setFileContent(null);
    // Reset file input
    const fileInput = document.getElementById("fileInput");
    if (fileInput) fileInput.value = "";
  };

  const handleFileChange = (e) => {
    setFileContent(e.target.files[0]);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setIsTokenThere(true);
    }
  }, []);

  useEffect(() => {
    if (isTokenThere) {
      const token = localStorage.getItem("token");
      dispatch(getAllPost());
      dispatch(getAboutUser({ token }));
    }
  }, [isTokenThere, dispatch]);

  if (authState?.user) {
    return (
      <UserLayout>
        <DashboardLayout>
          <div className="scrollComponent">
            <div className={styles.createPostContainer}>
              {/* Profile Picture */}
              {authState.user.userId?.profilePicture && (
                <img
                  className={styles.profileImage}
                  src={`${BASE_URL}/${authState.user.userId.profilePicture}`}
                  alt="User Profile"
                />
              )}
              
              {/* Textarea */}
              <textarea
                className={styles.postTextarea}
                placeholder="What's on your mind?"
                value={postContent}
                onClick={() => setPostContent(" ")}
                onChange={(e) => setPostContent(e.target.value)}
              />

              {/* Plus (File Upload) */}
              <label htmlFor="fileInput" className={styles.uploadIcon}>
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
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </label>
              <input 
                type="file" 
                id="fileInput" 
                style={{ display: "none" }} 
                onChange={handleFileChange}
              />

              {/* Show selected file name */}
              {fileContent && (
                <div className={styles.selectedFile}>
                  Selected: {fileContent.name}
                </div>
              )}

              {/* Post Button - Only show when user has clicked or typed */}
              {postContent.trim() !== "" && (
                <button className={styles.postButton} onClick={handleUpload}>
                  Post
                </button>
              )}
            </div>
          </div>
        </DashboardLayout>
      </UserLayout>
    );
  } else {
    return (
      <UserLayout>
        <DashboardLayout>
          <h1>Loading......</h1>
        </DashboardLayout>
      </UserLayout>
    );
  }
}