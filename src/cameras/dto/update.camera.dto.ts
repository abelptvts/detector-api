import { IsBoolean, IsEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCameraDto {
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsBoolean()
    @IsOptional()
    enabled: boolean;
}
