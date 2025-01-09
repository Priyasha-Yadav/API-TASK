const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;

app.use(express.json());


let db, users, likes, comments, stories, posts, followers;

async function connect() {
    try{
        const client = new MongoClient('mongodb://localhost:27017', { useUnifiedTopology: true });
        console.log("Connected to MongoDB");
        await client.connect();
        db = client.db('instagram');
        users = db.collection('users');
        likes = db.collection('likes');
        comments = db.collection('comments');
        stories = db.collection('stories');
        posts = db.collection('posts');
        followers = db.collection('followers');
        console.log("Connected to the collections");

        app.listen(port, () => {
            console.log(`Server is running at  http://localhost:${port}`);
        })

    }
    catch (error){
        console.error('Error connecting to the database', error);
        process.exit();
        //process.exit(1)
    }
}

connect();

// Users


// GET /users: Fetch all users.
app.get('/instagram/users', async (req, res) => {
    try {
        const allUsers = await users.find().toArray();
        res.status(200).json(allUsers); 
    } catch (error) {
        console.error('Error fetching users', error);
        res.status(500).json({ error: 'Error fetching users' }); 
    }
});

// GET /users/:id: Fetch a single user.

app.get('/instagram/users/:userid', async (req, res) => {
    try {
        const user = await users.findOne({ userId: (req.params.userid) });
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.status(200).json(user);
    } 
    catch (error) {
        console.error('Error fetching user', error);
        res.status(500).json({ error: 'Error fetching user' });
    }
});

// POST /users: Create a new user.
app.post('/instagram/users', async (req, res) => {  
    const { userId, username, fullName, email, bio, profilePicture } = req.body;

    try {
        const result = await users.insertOne({
            userId,
            username,
            fullName,
            email,
            bio,
            profilePicture,
            followers: 0,
            following: 0,
            posts: [],
            joinedDate: new Date(),
            isVerified: false
        });

        const newUser = { ...req.body, _id: result.insertedId };
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user', error);
        res.status(500).json({ error: 'Error creating user' });
    }
});

//PATCH /users/:id: Update a user.
app.patch('/instagram/users/:userid', async (req, res) => {
    try {
        const updatedUser = await users.updateOne({userId: (req.params.userid)},{ $set: req.body });
        if (updatedUser.matchedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully' });
    }
    catch (error) {
        console.error('Error updating user', error);
        res.status(500).json({ error: 'Error updating user' });
    }
                 
});

//DELETE /users/:id: Delete a user.
app.delete('/instagram/users/:userid', async (req, res) => {
    try {
        const deletedUser = await users.deleteOne({ userId: (req.params.userid) });
        if (deletedUser.deletedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting user', error);
        res.status(500).json({ error: 'Error deleting user' });
    }
});


// Posts

// GET /posts: Fetch all posts.
app.get('/instagram/posts', async (req, res) => {
    try{
        const allPosts = await posts.find().toArray();
        res.status(200).json(allPosts);
    }
    catch(error){
        console.error('Error fetching posts', error);
        res.status(500).json({ error: 'Error fetching posts' });
    }
    });
    
    // GET /posts/:id: Fetch a single post.
    app.get('/instagram/posts/:postid', async (req, res) => {
        try {
            const post = await posts.findOne({ postId: (req.params.postid) });
            
            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }
            
            res.status(200).json(post);
        } 
        catch (error) {
            console.error('Error fetching post', error);
            res.status(500).json({ error: 'Error fetching post' });
        }
    });

    // POST /posts: Create a new post.
    
    app.post('/instagram/posts', async (req, res) => {
        const { userId, caption, imageURL, hashtags, location } = req.body;
    
        try {
            const user = await users.findOne({ userId });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            const postCount = await posts.countDocuments();
            const postId = postCount + 1;
            const post = {
                userId,
                postId: `p00${postId}`,
                username: user.username,  
                fullName: user.fullName,
                caption,
                imageURL,
                hashtags: hashtags || [],
                location: location || null,
                createdAt: new Date(),
                likes: 0, 
                comments: [] 
            };
    
            const posResult = await posts.insertOne(post);
    
            res.status(201).json({ message: 'Post created successfully', postId: posResult.insertedId });
        } catch (error) {
            console.error('Error creating post', error);
            res.status(500).json({ error: 'Error creating post' });
        }
    });
          
    

    // PATCH /posts/:id: Update a post.
    app.patch('/instagram/posts/:postid', async (req, res) => {
        try {
            const updatedPost = await posts.updateOne({postId: (req.params.postid)},{ $set: req.body });
            if (updatedPost.matchedCount === 0) {
                return res.status(404).json({ error: 'Post not found' });
            }
            res.status(200).json({ message: 'Post updated successfully' });
        }
        catch (error) {
            console.error('Error updating post', error);
            res.status(500).json({ error: 'Error updating post' });
        }
                     
    });

    // DELETE /posts/:id: Delete a post.    
    app.delete('/instagram/posts/:postid', async (req, res) => {
        try {
            const deletedPost = await posts.deleteOne({ postId: (req.params.postid) });
    
            if (deletedPost.deletedCount === 0) {
                return res.status(404).json({ error: 'Post not found' });
            }
    
            res.status(200).json({ message: 'Post deleted successfully' });
        } catch (error) {
            console.error('Error deleting post', error);
            res.status(500).json({ error: 'Error deleting post' });
        }
    });
    

    // GET /posts/:postId/comments:
    
    app.get('/instagram/posts/:postid/comments', async (req, res) => {
        try {
            const post = await posts.findOne({ postId: (req.params.postid) });
    
            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }
    
            res.status(200).json(post.comments);
        } catch (error) {
            console.error('Error fetching comments', error);
            res.status(500).json({ error: 'Error fetching comments' });
        }
    });
    


    //POST /comments
app.post('/instagram/posts/:postid/comments', async (req, res) => {
    try{
        const post = await posts.findOne({ postId: (req.params.postid) });
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        const { userId, comment } = req.body;
        const user = await users.findOne({ userId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const commentCount = await comments.countDocuments();
        const commentId = commentCount + 1;
        const newComment = {
            commentId: `c00${commentId}`,
            userId,
            username: user.username,
            fullName: user.fullName,
            comment,
            createdAt: new Date()
        };
        await posts.updateOne({ postId: (req.params.postid) }, { $push: { comments: newComment } });
        res.status(201).json({ message: 'Comment created successfully'});
    }
    catch(error){
        console.error('Error creating comment', error);
        res.status(500).json({ error: 'Error creating comment' });
    }
});
    //PATCH /comments/:id: Update a comment.

    app.patch('/instagram/posts/:postid/comments/:commentid', async (req, res) => {
        try {
            const post = await posts.findOne({ postId: (req.params.postid) });
            if (!post) {
           return res.status(200).json({ message: 'Comment updated successfully' });
        } 
    }
        catch (error) {
            console.error('Error updating comment', error);
            res.status(500).json({ error: 'Error updating comment' });
        }
    });

    //DELETE /comments/:id: Delete a comment.
app.delete('/instagram/posts/:postid/comments/:commentid', async (req, res) => {
    try {
        const post = await posts.deleteOne({ postId: (req.params.postid) });   
        if(post){
            return res.status(200).json({ message: 'Comment deleted successfully' });}
    } catch (error) {
        console.error('Error deleting comment', error);
        res.status(500).json({ error: 'Error deleting comment' });
    }
});

//Folllowers
//GET /followers/:id: Fetch all followers of a user.
app.get('/instagram/followers/:userid', async (req, res) => {
    try{
        const allFollowers = await followers.find().toArray();
        res.status(200).json(allFollowers);
    }
    catch(error){
        console.error('Error fetching followers', error);
        res.status(500).json({ error: 'Error fetching followers' });
    }

});
//POST /followers/:id: Add a follower to a user.
app.post('/instagram/followers/:userid', async (req, res) => {
    try{
        const { userId, followerId } = req.body;
        const user = await users.findOne({ userId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const follower = await users.findOne({ userId: followerId });
        if (!follower) {
            return res.status(404).json({ error: 'Follower not found' });
        }
        const existingFollower = await followers.findOne({ userId, followerId });
        if (existingFollower) {
            return res.status(400).json({ error: 'Follower already exists' });
        }
        const newFollower = {
            userId,
            followerId,
            username: user.username,
            fullName: user.fullName,
            followerUsername: follower.username,
            followerFullName: follower.fullName,
            followedAt: new Date()
        };
        await followers.insertOne(newFollower);
        res.status(201).json({ message: 'Follower added successfully' });
    }
    catch(error){   
        console.error('Error adding follower', error);
        res.status(500).json({ error: 'Error adding follower' });
    }
});
//DELETE /followers/:id: Remove a follower from a user.
app.delete('/instagram/followers/:userid', async (req, res) => {
    try {
        const deletedFollower = await followers.deleteOne({ userId: (req.params.userid) });
        if (deletedFollower.deletedCount === 0) {
            return res.status(404).json({ error: 'Follower not found' });
        }
        res.status(200).json({ message: 'Follower deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting follower', error);
        res.status(500).json({ error: 'Error deleting follower' });
    }
});

// Stories
//GET /stories
app.get('/instagram/stories', async (req, res) => {
    try{
        const allStories = await stories.find().toArray();
        res.status(200).json(allStories);
    }
    catch(error){
        console.error('Error fetching stories', error);
        res.status(500).json({ error: 'Error fetching stories' });
    }
});
//POST /stories
app.post('/instagram/stories', async (req, res) => {
    const { userId, storyURL, hashtags, location } = req.body;
    try{
        const user = await users.findOne({ userId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const storyCount = await stories.countDocuments();
        const storyId = storyCount + 1;
        const story = {
            userId,
            storyId: `s00${storyId}`,
            username: user.username,
            fullName: user.fullName,
            storyURL,
            hashtags: hashtags || [],
            location: location || null,
            createdAt: new Date()
        };
        const storyResult = await stories.insertOne(story);
        res.status(201).json({ message: 'Story created successfully', storyId: storyResult.insertedId });
    }
    catch(error){
        console.error('Error creating story', error);
        res.status(500).json({ error: 'Error creating story' });
    }
});
//DELETE /stories/:id
app.delete('/instagram/stories/:storyid', async (req, res) => {
    try{
        const deletedStory = await stories.deleteOne({ storyId: (req.params.storyid) });
        if (deletedStory.deletedCount === 0) {
            return res.status(404).json({ error: 'Story not found' });
        }
        res.status(200).json({ message: 'Story deleted successfully' });
    }
    catch{
        console.error('Error deleting story', error);
        res.status(500).json({ error: 'Error deleting story' });
    }
});