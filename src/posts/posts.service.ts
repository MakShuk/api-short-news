import { Injectable } from '@nestjs/common';
import { Post, Prisma } from '@prisma/client';
import { ResponseData } from 'src/interfaces/respoce.interface';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class PostsService {
	constructor(private prisma: PrismaService) {}
	async createPost(
		postData: Prisma.PostCreateInput,
		tagIds: number[],
	): Promise<ResponseData<Post>> {
		try {
			if (!tagIds) throw new Error(`tagIds is missing`);
			const createdResource = await this.prisma.post.create({
				data: {
					...postData,
					tags: {
						connect: this.setTagId(tagIds),
					},
				},
			});
			return {
				content: `data recorded id: ${createdResource.id}, title: ${createdResource.title}`,
				error: false,
				data: createdResource,
			};
		} catch (error) {
			return { content: `recording error: ${error}`, error: true };
		}
	}

	private setTagId(tagIds: number[]) {
		return tagIds.map(tagId => ({
			id: tagId,
		}));
	}
}
