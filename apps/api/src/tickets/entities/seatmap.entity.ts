import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Event } from "./event.entity"

@Entity()
export class SeatMap {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Event, (event) => event.seat_maps)
    event: Event

    @Column()
    section: string

    @Column()
    row: string

    @Column()
    seat_number: string

    @Column()
    quantity: number

    @Column()
    unit_price: number

    @Column()
    broadcast: boolean

    @Column()
    skybox_link: string
}
