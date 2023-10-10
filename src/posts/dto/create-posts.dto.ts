import { Prisma } from '@prisma/client';
import {
	ArrayMaxSize,
	ArrayMinSize,
	IsArray,
	IsBoolean,
	IsInt,
	IsLowercase,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUrl,
	Length,
	Max,
	Min,
} from 'class-validator';

export class CreatePostDto {
	@IsNotEmpty()
	@IsString()
	@Length(5, 275)
	readonly title: string;

	@IsString()
	@Length(5, 275)
	readonly originalTitle: string;

	@IsNotEmpty()
	@IsString()
	@Length(5, 16000)
	readonly content: string;

	@IsInt()
	@Min(1)
	@Max(10)
	@IsOptional()
	readonly ratio?: number;

	@IsBoolean()
	@IsOptional()
	readonly published?: boolean;

	@IsArray()
	@ArrayMinSize(1)
	@ArrayMaxSize(5)
	@IsInt({ each: true })
	readonly tags: number[];

	@IsUrl()
	@Length(6, 675)
	@IsLowercase()
	readonly imageUrl: string;

	@IsString()
	@IsOptional()
	@Length(6, 675)
	@IsLowercase()
	readonly imagePath: string;

	@IsUrl()
	@Length(6, 675)
	@IsLowercase()
	readonly originalUrl: string;

	@IsUrl()
	@Length(6, 675)
	@IsLowercase()
	readonly summaryUrl: string;

	@IsInt()
	@Min(1)
	readonly resourceId: Prisma.ResourceCreateNestedOneWithoutPostsInput;
}
