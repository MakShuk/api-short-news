import { Body, Controller, Get } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
	constructor(private readonly postsService: PostsService) {}

	@Get()
	setPost(@Body() query: any) {
		this.postsService.createPost(query);
	}
}
