import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { Event } from "./event.entity"
import { Performer } from "./performer.entity"
import { Provider } from "./provider.entity"
import { Venue } from "./venue.entity"

@Entity()
export class Performance {
    @PrimaryGeneratedColumn()
    id: number

    @OneToMany(() => Event, (event) => event.performance)
    events: Event[]

    @Column()
    name: string

    @OneToOne(() => Provider)
    @JoinColumn()
    provider: Provider

    @OneToOne(() => Performer)
    @JoinColumn()
    performer: Performer

    @OneToOne(() => Venue)
    @JoinColumn()
    venue: Venue
}
