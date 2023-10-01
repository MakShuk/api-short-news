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
	Length,
	Max,
	Min,
} from 'class-validator';

export class CreatePostDto {
	@IsNotEmpty()
	@IsString()
	@Length(5, 175)
	readonly title: string;

	@IsNotEmpty()
	@IsString()
	@Length(5, 3000)
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

	@IsString()
	@Length(6, 675)
	@IsLowercase()
	readonly imageUrl: string;

	@IsString()
	@IsOptional()
	@Length(6, 675)
	@IsLowercase()
	readonly imagePath: string;

	@IsInt()
	@Min(1)
	readonly resource: Prisma.ResourceCreateNestedOneWithoutPostsInput;
}
