import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from './users.schema';
import { Comment, CommentSchema } from './comments.schema';
import { Likes, LikesSchema } from './likes.schema';

@Schema()
export class Posts {
  @Prop()
  img_url: string;

  @Prop()
  img_id: string;

  @Prop()
  comment: string;

  @Prop()
  createdAt: number;

  @Prop([CommentSchema])
  comments: Comment[];

  @Prop([LikesSchema])
  likes: Likes[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const PostsSchema = SchemaFactory.createForClass(Posts);
