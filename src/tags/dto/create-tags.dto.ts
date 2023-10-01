import { IsLowercase, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateTagDto {
	@IsString()
	@IsNotEmpty()
	@Length(3, 15)
	@IsLowercase()
	readonly name: string;
}
