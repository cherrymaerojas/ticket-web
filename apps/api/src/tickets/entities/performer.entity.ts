import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

export enum EventType {
    CONCERT = 'concert',
    THEATER = 'theater',
    SPORT = 'sport',
    OTHER = 'other',
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
