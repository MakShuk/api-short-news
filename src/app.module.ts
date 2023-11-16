import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { PostsModule } from './posts/posts.module';
import { TagsModule } from './tags/tags.module';
import { ResourceModule } from './resource/resource.module';
import { FileModule } from './file/file.module';
import { LoggerService } from './services/logger/logger.service';

@Module({
	imports: [ConfigModule.forRoot(), PostsModule, TagsModule, ResourceModule, FileModule],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: LoggerService,
			useValue: new LoggerService('main'),
		},
	],
})
export class AppModule {}
