import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    axios.get('/api/posts').then(res => setPosts(res.data));
  }, []);

  const handleLogin = async () => {
    const res = await axios.post('/api/login', { username: 'admin', password: 'admin' });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
  };

  const createPost = async () => {
    await axios.post('/api/posts', { title, content }, { headers: { Authorization: token } });
    setPosts([...posts, { title, content }]);
    setTitle('');
    setContent('');
  };

  return (
    <div>
      <h1>DevOps Blog</h1>
      {!token && <button onClick={handleLogin}>Login</button>}
      {token && (
        <div>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder='Title' />
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder='Content' />
          <button onClick={createPost}>Post</button>
        </div>
      )}
      <ul>
        {posts.map((post, index) => (
          <li key={index}><h2>{post.title}</h2><p>{post.content}</p></li>
        ))}
      </ul>
    </div>
  );
};

export default App;
