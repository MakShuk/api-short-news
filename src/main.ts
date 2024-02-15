import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const port = 3001;
	const app = await NestFactory.create(AppModule);
	app.enableCors({
		origin: ['http://localhost:3000', 'http://192.168.0.8:3000'],
		methods: ['GET', 'POST'],
		credentials: true,
	});
	await app.listen(port);
	console.log(`DB-API: ${port}`);
}
bootstrap();
