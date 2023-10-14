import {
	Body,
	Controller,
	Get,
	HttpException,
	HttpStatus,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-posts.dto';
import { LoggerService } from 'src/services/logger/logger.service';

@Controller('posts')
export class PostsController {
	constructor(
		private readonly postsService: PostsService,
		private readonly logger: LoggerService,
	) {}

	@Post()
	@UsePipes(new ValidationPipe({ whitelist: true }))
	async createPost(@Body() query: CreatePostDto) {
		const { tags = [1], ...rest } = query;
		this.logger.info(`Получен за11проc на создание нового поста: ${rest.originalTitle}`);
		const createPost = await this.postsService.createPost(rest, tags);
		if (createPost.error) {
			this.logger.error(`Пост не создан, ошибка: ${createPost.content}`);
			throw new HttpException(`${createPost.content}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		this.logger.info(`Создана зяпись в базе данных: ${rest.originalTitle}`);
		return createPost.content;
	}

	@Get('chekUniq')
	@UsePipes(new ValidationPipe({ whitelist: true }))
	async checkingUniqueValues(
		@Body() data: Pick<CreatePostDto, 'originalTitle' | 'imageUrl' | 'originalUrl'>[],
	) {
		this.logger.info(`Получен запрос на поиск уникальных значени, чило обьетов ${data.length}`);
		const chekStatus = await this.postsService.checkingUniqueValues(data);
		if (chekStatus.error) {
			this.logger.error(`Ошибка получения уникальных значений: ${chekStatus.content}`);
			throw new HttpException(`${chekStatus.content}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		this.logger.info(`Возращены значения отсутсвующие в базе ${chekStatus.data?.length}`);
		return chekStatus;
	}
}
