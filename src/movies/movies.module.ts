import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { Movie, MovieImage } from './entities';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService],
  imports: [
    TypeOrmModule.forFeature(
      [
        Movie,
        MovieImage
      ]
    )
  ]
})
export class MoviesModule { }
