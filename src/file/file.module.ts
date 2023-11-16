import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { PrismaModule } from 'src/services/prisma/prisma.module';
import { LoggerService } from '../services/logger/logger.service';

@Module({
	imports: [PrismaModule],
	controllers: [FileController],
	providers: [
		FileService,
		{
			provide: LoggerService,
			useValue: new LoggerService('file'),
		},
	],
})
export class FileModule {}
