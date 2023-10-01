import { Body, Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-posts.dto';

@Controller('posts')
export class PostsController {
	constructor(private readonly postsService: PostsService) {}

	@Get()
	async createPost(@Body() query: CreatePostDto) {
		const { tags, ...rest } = query;
		const createPost = await this.postsService.createPost(rest, tags);
		if (createPost.error) {
			throw new HttpException(`${createPost.content}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return createPost.content;
	}
}
