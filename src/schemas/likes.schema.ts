import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './users.schema';
import mongoose from 'mongoose';

@Schema()
export class Likes {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop()
  createdAt: number;
}

export const LikesSchema = SchemaFactory.createForClass(Likes);
