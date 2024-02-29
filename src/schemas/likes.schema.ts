import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './users.schema';
import mongoose from 'mongoose';

@Schema()
export class Likes {
  @Prop()
  createdAt: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const LikesSchema = SchemaFactory.createForClass(Likes);
