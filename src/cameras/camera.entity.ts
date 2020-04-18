import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Detection } from '../detections/detection.entity';
import { Master } from '../masters/master.entity';

@Entity()
export class Camera {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    name: string;

    @Column({ length: 255 })
    description: string;

    @Column()
    enabled: boolean;

    @Column()
    connected: boolean;

    @OneToMany(
        () => Detection,
        detection => detection.camera,
    )
    detections: Detection[];

    @ManyToMany(
        () => Master,
        master => master.cameras,
    )
    @JoinTable()
    masters: Master[];

    @Column({ nullable: true })
    lastDetection: Date;
}
