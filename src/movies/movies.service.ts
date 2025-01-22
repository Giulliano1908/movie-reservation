import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { MovieImage, Movie } from './entities';
import { validate as isUUID } from 'uuid';

@Injectable()
export class MoviesService {

  private readonly logger = new Logger("MoviesService"); //see message better in logs

  constructor(

    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,

    @InjectRepository(MovieImage)
    private readonly movieImageRepository: Repository<MovieImage>,

    private readonly dataSource: DataSource,

  ) { }

  async create(createMovieDto: CreateMovieDto) {

    try {
      const { postersUrls = [], ...movieDetails } = createMovieDto;

      const movie = this.movieRepository.create({
        ...movieDetails,
        postersUrls: postersUrls.map(poster => this.movieImageRepository.create({ url: poster }))
      });
      await this.movieRepository.save(movie);
      return { ...movie, postersUrls: postersUrls };

    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(pagination: PaginationDto) {

    const { limit = 10, offset = 0 } = pagination;
    const movies = await this.movieRepository.find({
      take: limit,
      skip: offset,
      relations: {
        postersUrls: true
      }
    });

    return movies.map(({ postersUrls, ...rest }) => ({
      ...rest,
      postersUrls: postersUrls.map(post => post.url)
    }))
  }

  async findOne(term: string) {

    let movie: Movie;

    if (isUUID(term)) {
      movie = await this.movieRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.movieRepository.createQueryBuilder("movie");
      movie = await queryBuilder
        .where('title ILIKE :title', {
          title: `%${term}%`
        })
        .leftJoinAndSelect("movie.postersUrls", "moviePostsUrls")
        .getOne();
    };

    if (!movie) throw new NotFoundException(`Movie with ${term} not found`);
    return movie;
  }

  async findOnePlain(term: string) {
    const { postersUrls, ...rest } = await this.findOne(term);
    return {
      ...rest,
      postersUrls: postersUrls.map(poster => poster.url)
    }
  }

  async update(id: string, updateMovieDto: UpdateMovieDto) {

    const { postersUrls, ...update } = updateMovieDto;

    const movie = await this.movieRepository.preload({ id, ...update, });

    if (!movie) throw new NotFoundException(`Movie with id: ${id} not found`);

    //TODO: another way to do
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      if (postersUrls) {
        await queryRunner.manager.delete(MovieImage, { movie: { id } });

        movie.postersUrls = postersUrls.map(
          poster => this.movieImageRepository.create({ url: poster }));
      }

      await queryRunner.manager.save(movie) //Another way to save 
      // await this.movieRepository.save(movie);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      // return movie;
      return this.findOnePlain(id);
    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBExceptions(error);
    };
  }

  async remove(id: string) {

    const movie = await this.findOne(id);
    await this.movieRepository.remove(movie);
  }

  private handleDBExceptions(error: any) {

    if (error.code === "23505")
      throw new BadRequestException(error.detail);

    this.logger.error(error);
    // console.log(error);
    throw new InternalServerErrorException("Unexpected error, check server logs");
  }

  //TODO: PARA ELIMINAR TODAS LAS PELICULAS
  async deleteAllMovies() {
    const query = this.movieRepository.createQueryBuilder('movie');

    try {
      return await query
        .delete()
        .where({})
        .execute();
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }
}
