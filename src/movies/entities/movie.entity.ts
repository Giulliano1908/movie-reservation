import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MovieImage } from "./";

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

    @OneToMany(
        () => MovieImage,
        movieImage => movieImage.movie,
        {
            cascade: true, //para eliminar en cascada
            eager: true,
        }
    )
    postersUrls?: MovieImage[];

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
