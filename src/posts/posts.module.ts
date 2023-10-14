import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaModule } from 'src/services/prisma/prisma.module';
import { LoggerService } from 'src/services/logger/logger.service';

@Module({
	imports: [PrismaModule],
	controllers: [PostsController],
	providers: [
		PostsService,
		{
			provide: LoggerService,
			useValue: new LoggerService('db'),
		},
	],
})
export class PostsModule {}
