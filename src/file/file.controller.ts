import {
	Controller,
	Get,
	HttpException,
	HttpStatus,
	Post,
	Query,
	Res,
	StreamableFile,
} from '@nestjs/common';
import { FileService } from './file.service';
import { Response } from 'express';
import { LoggerService } from 'src/services/logger/logger.service';

@Controller('file')
export class FileController {
	constructor(private readonly fileService: FileService, private readonly logger: LoggerService) {}

	@Post('download')
	async downloadFileToUrl() {
		const posts = await this.fileService.getUpdatePost();
		for (const post of posts) {
			if (post.resourceName) {
				await this.fileService.downloadResourceFile(
					post.imageUrl,
					post.resourceName,
					post.id.toString(),
				);
			}
		}
	}

	@Get('img')
	async getFile(
		@Res({ passthrough: true }) res: Response,
		@Query() queryParams: { folder: string; id: string; ex: string },
	) {
		res.set({
			'Content-Type': 'image/jpeg',
			'Content-Disposition': 'attachment; filename="1.jpg"',
		});
		console.log(queryParams);
		const resImage = await this.fileService.getImage(queryParams);
		if (resImage.error || !resImage.data) {
			this.logger.error(`Ошибка получения изображения: ${resImage.content}`);
			throw new HttpException(`${resImage.content}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return new StreamableFile(resImage.data);
	}

	@Post('save-all')
	async saveAll() {
		await this.fileService.saveAllImages();
	}
}
