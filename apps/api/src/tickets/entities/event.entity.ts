import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Performance } from "./performance.entity"
import { SeatMap } from "./seatmap.entity"

@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    id: number

    @OneToMany(() => SeatMap, (seatMap) => seatMap.event)
    seat_maps: SeatMap[]

    @Column({ type: 'timestamptz' }) // Recommended
    date: Date

    @ManyToOne(() => Performance, (performance) => performance.events)
    performance: Performance
}
