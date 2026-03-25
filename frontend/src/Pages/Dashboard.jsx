import { useEffect, useState } from "react";
import axios from "axios";
import './Dashboard.css';
import { MdAddPhotoAlternate } from "react-icons/md";
import { FcLike } from "react-icons/fc";
import { FaCommentDots } from "react-icons/fa6";

function Dashboard() {
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("user");
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [commentText, setCommentText] = useState({});
  const [userLikes, setUserLikes] = useState([]);
   const [imagePreview, setImagePreview] = useState(null); 
const [selectedPost, setSelectedPost] = useState(null); 
  const isLiked = (postId) => userLikes.includes(postId);


  // 🔹 Fetch posts
  const fetchPosts = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/posts`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setPosts(res.data);
       const likesArray = [];
      res.data.forEach(post => {
        if (post.likedBy?.includes(userName)) {
          likesArray.push(post._id);
        }
      });
      setUserLikes(likesArray);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file || null);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  // 🔹 Create Post
  const handlePost = async (e) => {
    e.preventDefault();

    if (!text && !image) {
      alert("Add text or image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("text", text);
      if (image) formData.append("image", image);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/posts`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setText("");
      setImage(null);

      fetchPosts(); // 🔥 instant update

    } catch (err) {
      console.log(err);
    }
  };

  // 🔹 Like
  const handleLike = async (id) => {
    const currentlyLiked = isLiked(id);
    
    // Optimistic update
    if (currentlyLiked) {
      setUserLikes(prev => prev.filter(likeId => likeId !== id));
    } else {
      setUserLikes(prev => [...prev, id]);
    }
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/posts/${id}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      fetchPosts(); // 🔥 instant update

    } catch (err) {
        if (currentlyLiked) {
        setUserLikes(prev => [...prev, id]);
      } else {
        setUserLikes(prev => prev.filter(likeId => likeId !== id));
      }
      console.log(err);
    }
  };

  // 🔹 Comment
  const handleComment = async (id) => {
    try {
      if (!commentText[id]) return;

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/posts/${id}/comment`,
        { text: commentText[id] },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setCommentText({ ...commentText, [id]: "" });

      fetchPosts(); // 🔥 instant update

    } catch (err) {
      console.log(err);
    }
  };

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
     <div className="dashboard-container">

    {/* 🔹 Navbar */}
    <div className="dashboard-header">
      <h2>ChatSphere</h2>
      <div className="nav-right">

    {/* 🔹 Profile Circle */}
    <div className="profile-circle">
      {userName?.charAt(0).toUpperCase()}
    </div>

    {/* 🔹 Username */}
    <span className="nav-username">{userName}</span>

    {/* 🔹 Logout */}
    <button className="logout-btn" onClick={handleLogout}>
      Logout
    </button>

  </div>
    </div>

    {/* 🔹 Create Post Card */}
    <div className="create-post-card">
      <form onSubmit={handlePost} className="post-form">

        <textarea
          className="post-textarea"
          placeholder="Whats on your mind ??..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="post-actions">
            <label htmlFor="image-upload" className="image-upload-btn">
                <MdAddPhotoAlternate size={32} className="photo-icon" />
            </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="file-input"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
           {imagePreview && (
    <div className="image-preview-container">
      <img src={imagePreview} alt="Preview" className="image-preview" />
      <button 
        type="button" 
        className="remove-preview"
        onClick={() => {
          setImage(null);
          setImagePreview(null);
          document.getElementById('image-upload').value = '';
        }}
      >
        ✕
      </button>
    </div>
  )}
          <button type="submit" className="post-btn">
            Post
          </button>
        </div>

      </form>
    </div>

    {/* 🔹 Feed */}
   <div className="feed-container">
  {posts.map((post) => (
    <div key={post._id} className="post-card">

      {/* 🔹 User */}
     <div className="post-header">
  <div className="profile-circle">
    {post.user.charAt(0).toUpperCase()}
  </div>
  
  <div className="post-user-details">
    <h4>{post.userName}</h4>
    <div className="user-meta">
      <small className="post-email">{post.useremail}</small>
      <small className="post-user">{post.user}</small>
      <small className="post-date">
        {post.createdAt && new Date(post.createdAt).toLocaleString('en-IN')}
      </small>
    </div>
  </div>
  
  <button className="follow-btn">Follow</button>
</div>


      {/* 🔹 Content */}
      <div className="post-content">
        <p>{post.text}</p>

        {post.image && (
          <img src={post.image} alt="post" className="post-image" />
        )}
      </div>

      {/* 🔹 Stats */}
 <div className="post-stats">
  <button className="stat-btn like-stat" onClick={() => handleLike(post._id)}>
    <FcLike size={20} className={`like-icon ${isLiked(post._id) ? 'liked' : ''}`} />
    <span>{post.likesCount}</span>
  </button>
  <button 
  className={`stat-btn comment-stat ${post.commentsCount > 0 ? 'has-comments' : ''}`} 
  onClick={() => setSelectedPost(post)} // ✅ Open modal
>
    <FaCommentDots size={18} />
    <span>{post.commentsCount || 'Comment'}</span>
  </button>
</div>


 

    </div>
  ))}</div>
  {/* ✅ FULLSCREEN COMMENT MODAL */}
{selectedPost && (
  <div className="comment-modal-overlay" onClick={() => setSelectedPost(null)}>
    <div className="comment-modal" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <button className="close-modal" onClick={() => setSelectedPost(null)}>✕</button>
        <h3>Comments ({selectedPost.commentsCount || 0})</h3>
      </div>
      
      <div className="modal-comments">
        {selectedPost.comments.length === 0 ? (
          <div className="no-comments-modal">
            <p>No comments yet</p>
          </div>
        ) : (
          selectedPost.comments.map((c, i) => (
            <div key={i} className="modal-comment">
              <div className="comment-avatar">
                {c.user.charAt(0).toUpperCase()}
              </div>
              <div className="comment-content">
                <div className="comment-header">
                  <span className="comment-author">{c.user}</span>
                  <span className="comment-time">
                    {new Date(c.createdAt).toLocaleString()}
                  </span>
                </div>
                <p>{c.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="modal-input-section">
        <input
          type="text"
          placeholder="Write a comment..."
          className="modal-comment-input"
          value={commentText[selectedPost._id] || ""}
          onChange={(e) => setCommentText({
            ...commentText,
            [selectedPost._id]: e.target.value
          })}
        />
        <button 
          className="modal-post-comment"
          onClick={() => handleComment(selectedPost._id)}
        >
          Post
        </button>
      </div>
    </div>
  </div>
)}

</div>
  );
}

export default Dashboard;