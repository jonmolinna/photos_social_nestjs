import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Posts, PostsSchema } from 'src/schemas/posts.schema';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Posts.name, schema: PostsSchema }]),
    CloudinaryModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
