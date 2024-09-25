import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Get,
  Param,
  Put,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ParseObjectIdPipe } from 'src/utilities/parse-object-id-pipe.pipe';
import { CreateCommentDto } from './dtos/create-comment.dto';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // Get one Post by Id
  @UseGuards(AuthGuard)
  @Get('post/:id')
  async findOnePostById(@Param('id', ParseObjectIdPipe) id: string) {
    return this.postsService.findOnePostById(id);
  }

  // Add a Post
  @UseGuards(AuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 /**2MB */ }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() createPostDto: CreatePostDto,
    @Request() req,
  ) {
    const res = await this.cloudinaryService.uploadFile(file);
    return await this.postsService.addPost({
      img_url: res.secure_url,
      img_id: res.public_id,
      comment: createPostDto.comment,
      createdAt: Date.now(),
      user: req.user.sub,
    });
  }

  // Get All Posts
  @UseGuards(AuthGuard)
  @Get('posts')
  async getAllPosts() {
    return this.postsService.getAllPosts();
  }

  // @UseGuards(AuthGuard)
  // @Get('posts_user')
  // async getAllPostsUserById(@Request() req) {
  //   return this.postsService.getAllPostsUserById(req.user.sub);
  // }

  // Get Posts by User Id
  @UseGuards(AuthGuard)
  @Get('post_user/:id')
  async getAllPostsUserById(@Param('id', ParseObjectIdPipe) id: string) {
    return this.postsService.getAllPostsUserById(id);
  }

  // Get Posts Likes by User Id
  @UseGuards(AuthGuard)
  @Get('posts_user_likes/:id')
  async getAllPostsLikesUserById(@Param('id', ParseObjectIdPipe) id: string) {
    return this.postsService.getAllPostsLikesUserById(id);
  }

  // Like o Deslike a Post
  @UseGuards(AuthGuard)
  @Post('post_like/:id')
  async addLike(@Param('id', ParseObjectIdPipe) id: string, @Request() req) {
    return this.postsService.likePost(id, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Get('posts_user_bookMark/:id')
  async getAllPostsBooksUserById(@Param('id', ParseObjectIdPipe) id: string) {
    return this.postsService.getAllPostsBooksUserById(id);
  }

  // Saved BookMark a Post by Id
  @UseGuards(AuthGuard)
  @Post('post_bookmark/:id')
  async addBookmark(
    @Param('id', ParseObjectIdPipe) id: string,
    @Request() req,
  ) {
    return this.postsService.bookmark(id, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Post('post_comment/:id')
  async addCommentPost(
    @Param('id', ParseObjectIdPipe) id: string,
    @Request() req,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.postsService.addComment(
      id,
      req.user.sub,
      createCommentDto.comment,
    );
  }

  @UseGuards(AuthGuard)
  @Put('post_comment/:idPost/:idComment')
  async deleteCommentPost(
    @Param('idPost', ParseObjectIdPipe) idPost: string,
    @Param('idComment', ParseObjectIdPipe) idComment: string,
    @Request() req,
  ) {
    return this.postsService.deleteComment(idPost, req.user.sub, idComment);
  }
}
