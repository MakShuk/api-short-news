import {
	Body,
	Controller,
	Get,
	HttpException,
	HttpStatus,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tags.dto';

@Controller('tags')
export class TagsController {
	constructor(private readonly tagsService: TagsService) {}

	@Get()
	@UsePipes(new ValidationPipe({ whitelist: true }))
	async createTag(@Body() query: CreateTagDto) {
		const createTag = await this.tagsService.createdTag(query);
		if (createTag.error) {
			throw new HttpException(`${createTag.content}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return createTag.content;
	}
}
