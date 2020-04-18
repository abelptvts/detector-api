import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Camera } from '../cameras/camera.entity';

@Entity()
export class Detection {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    capture: string;

    @Column()
    date: Date;

    @ManyToOne(
        () => Camera,
        camera => camera.detections,
        { nullable: false },
    )
    camera: Camera;
}
