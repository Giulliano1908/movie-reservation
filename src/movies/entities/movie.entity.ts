import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('movies')
export class Movie {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column(
        'text', {
        unique: true
    })
    title: string;

    @Column('text')
    description: string;

    // posterUrl : continue...

    @Column('text', {
        array: true, //Can validate with Enum
        default: ["Uncategorized"]
    })
    genre: string[];

    @Column('date', {
        default: () => "CURRENT_DATE"
    })
    releaseDate: Date;

    @Column('int')
    duration: number; //duration in minutes

    @Column('bool', {
        default: true
    })
    isActive: boolean;

    //relationships....

    // @BeforeInsert()
    // normalizeTitle() {
    //     this.title = this.title.toUpperCase();
    // }
}
