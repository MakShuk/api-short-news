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
	async downloadNewFile() {
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

	@Get('custom-img')
	async getFieCustomParams(
		@Res({ passthrough: true }) res: Response,
		@Query() queryParams: { folder: string; id: string; ex: string },
	) {
		console.log(queryParams);
		const resImage = await this.fileService.getImage(queryParams);
		if (resImage.error || !resImage.data) {
			this.logger.error(`Ошибка получения изображения: ${resImage.content}`);
			throw new HttpException(`${resImage.content}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		const contentDisposition = `attachment; filename="${queryParams.id}.${queryParams.ex}"`;
		res.set({
			'Content-Type': 'image/jpeg',
			'Content-Disposition': contentDisposition,
		});
		return new StreamableFile(resImage.data);
	}

	@Get('img')
	async getImage(
		@Res({ passthrough: true }) res: Response,
		@Query() queryParams: { path: string },
	) {
		if (!('path' in queryParams)) {
			throw new HttpException(
				`Параметр path отсутствует в запросе`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
		const resImage = await this.fileService.getImage(queryParams);
		if (resImage.error || !resImage.data) {
			this.logger.error(`Ошибка получения изображения: ${resImage.content}`);
			throw new HttpException(`${resImage.content}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		const fileName = queryParams.path.split('/').pop();
		const contentDisposition = `attachment; filename="${fileName}"`;
		res.set({
			'Content-Type': 'image/jpeg',
			'Content-Disposition': contentDisposition,
		});
		return new StreamableFile(resImage.data);
	}

	@Post('save-all')
	async saveAll() {
		await this.fileService.saveAllImages();
	}

	@Post('download-one')
	async downloadOne() {
		await this.fileService.downloadFileToUrl();
	}
}
