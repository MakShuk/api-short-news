import { Injectable } from '@nestjs/common';
import { Prisma, Resource } from '@prisma/client';
import { ResponseData } from 'src/interfaces/respoce.interface';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class ResourceService {
	constructor(private prisma: PrismaService) {}

	async createdResource(data: Prisma.ResourceCreateInput): Promise<ResponseData<Resource>> {
		try {
			const createdResource = await this.prisma.resource.create({
				data,
			});
			return {
				content: `data recorded id:${createdResource.id}`,
				error: false,
				data: createdResource,
			};
		} catch (error) {
			return { content: `recording error: ${error}`, error: true };
		}
	}
}
