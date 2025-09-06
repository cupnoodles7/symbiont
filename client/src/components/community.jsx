import React, { useState } from "react";
import "./community.css";

const Community = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "Aarav",
      content: "Just finished a 5K run 🏃‍♂️💨 Feeling amazing!",
      image: null,
      likes: 12,
      comments: ["Great job!", "Keep it up 💪"],
      likedByUser: false,
    },
    {
      id: 2,
      user: "Meera",
      content:
        "Sharing my favorite healthy breakfast: oats with banana 🍌🥣",
      image:
        "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=710&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      likes: 8,
      comments: ["Looks delicious!", "Recipe pls 🙏"],
      likedByUser: false,
    },
  ]);

  const [newPost, setNewPost] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState("");

  // handle new post submit
  const handlePost = () => {
    if (!newPost.trim() && !newImage) return;

    const post = {
      id: Date.now(),
      user: "You",
      content: newPost,
      image: newImage ? URL.createObjectURL(newImage) : null,
      likes: 0,
      comments: [],
      likedByUser: false,
    };

    setPosts([post, ...posts]);
    setNewPost("");
    setNewImage(null);
    setSelectedFile("");
  };

  // like/unlike a post
  const handleLike = (id) => {
    setPosts(
      posts.map((post) => {
        if (post.id === id) {
          return {
            ...post,
            likes: post.likedByUser ? post.likes - 1 : post.likes + 1,
            likedByUser: !post.likedByUser,
          };
        }
        return post;
      })
    );
  };

  // add a comment
  const handleComment = (id, comment) => {
    setPosts(
      posts.map((post) =>
        post.id === id
          ? { ...post, comments: [...post.comments, comment] }
          : post
      )
    );
  };

  // handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setSelectedFile(file.name);
    }
  };

  return (
    <div className="community-container">
      {/* Create Post */}
      <div className="create-post">
        <textarea
          placeholder="Share your workout or recipe..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <div className="create-actions">
          {/* Custom file input */}
          <label htmlFor="file-upload" className="custom-file-upload">
            📷 Upload Image
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {selectedFile && <span className="file-chosen">{selectedFile}</span>}

          <button onClick={handlePost} className="post-btn">
            Post
          </button>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="posts-feed">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <h4 className="post-user">👤 {post.user}</h4>
            <p className="post-content">{post.content}</p>
            {post.image && (
              <img src={post.image} alt="post" className="post-img" />
            )}

            <div className="post-actions">
              <button 
                onClick={() => handleLike(post.id)}
                className={`like-btn ${post.likedByUser ? 'liked' : ''}`}
              >
                {post.likedByUser ? '❤️' : '🤍'} {post.likes}
              </button>
            </div>

            {/* Comments */}
            <div className="comments">
              {post.comments.map((c, i) => (
                <p key={i} className="comment">
                  💬 {c}
                </p>
              ))}
              <input
                type="text"
                placeholder="Write a comment..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim()) {
                    handleComment(post.id, e.target.value);
                    e.target.value = "";
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;