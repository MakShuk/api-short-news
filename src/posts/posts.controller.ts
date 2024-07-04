import {
	Body,
	Controller,
	Get,
	HttpException,
	HttpStatus,
	Post,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-posts.dto';
import { LoggerService } from 'src/services/logger/logger.service';
import { FileService } from 'src/file/file.service';

@Controller('posts')
export class PostsController {
	constructor(
		private readonly postsService: PostsService,
		private readonly logger: LoggerService,
		private fileService: FileService,
	) {}

	@Post()
	@UsePipes(new ValidationPipe({ whitelist: true }))
	async createPost(@Body() query: CreatePostDto) {
		const { tags = [1], ...rest } = query;
		this.logger.info(`Получен запрос на создание нового поста: ${rest.originalTitle}`);
		const createPost = await this.postsService.createPost(rest, tags);
		if (createPost.error) {
			this.logger.error(`Пост не создан, ошибка: ${createPost.content}`);
			throw new HttpException(`${createPost.content}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		await this.fileService.saveAllImages();
		this.logger.info(`Создана запись в базе данных: ${rest.originalTitle}`);
		return createPost.content;
	}

	@Get('checkUniq')
	@UsePipes(new ValidationPipe({ whitelist: true }))
	async checkingUniqueValues(
		@Body() data: Pick<CreatePostDto, 'originalTitle' | 'imageUrl' | 'originalUrl'>[],
	) {
		this.logger.info(`Получен запрос на поиск уникальных значение, число объектов ${data.length}`);
		const checkStatus = await this.postsService.checkingUniqueValues(data);
		if (checkStatus.error) {
			this.logger.error(`Ошибка получения уникальных значений: ${checkStatus.content}`);
			throw new HttpException(`${checkStatus.content}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		this.logger.info(`Возращены значения отсутствующие в базе ${checkStatus.data?.length}`);
		return checkStatus;
	}

	@Get('last-posts')
	async findLastPosts(@Query() queryParams: { limit: string; offset: string }) {
		this.logger.info(`Получен запрос на поиск  ${queryParams.limit || '5'} последних постов`);
		const lastPosts = await this.postsService.findLastPosts(
			Number(queryParams.limit) || 5,
			Number(queryParams.offset) || 0,
		);
		if (lastPosts.error || !lastPosts.data) {
			this.logger.error(
				`Ошибка получения  ${queryParams.limit} последних постов: ${lastPosts.content}`,
			);
			throw new HttpException(`${lastPosts.content}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		this.logger.info(
			`Возращены ${queryParams.limit} последних постов смещение: ${queryParams.offset}`,
		);
		return lastPosts.data;
	}

	@Get()
	async getPostByID(@Query() queryParams: { id: string }) {
		const postByID = await this.postsService.getPostByID(+queryParams.id);
		if (postByID.error || !postByID.data) {
			this.logger.error(`post id: ${queryParams.id} error: ${postByID.content}`);
			throw new HttpException(`${postByID.content}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		this.logger.info(`Возращен  post id: ${queryParams.id}`);
		return postByID.data;
	}
}
