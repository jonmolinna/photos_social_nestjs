import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Posts } from 'src/schemas/posts.schema';
import { CreatePostDto } from './dtos/create-post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Posts.name) private postModel: Model<Posts>) {}

  async findOnePostById(id: string): Promise<Posts> {
    return this.postModel.findOne({ _id: id });
  }

  async addPost(createPostDto: CreatePostDto): Promise<Posts> {
    return this.postModel.create(createPostDto);
  }

  async getAllPosts(): Promise<Posts[]> {
    return await this.postModel
      .find()
      .populate('user', '-password')
      .populate({ path: 'comments.user', select: '-password' })
      .populate({ path: 'likes.user', select: '-password' })
      .sort({ createdAt: -1 });
  }

  async getAllPostsUserById(id: string): Promise<Posts[]> {
    return await this.postModel
      .find({ user: id })
      .populate('user', '-password')
      .populate({ path: 'comments.user', select: '-password' })
      .populate({ path: 'likes.user', select: '-password' })
      .sort({ createdAt: -1 });
  }

  async likePost(idPost: string, idUser) {
    const post = await this.postModel.findById(idPost);
    if (post) {
      // No Like
      if (post.likes.find((like) => like.user.toString() === idUser)) {
        post.likes = post.likes.filter(
          (like) => like.user.toString() !== idUser,
        );
      } else {
        post.likes.push({ user: idUser });
      }
      await post
        .save()
        .then((post) =>
          post.populate({ path: 'likes.user', select: '-password' }),
        );
      return post.likes;
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
      post.save();
      return post.likes;
    }
  }
}
