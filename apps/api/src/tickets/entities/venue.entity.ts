import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Venue {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    address: string

    @Column()
    city: string

    @Column()
    state: string

    @Column()
    country: string

    @Column()
    postal_code: string

    @Column()
    phone: string

    @Column()
    timezone: string
}
