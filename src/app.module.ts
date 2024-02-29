import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { IsUserAlreadyExist } from './decorators/IsUserAlreadyExist.decorators';
import { PostsModule } from './posts/posts.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/photos_nestjs'),
    UsersModule,
    AuthModule,
    PostsModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService, IsUserAlreadyExist],
})
export class AppModule {}
