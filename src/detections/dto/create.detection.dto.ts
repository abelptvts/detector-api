import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateDetectionDto {
    @IsDateString()
    @IsNotEmpty()
    date: string;
}
