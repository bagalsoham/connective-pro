// ============================================================================
// IMPORTS SECTION
// ============================================================================
import {
  createPost,
  deletePost,
  getAllPost,
} from "@/config/redux/action/postAction";
import { getAboutUser } from "@/config/redux/action/authAction";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import styles from "./index.module.css";
import { BASE_URL } from "@/config";

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================
export default function Dashboard() {
  // ----------------------------------------------------------------------------
  // HOOKS SETUP
  // ----------------------------------------------------------------------------
  const router = useRouter();
  const dispatch = useDispatch();

  // Redux state selectors
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.post);

  // ----------------------------------------------------------------------------
  // STATE VARIABLES
  // ----------------------------------------------------------------------------
  // Authentication state
  const [isTokenThere, setIsTokenThere] = useState(false);

  // Post creation states
  const [postContent, setPostContent] = useState(""); // Text content for new post
  const [fileContent, setFileContent] = useState(null); // File attachment for new post

  // Comments functionality states
  const [showComments, setShowComments] = useState({}); // Track which posts have comments visible
  const [commentText, setCommentText] = useState({}); // Store comment text for each post

  // Post interactions
  const [likedPosts, setLikedPosts] = useState(new Set()); // Track liked posts locally

  // ============================================================================
  // POST CREATION HANDLERS
  // ============================================================================

  /**
   * Handle post upload (text + optional file)
   * Validates content, dispatches create action, and resets form
   */
  const handleUpload = async () => {
    // Validation: ensure there's either text content or a file
    if (!postContent.trim() && !fileContent) return;

    try {
      // Create the post
      await dispatch(createPost({ file: fileContent, body: postContent }));
      // Refresh posts feed
      await dispatch(getAllPost());

      // Reset form after successful post
      setPostContent("");
      setFileContent(null);
      const fileInput = document.getElementById("fileInput");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  /**
   * Handle file selection for post attachment
   * Validates file size and updates state
   */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // File size validation (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
      setFileContent(file);
    }
  };

  // ============================================================================
  // POST INTERACTION HANDLERS
  // ============================================================================

  /**
   * Handle post like/unlike functionality
   * Updates local state immediately for better UX
   */
  const handleLikePost = async (postId) => {
    try {
      // Optimistic update: toggle like state immediately
      const newLikedPosts = new Set(likedPosts);
      if (likedPosts.has(postId)) {
        newLikedPosts.delete(postId);
      } else {
        newLikedPosts.add(postId);
      }
      setLikedPosts(newLikedPosts);

      // TODO: Uncomment when backend API is ready
      // await dispatch(likePost({ post_id: postId }));

      // Refresh posts after a short delay to get updated like count
      setTimeout(() => {
        dispatch(getAllPost());
      }, 500);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  /**
   * Toggle comments visibility for a specific post
   */
  const toggleComments = (postId) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  /**
   * Handle comment submission for a post
   */
  const handleComment = async (postId) => {
    const comment = commentText[postId];
    if (!comment || !comment.trim()) return;

    try {
      // TODO: Uncomment when backend API is ready
      // await dispatch(commentPost({ post_id: postId, commentBody: comment }));

      // Clear the comment input for this post
      setCommentText((prev) => ({
        ...prev,
        [postId]: "",
      }));

      // Refresh posts to show new comment
      dispatch(getAllPost());
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  /**
   * Handle comment text changes for a specific post
   */
  const handleCommentChange = (postId, value) => {
    setCommentText((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  /**
   * Format timestamp to relative time (e.g., "2h", "3d", "1w")
   */
  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - postDate) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w`;
  };

  /**
   * Generate file preview for post creation
   * Shows image preview or file info based on file type
   */
  const getFilePreview = () => {
    if (!fileContent) return null;

    // Image preview
    if (fileContent.type.startsWith("image/")) {
      return (
        <div className={styles.filePreview}>
          <img
            src={URL.createObjectURL(fileContent)}
            alt="Preview"
            className={styles.previewImage}
          />
          <button
            className={styles.removeFile}
            onClick={() => {
              setFileContent(null);
              const fileInput = document.getElementById("fileInput");
              if (fileInput) fileInput.value = "";
            }}
          ></button>
        </div>
      );
    }

    // Non-image file info
    return (
      <div className={styles.fileInfo}>
        <span>📎 {fileContent.name}</span>
        <button onClick={() => setFileContent(null)}>×</button>
      </div>
    );
  };

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
   * Fetches posts and user information
   */
  useEffect(() => {
    if (isTokenThere) {
      const token = localStorage.getItem("token");
      dispatch(getAllPost()); // Load all posts
      dispatch(getAboutUser({ token })); // Load current user info
    }
  }, [isTokenThere, dispatch]);

  // ============================================================================
  // RENDER LOGIC
  // ============================================================================

  // Show main dashboard if user is authenticated and loaded
  if (authState?.user) {
    // Extract posts from Redux state (handle different response structures)
    const posts = postState?.post?.posts || postState?.post || [];

    return (
      <UserLayout>
        <DashboardLayout>
          <div className={styles.scrollComponent}>
            {/* ================================================================ */}
            {/* CREATE POST SECTION */}
            {/* ================================================================ */}
            <div className={styles.createPostContainer}>
              {/* Post creation header with profile image and textarea */}
              <div className={styles.createPostHeader}>
                {authState.user.userId?.profilePicture && (
                  <img
                    className={styles.createPostProfileImage}
                    src={`${BASE_URL}/${authState.user.userId.profilePicture}`}
                    alt="Your Profile"
                    onError={(e) => {
                      e.target.src = `${BASE_URL}/default.jpg`;
                    }}
                  />
                )}
                <textarea
                  className={styles.createPostTextarea}
                  placeholder="Share an update..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  maxLength={3000}
                />
              </div>

              {/* File preview (if file is selected) */}
              {getFilePreview()}

              {/* Post creation actions and buttons */}
              <div className={styles.createPostActions}>
                {/* Media attachment buttons */}
                <div className={styles.mediaButtons}>
                  {/* Photo upload button */}
                  <label htmlFor="fileInput" className={styles.uploadButton}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M19 7v2.99s-1.99.01-2 0V7h-3s.01-1.99 0-2h3V2h2v3h3v2h-3zm-3 4V8h-3V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8h-3zM5 19l3-4 2 3 3-4 4 5H5z" />
                    </svg>
                    Photo
                  </label>

                  {/* Video upload button (placeholder) */}
                  <button className={styles.mediaButton}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z" />
                    </svg>
                    Video
                  </button>

                  {/* Document upload button (placeholder) */}
                  <button className={styles.mediaButton}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                    </svg>
                    Document
                  </button>
                </div>

                {/* Character count and post submit button */}
                <div className={styles.postButtonContainer}>
                  <span className={styles.characterCount}>
                    {postContent.length}/3000
                  </span>
                  <button
                    className={`${styles.postSubmitButton} ${
                      !postContent.trim() && !fileContent ? styles.disabled : ""
                    }`}
                    onClick={handleUpload}
                    disabled={!postContent.trim() && !fileContent}
                  >
                    Post
                  </button>
                </div>
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                id="fileInput"
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept="image/*,video/*,.pdf,.doc,.docx"
              />
            </div>

            {/* ================================================================ */}
            {/* POSTS FEED SECTION */}
            {/* ================================================================ */}
            <div className={styles.feedContainer}>
              {/* Loading state */}
              {postState?.isLoading && (
                <div className={styles.loadingState}>
                  <div className={styles.spinner}></div>
                  Loading posts...
                </div>
              )}

              {/* Error state */}
              {postState?.isError && (
                <div className={styles.errorState}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  Error loading posts: {postState.message}
                </div>
              )}

              {/* Posts list */}
              {Array.isArray(posts) && posts.length > 0
                ? posts.map((post) => (
                    <article key={post._id} className={styles.postCard}>
                      {/* -------------------------------------------------------- */}
                      {/* POST HEADER (Author info, timestamp, menu) */}
                      {/* -------------------------------------------------------- */}
                      <header className={styles.postHeader}>
                        {/* Author profile image */}
                        <img
                          className={styles.postProfileImage}
                          src={
                            post.userId?.profilePicture
                              ? `${BASE_URL}/${post.userId.profilePicture}`
                              : `${BASE_URL}/default.jpg`
                          }
                          alt={post.userId?.name || "User"}
                          onError={(e) => {
                            e.target.src = `${BASE_URL}/default.jpg`;
                          }}
                        />

                        {/* Author information */}
                        <div className={styles.postUserInfo}>
                          <h3 className={styles.postUserName}>
                            {post.userId?.name || "Unknown User"}
                          </h3>
                          <p className={styles.postUserHandle}>
                            {post.userId?.username
                              ? `@${post.userId.username}`
                              : "Professional"}
                          </p>
                          <time className={styles.postTime}>
                            {formatTimeAgo(post.createdAt)}
                          </time>
                        </div>

                        {/* Post options menu button */}
                        <button
                          className={styles.postMenuButton}
                          aria-label="More options"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                          </svg>
                        </button>
                      </header>

                      {/* -------------------------------------------------------- */}
                      {/* POST CONTENT (Text and media) */}
                      {/* -------------------------------------------------------- */}
                      <div className={styles.postContent}>
                        {/* Post text content */}
                        {post.body && (
                          <p className={styles.postText}>{post.body}</p>
                        )}

                        {/* Post media (image, video, or document) */}
                        {post.media && (
                          <div className={styles.postMediaContainer}>
                            {/* Image media */}
                            {post.fileType?.startsWith("image") ? (
                              <img
                                className={styles.postMedia}
                                src={`${BASE_URL}/${post.media}`}
                                alt="Post media"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                }}
                              />
                            ) : post.fileType?.startsWith("video") ? (
                              /* Video media */
                              <video
                                className={styles.postMedia}
                                controls
                                src={`${BASE_URL}/${post.media}`}
                              >
                                Your browser does not support video.
                              </video>
                            ) : (
                              /* Document/other file types */
                              <div className={styles.documentPreview}>
                                <svg
                                  width="48"
                                  height="48"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                                </svg>
                                <a
                                  href={`${BASE_URL}/${post.media}`}
                                  download
                                  className={styles.documentLink}
                                >
                                  Download Document
                                </a>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* -------------------------------------------------------- */}
                      {/* POST ACTIONS (Like, Comment, Share, etc.) */}
                      {/* -------------------------------------------------------- */}
                      <div className={styles.postActions}>
                        {/* Like button */}
                        <button
                          className={`${styles.actionButton} ${
                            likedPosts.has(post._id) ? styles.liked : ""
                          }`}
                          onClick={() => handleLikePost(post._id)}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                          </svg>
                          <span>{post.likes || 0}</span>
                        </button>

                        {/* Comment button */}
                        <button
                          className={styles.actionButton}
                          onClick={() => toggleComments(post._id)}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
                          </svg>
                          <span>Comment</span>
                        </button>

                        {/* Share button */}
                        <button className={styles.actionButton}>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                            <polyline points="16,6 12,2 8,6" />
                            <line x1="12" y1="2" x2="12" y2="15" />
                          </svg>
                          <span>Share</span>
                        </button>

                        {/* Send button */}
                        <button className={styles.actionButton}>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path d="M5 12V7a5 5 0 1 1 10 0v5M3 12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6z" />
                          </svg>
                          <span>Send</span>
                        </button>

                        {/* Delete button (Heroicons Trash) */}
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={async () => {
                            await dispatch(
                              deletePost({
                                token: localStorage.getItem("token"),
                                post_id: post._id,
                              })
                            );
                            dispatch(getAllPost());
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            width="20"
                            height="20"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          <span>Delete</span>
                        </button>
                      </div>

                      {/* -------------------------------------------------------- */}
                      {/* COMMENTS SECTION (Expandable) */}
                      {/* -------------------------------------------------------- */}
                      {showComments[post._id] && (
                        <div className={styles.commentsSection}>
                          {/* Add new comment input */}
                          <div className={styles.addComment}>
                            <img
                              className={styles.commentProfileImage}
                              src={
                                authState.user.userId?.profilePicture
                                  ? `${BASE_URL}/${authState.user.userId.profilePicture}`
                                  : `${BASE_URL}/default.jpg`
                              }
                              alt="Your Profile"
                            />
                            <div className={styles.commentInputContainer}>
                              <input
                                type="text"
                                placeholder="Add a comment..."
                                value={commentText[post._id] || ""}
                                onChange={(e) =>
                                  handleCommentChange(post._id, e.target.value)
                                }
                                className={styles.commentInput}
                                onKeyPress={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleComment(post._id);
                                  }
                                }}
                              />
                              <button
                                onClick={() => handleComment(post._id)}
                                className={styles.commentSubmit}
                                disabled={!commentText[post._id]?.trim()}
                              >
                                Post
                              </button>
                            </div>
                          </div>

                          {/* Display existing comments */}
                          {post.comments && post.comments.length > 0 && (
                            <div className={styles.commentsList}>
                              {post.comments.map((comment, index) => (
                                <div key={index} className={styles.comment}>
                                  <img
                                    className={styles.commentProfileImage}
                                    src={
                                      comment.userId?.profilePicture
                                        ? `${BASE_URL}/${comment.userId.profilePicture}`
                                        : `${BASE_URL}/default.jpg`
                                    }
                                    alt={comment.userId?.name || "User"}
                                  />
                                  <div className={styles.commentContent}>
                                    <div className={styles.commentHeader}>
                                      <strong>
                                        {comment.userId?.name || "Anonymous"}
                                      </strong>
                                      <span className={styles.commentTime}>
                                        {formatTimeAgo(comment.createdAt)}
                                      </span>
                                    </div>
                                    <p className={styles.commentText}>
                                      {comment.comment}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </article>
                  ))
                : /* Empty state when no posts exist */
                  !postState?.isLoading && (
                    <div className={styles.emptyState}>
                      <svg
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
                      </svg>
                      <h3>No posts yet</h3>
                      <p>Be the first to share something with your network!</p>
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
            <h2>Loading your feed...</h2>
          </div>
        </DashboardLayout>
      </UserLayout>
    );
  }
}
