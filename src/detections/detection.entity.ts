import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
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
        { nullable: false, onDelete: 'CASCADE' },
    )
    camera: Camera;

    @Column({ nullable: false })
    cameraId: number;
}
