const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { requireUser } = require("./token")

//Get all posts
//Works
router.get("/", async (req, res) => {
    try {
        const posts = await prisma.post.findMany();
        res.json(posts)
    } catch (error) {
        console.error('Error getting posts:', error);
        res.status(500).json({ error: "An error occured while fetching the posts." })
    }
})

//Get Post by ID
//Works
router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const postId = parseInt(id);
      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.status(200).json(post);
    } catch (error) {
      console.error("Error retrieving Post:", error);
      res
        .status(500)
        .json({ error: "An error occurred while retrieving the post." });
    }
  });

//Create a new post
//SUCCESS!!!
  router.post("/", requireUser, async (req, res) => {
    try {
      const { title, content } = req.body;
      const userId = req.user.id;
      const newPost = await prisma.post.create({
        data: {
          title,
          content,
          user: { connect: { id: userId } }
        },
      });
      res.status(201).json(newPost);
    } catch (error) {
      console.log("Error creating post:", error);
      res
        .status(500)
        .json({ error: "An error occurred while creating the post" });
    }
  });

//Put the change a post
//WORKS!
  router.put("/:id", requireUser, async (req, res) => {
    try {
      const { title, content } = req.body;
      const userId = req.user.id;
      const postIdToUpdate = parseInt(req.params.id);

      const updatePost = await prisma.post.update({
        where: {
          id: postIdToUpdate,
        },
        data: {
          title,
          content,
          user: { connect: { id: userId } }
        },
      });
      res.status(200).json(updatePost);
    } catch (error) {
      console.log("Error modifying post:", error);
      res
        .status(500)
        .json({ error: "An error occured when modifying" });
    }
  });
  
//Delete a post
//Works!
  router.delete("/:id", requireUser, async (req, res) => {
    try {
      const { id } = req.params;
      const postId = parseInt(id);
      await prisma.post.delete({
        where: {
          id: postId,
        },
      });
      res.status(204).json({ message: "Post deleted successfully" });
    } catch (error) {
      console.log("Error deleting post:", error);
      res
        .status(500)
        .json({ error: "An error occured when deleting" });
    }
  });

module.exports = router;
