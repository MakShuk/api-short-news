import { Injectable } from '@nestjs/common';
import { Prisma, Tag } from '@prisma/client';
import { ResponseData } from 'src/interfaces/response.interface';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class TagsService {
	constructor(private prisma: PrismaService) {}
	async createdTag(data: Prisma.TagCreateInput): Promise<ResponseData<Tag>> {
		try {
			const createdTag = await this.prisma.tag.create({
				data,
			});
			return {
				content: `data recorded id:${createdTag.id}`,
				error: false,
				data: createdTag,
			};
		} catch (error) {
			return { content: `recording error: ${error}`, error: true };
		}
	}
}
