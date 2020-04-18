import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterCameraDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    description: string;
}
