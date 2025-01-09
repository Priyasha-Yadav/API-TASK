# Instagram-Inspired API

This is an API inspired by **Instagram**, built to manage users, posts, comments, followers, and stories. It includes functionality for users to create profiles, post content, interact with others through comments and likes, follow/unfollow users, and share temporary stories.


## Documentation

- **API Documentation**: [View API Documentation](https://documenter.getpostman.com/view/39189648/2sAYQUqu5o)
- **Project Files**: [Google Drive](https://drive.google.com/file/d/1hqV6c7SGVYGLJOp0FHZUyPyIO-VUdfNj/view?usp=drive_link)


## Features

- **User Management**: Create, update, and delete user profiles. Follow and unfollow other users.
- **Post Management**: Create posts, add captions, likes, and comments to posts.
- **Comment Management**: Add, update, and delete comments on posts. Like/dislike comments.
- **Followers Management**: Follow/unfollow users and manage follower relationships.
- **Stories**: Post stories that expire after 24 hours, with view counts.


## API Endpoints

The API exposes the following key features:

### **User Management**
- `GET /users`: Fetch all users.
- `GET /users/:userid`: Fetch a specific user by `userid`.
- `POST /users`: Create a new user profile.
- `PATCH /users/:userid`: Update a user's profile.
- `DELETE /users/:userid`: Delete a user profile.

### **Post Management**
- `GET /posts`: Fetch all posts.
- `GET /posts/:postid`: Fetch a post by `postid`.
- `POST /posts`: Create a new post.
- `PATCH /posts/:postid`: Update a post's caption.
- `DELETE /posts/:postid`: Delete a post.

### **Comment Management**
- `GET /posts/:postid/comments`: Fetch all comments on a specific post.
- `POST /posts/:postid/comments`: Add a new comment to a post.
- `PATCH /comments/:commentid`: Like/dislike a comment.
- `DELETE /comments/:commentid`: Delete a comment.

### **Followers Management**
- `GET /users/:userid/followers`: Fetch a specific user's followers.
- `POST /followers`: Follow a user.
- `DELETE /followers/:followerid`: Unfollow a user.

### **Story Management**
- `GET /stories`: Fetch all active (non-expired) stories.
- `POST /stories`: Post a new story.
- `DELETE /stories/:storyid`: Delete a story before it expires.


### Database Schema

This API uses MongoDB with the following collections:
- `users`: Stores user profiles with fields like `username`, `email`, `bio`, etc.
- `posts`: Stores posts with fields like `caption`, `imageURL`, `hashtags`, etc.
- `comments`: Stores comments associated with posts.
- `followers`: Stores relationships between users (who is following whom).
- `stories`: Stores temporary stories that expire after 24 hours.

---

