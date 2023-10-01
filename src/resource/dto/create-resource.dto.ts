import { IsLowercase, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateResourceDto {
	readonly id: number;

	@IsString()
	@IsNotEmpty()
	@Length(3, 15)
	@IsLowercase()
	readonly name: string;

	@IsString()
	@IsLowercase()
	@IsNotEmpty()
	@Length(3, 75)
	readonly baseURL: string;
}
