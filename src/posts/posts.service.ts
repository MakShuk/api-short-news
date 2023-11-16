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
			console.log({ tagIds });
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

	async checkingUniqueValues(data: Pick<Post, 'originalTitle' | 'imageUrl' | 'originalUrl'>[]) {
		try {
			const existingUrls = await this.prisma.post.findMany({
				select: {
					originalUrl: true,
				},
			});
			const existingUrlsArray = existingUrls.map(obj => obj.originalUrl);
			const newUrls = data.filter(item => !existingUrlsArray.includes(item.originalUrl));

			return { content: `Возвращены значения отсутсвующие в базе`, error: false, data: newUrls };
		} catch (error) {
			return { content: `Ошибка получения значений отсутсвующих в базе: ${error}`, error: true };
		}
	}

	async findLatstPosts(limit = 50): Promise<ResponseData<Post[]>> {
		try {
			const lastPosts = await this.prisma.post.findMany({
				take: limit,
				orderBy: {
					updatedAt: 'desc',
				},
				include: {
					resource: true,
				},
			});

			const postsWithResourceName = lastPosts.map(({ resource, ...post }) => ({
				...post,
				resourceName: resource?.name,
			}));

			return {
				content: `get last ${limit} posts`,
				error: false,
				data: postsWithResourceName,
			};
		} catch (error) {
			return { content: `get last post error: ${error}`, error: true };
		}
	}

	private setTagId(tagIds: number[]) {
		return tagIds.map(tagId => ({
			id: tagId,
		}));
	}
}
