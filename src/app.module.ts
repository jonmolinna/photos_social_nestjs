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
    // MongooseModule.forRoot('mongodb://localhost:27017/photos_nestjs'),
    MongooseModule.forRoot(
      'mongodb+srv://jmolina2624:He5NVawhtImy0bnQ@cluster0.wy7i14p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    ),
    UsersModule,
    AuthModule,
    PostsModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService, IsUserAlreadyExist],
})
export class AppModule {}

//jmolina2624
// He5NVawhtImy0bnQ
