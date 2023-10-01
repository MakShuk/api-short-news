import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { PostsModule } from './posts/posts.module';
import { TagsModule } from './tags/tags.module';
import { ResourceModule } from './resource/resource.module';

@Module({
	imports: [ConfigModule.forRoot(), PostsModule, TagsModule, ResourceModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
