const request = require("supertest");
const app = require("../server");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//Get all posts
describe("GET /api/posts", () => {
    it("returns all posts", async () => {
      const response = await request(app)
        .get("/api/posts")

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
  
      response.body.forEach((post) => {
        expect(post).toHaveProperty("id");
        expect(post).toHaveProperty("title");
        expect(post).toHaveProperty("content");
      });
    });
  });

  //get post by id
  describe("GET /api/posts/:id", () => {
    it("returns a specific post when valid ID is provided", async () => {
      const postId = 1;
      const response = await request(app)
        .get(`/api/posts/${postId}`)

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", postId);
      expect(response.body).toHaveProperty("title");
      expect(response.body).toHaveProperty("content");
    });
  });


  //Create a Post and Update a Post
  describe('Create and Update Posts', () => {
    let token;
    let postId;
  
    beforeAll(() => {
      const mockUser = {
        id: 1,
        username: 'TestUser',
      };
      token = jwt.sign(mockUser, process.env.JWT);
    });
  
    it('creates a new post', async () => {
      const newPostData = {
        title: 'Test Post',
        content: 'This is a test post content.',
      };
  
      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send(newPostData);
  
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Test Post');
      expect(response.body.content).toBe('This is a test post content.');
      expect(response.body.userId).toBe(1);
  
      postId = response.body.id;
    });
  
    it('updates an existing post', async () => {
      const updatedPostData = {
        title: 'Updated Test Post',
        content: 'This is updated content for the test post.',
      };
  
      const response = await request(app)
        .put(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedPostData);
  
      expect(response.status).toBe(200); 
      expect(response.body).toHaveProperty('id', postId);
      expect(response.body.title).toBe('Updated Test Post');
      expect(response.body.content).toBe('This is updated content for the test post.');
      expect(response.body.userId).toBe(1); 
    });
  });
  
//Delete a Post
describe("DELETE /api/posts/:id", () => {
    let token;
    let postId;
    beforeAll(async () => {
      const mockUser = {
        id: 1,
        username: "Bob Test",
      };
      token = jwt.sign(mockUser, process.env.JWT);
  
      //Create a post in test prior to testing DELETE.
      const newPostData = {
        title: "New Post to Delete",
        content: "To Be Deleted",
      };
      const response = await request(app)
        .post("/api/posts")
        .set("Authorization", `Bearer ${token}`)
        .send(newPostData);
  
        postId = response.body.id;
    });
    //Testing Delete function
    it("deletes an existing post", async () => {
      const response = await request(app)
        .delete(`/api/posts/${postId}`)
        .set("Authorization", `Bearer ${token}`);
  
      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });
  });