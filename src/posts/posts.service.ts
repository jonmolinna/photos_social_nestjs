import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Posts } from 'src/schemas/posts.schema';
import { CreatePostDto } from './dtos/create-post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Posts.name) private postModel: Model<Posts>) {}

  async addPost(createPostDto: CreatePostDto): Promise<Posts> {
    return this.postModel.create(createPostDto);
  }

  async getAllPosts(): Promise<Posts[]> {
    return await this.postModel
      .find()
      .populate('user', '-password')
      .sort({ createdAt: -1 });
  }

  async getAllPostsUserById(id: string): Promise<Posts[]> {
    const res = await this.postModel.findById(id);
    console.log('YOOO', res);
    return await this.postModel.find({ _id: id });
  }
}
