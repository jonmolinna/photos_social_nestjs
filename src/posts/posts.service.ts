import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Posts } from 'src/schemas/posts.schema';
import { CreatePostDto } from './dtos/create-post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Posts.name) private postModel: Model<Posts>) {}

  // Find a Post By Id
  async findOnePostById(id: string): Promise<Posts> {
    const response = await this.postModel
      .findOne({ _id: id })
      .populate('user', '-password')
      .populate({ path: 'comments.user', select: '-password' })
      .populate({ path: 'likes.user', select: '-password' })
      .populate({ path: 'bookmark.user', select: '-password' });
    return response;
  }

  // Add a Post
  async addPost(createPostDto: CreatePostDto): Promise<Posts> {
    return this.postModel.create(createPostDto);
  }

  // Get All Posts
  async getAllPosts(): Promise<Posts[]> {
    return await this.postModel
      .find()
      .populate('user', '-password')
      .populate({ path: 'comments.user', select: '-password' })
      .populate({ path: 'likes.user', select: '-password' })
      .populate({ path: 'bookmark.user', select: '-password' })
      .sort({ createdAt: -1 });
  }

  // Get All Posts User by Id
  async getAllPostsUserById(id: string): Promise<Posts[]> {
    return await this.postModel
      .find({ user: id })
      .populate('user', '-password')
      .populate({ path: 'comments.user', select: '-password' })
      .populate({ path: 'likes.user', select: '-password' })
      .populate({ path: 'bookmark.user', select: '-password' })
      .sort({ createdAt: -1 });
  }

  //  Get Posts Likes by User Id
  async getAllPostsLikesUserById(id: string): Promise<Posts[]> {
    const rest = await this.postModel
      .find({
        likes: { $elemMatch: { user: id } },
      })
      .sort({ 'likes.createdAt': -1 });
    return rest;
  }

  // Add a Like or Dislike a Post
  async likePost(idPost: string, idUser) {
    const post = await this.postModel.findById(idPost);
    if (post) {
      // No Like
      if (post.likes.find((like) => like.user.toString() === idUser)) {
        post.likes = post.likes.filter(
          (like) => like.user.toString() !== idUser,
        );
      } else {
        post.likes.push({ user: idUser, createdAt: Date.now() });
      }
      await post
        .save()
        .then((post) =>
          post.populate({ path: 'likes.user', select: '-password' }),
        );
      return post.likes;
    }
  }

  // Get Posts Likes by User Id
  async getAllPostsBooksUserById(id: string): Promise<Posts[]> {
    const rest = await this.postModel
      .find({
        bookmark: { $elemMatch: { user: id } },
      })
      .sort({ 'bookmark.createdAt': -1 });

    return rest;
  }

  // Saved o Delete Book Post
  async bookmark(idPost: string, idUser) {
    const post = await this.postModel.findById(idPost);
    if (post) {
      // Delete Guard
      if (post.bookmark.find((book) => book.user.toString() === idUser)) {
        post.bookmark = post.bookmark.filter(
          (book) => book.user.toString() !== idUser,
        );
      } else {
        post.bookmark.push({ user: idUser, createdAt: Date.now() });
      }

      await post
        .save()
        .then((post) =>
          post.populate({ path: 'bookmark.user', select: '-password' }),
        );
      return post.bookmark;
    }
  }

  async addComment(idPost: string, idUser, comment: string) {
    const post = await this.postModel.findById(idPost);
    if (post) {
      post.comments.unshift({
        comment: comment,
        user: idUser,
        createdAt: Date.now(),
      });
      await post
        .save()
        .then((post) =>
          post.populate({ path: 'comments.user', select: '-password' }),
        );
      return post.comments[0];
    }
  }

  async deleteComment(idPost: string, idUser: string, idComment: string) {
    const post = await this.postModel.findByIdAndUpdate(
      { _id: idPost },
      {
        $pull: {
          // comments: { _id: idComment },
          comments: { _id: idComment, user: { _id: idUser } },
        },
      },
      { new: true },
    );
    await post
      .save()
      .then((post) =>
        post.populate({ path: 'comments.user', select: '-password' }),
      );

    return post.comments;
  }
}
