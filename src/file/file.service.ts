import { Injectable } from '@nestjs/common';
import { downloadFile } from 'src/lib/download-file';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class FileService {
	constructor(private prisma: PrismaService) {}
	async downloadResourceFile(url: string, resource: string, id: string) {
		const splitResource = resource.split('.')[0] || resource;
		const savePath = `resources/${splitResource}/${id}`;
		downloadFile(url, savePath);
	}

	async getUpdatePost() {
		const posts = await this.prisma.post.findMany({
			take: 3,
			orderBy: {
				updatedAt: 'desc',
			},
			include: {
				resource: true,
			},
		});

		const postsWithResourceName = posts.map(({ resource, ...post }) => ({
			...post,
			resourceName: resource?.name,
		}));
		return postsWithResourceName;
	}

	async getImage(queryParams: { folder: string; id: string; ex: string }) {
		const path = `/resources/${queryParams.folder}/${queryParams.id}.${queryParams.ex}`;
		try {
			const filePath = join(process.cwd(), path);

			const stats = await new Promise((resolve, reject) => {
				fs.stat(filePath, (err, stats) => {
					if (err) {
						reject(err);
					} else {
						resolve(stats);
					}
				});
			});

			if (!stats) {
				throw new Error(`Image not found`);
			}

			const file = fs.createReadStream(join(process.cwd(), path));

			return { content: `Image received`, error: false, data: file };
		} catch (err) {
			return { content: `Image ${path} acquisition error ${err}`, error: true };
		}
	}
}
