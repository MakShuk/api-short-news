import axios from 'axios';
import fs from 'fs';
import { join } from 'path';

export async function downloadFile(url: string, savePath: string) {
	const response = await axios({
		url,
		method: 'GET',
		responseType: 'stream',
	});

	const filePath = join(process.cwd(), `${savePath}.${extractFileExtension(url)}`);

	return new Promise((resolve, reject) => {
		response.data
			.pipe(fs.createWriteStream(filePath))
			.on('finish', () => resolve('OK'))
			.on('error', (e: any) => reject(e));
	});
}

function extractFileExtension(url: string): string | null {
	const urlParts = url.split('/');
	const fileNameWithExtension = urlParts.pop();
	const fileNameParts = fileNameWithExtension?.split('.');
	const fileExtension = fileNameParts?.pop();
	return fileExtension?.toLowerCase() || null;
}
