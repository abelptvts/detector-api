import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterMasterDto {
    @IsString()
    @IsNotEmpty()
    installationId: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    expoPushToken;
}
