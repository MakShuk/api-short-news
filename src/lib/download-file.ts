import axios from 'axios';
import fs from 'fs';

export async function downloadFile(
	idToName: string,
	url: string,
	catalog: string,
): Promise<string> {
	const response = await axios({
		url,
		method: 'GET',
		responseType: 'stream',
	});
	const splitResource = catalog.split('.')[0] || catalog;
	const nextJsSave = `C:/development/NextJS/next-short-news/public`;
	const filePath = `resources/${splitResource}/${idToName}.${extractFileExtension(url)}`;
	const fullFilePath = `${nextJsSave}/${filePath}`;

	return new Promise((resolve, reject) => {
		response.data
			.pipe(fs.createWriteStream(fullFilePath))
			.on('finish', () => {
				resolve(filePath);
			})
			.on('error', (error: any) => {
				reject(error);
			});
	});
}

function extractFileExtension(url: string): string | null {
	const urlParts = url.split('/');
	const fileNameWithExtension = urlParts.pop();
	const fileNameParts = fileNameWithExtension?.split('.');
	const fileExtension = fileNameParts?.pop();
	return fileExtension?.toLowerCase() || null;
}
