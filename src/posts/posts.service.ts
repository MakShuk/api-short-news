import { Injectable } from '@nestjs/common';
import { Post, Prisma } from '@prisma/client';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class PostsService {
	constructor(private prisma: PrismaService) {}

	async createPost(data: Prisma.PostCreateInput): Promise<Post> {
		return this.prisma.post.create({
			data,
		});
	}
}
