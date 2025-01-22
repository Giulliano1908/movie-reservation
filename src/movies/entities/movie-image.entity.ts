import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Movie } from ".";

@Entity()
export class MovieImage {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    url: string;

    @Column("bool", {
        default: true
    })
    isActive: boolean;

    @ManyToOne(
        () => Movie,
        movie => movie.postersUrls,
        { onDelete: "CASCADE" } //escucha un delete y elimina en cascada
    )
    movie: Movie
}