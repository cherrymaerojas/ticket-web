import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

export enum EventType {
    CONCERT = 'CONCERT',
    THEATER = 'THEATER',
    SPORT = 'SPORT',
    OTHER = 'OTHER',
}

@Entity()
export class Performer {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({
        type: "enum",
        enum: EventType,
    })
    eventType: EventType
}
