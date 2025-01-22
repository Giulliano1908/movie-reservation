import {
    ArrayNotEmpty,
    IsArray,
    IsBoolean,
    IsIn,
    IsInt,
    IsISO8601,
    IsOptional,
    IsPositive,
    IsString,
    Max,
    Min,
    MinLength
} from "class-validator";

export class CreateMovieDto {

    @IsString()
    @MinLength(1)
    title: string;

    @IsString()
    @MinLength(1)
    description: string;

    //Podemos hacer busqueda por el genero o categorizar mediante estas etiquetas
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsIn([
        "Drama",
        "Comedia",
        "Terror",
        "Acción",
        "Romántica",
        "Ciencia ficción",
        "Animación",
        "Documental"
    ], { each: true })
    genre: string[];

    @IsOptional()
    @IsISO8601()
    releaseDate?: Date;

    @IsInt()
    @IsPositive()
    @Min(1, { message: "duration must not be less than 1" }) //saber que existe para enviar mensajee
    @Max(300)
    duration: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    postersUrls?: string[];
}
