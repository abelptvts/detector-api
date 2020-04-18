import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { Camera } from '../cameras/camera.entity';

@Entity()
export class Master {
    @PrimaryColumn()
    installationId: string;

    @Column({ length: 50 })
    name: string;

    @Column()
    expoPushToken: string;

    @ManyToMany(
        () => Camera,
        camera => camera.masters,
    )
    cameras: Camera[];
}
