import {
	Body,
	Controller,
	Get,
	HttpException,
	HttpStatus,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-posts.dto';

@Controller('posts')
export class PostsController {
	constructor(private readonly postsService: PostsService) {}

	@Get()
	@UsePipes(new ValidationPipe({ whitelist: true }))
	async createPost(@Body() query: CreatePostDto) {
		const { tags, ...rest } = query;
		const createPost = await this.postsService.createPost(rest, tags);
		if (createPost.error) {
			throw new HttpException(`${createPost.content}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return createPost.content;
	}

	@Get('chekUniq')
	@UsePipes(new ValidationPipe({ whitelist: true }))
	async checkingUniqueValues(
		@Body() data: Pick<CreatePostDto, 'originalTitle' | 'imageUrl' | 'originalUrl'>[],
	) {
		const chekStatus = await this.postsService.checkingUniqueValues(data);
		if (chekStatus.error) {
			throw new HttpException(`${chekStatus.content}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return chekStatus;
	}
}
