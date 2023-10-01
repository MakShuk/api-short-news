import {
	Body,
	Controller,
	Get,
	HttpException,
	HttpStatus,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { ResourceService } from './resource.service';
import { CreateResourceDto } from './dto/create-resource.dto';

@Controller('resource')
export class ResourceController {
	constructor(private readonly resourceService: ResourceService) {}

	@Get()
	@UsePipes(new ValidationPipe({ whitelist: true }))
	async createdResource(@Body() query: CreateResourceDto) {
		const createdResource = await this.resourceService.createdResource(query);
		if (createdResource.error) {
			throw new HttpException(`${createdResource.content}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return createdResource.content;
	}
}
