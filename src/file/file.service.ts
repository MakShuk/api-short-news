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
		downloadFile(splitResource, url, savePath);
	}

	async saveAllImages() {
		const newPosts = await this.getUpdatePost();
		for (const post of newPosts) {
			const idToName = post.id.toString();
			const catalog = post.resourceName || 'error';
			const newImagePath = await downloadFile(idToName, post.imageUrl, catalog);
			console.log(newImagePath);
			await this.prisma.post.update({
				where: {
					id: post.id,
				},
				data: {
					imagePath: newImagePath,
				},
			});
		}
	}

	async getUpdatePost() {
		const postsWithNullImagePath = await this.prisma.post.findMany({
			where: {
				imagePath: null,
			},
			include: {
				resource: true,
			},
		});

		const postsWithResourceName = postsWithNullImagePath.map(({ resource, ...post }) => ({
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
