import { join } from 'path';
import { existsSync } from 'fs';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {

  getStaticMovieImage(imageName: string) {

    const path = join(__dirname, "../../static/movies", imageName);

    if(!existsSync(path))
      throw new BadRequestException(`No movie found with image ${imageName}`);

    return path;
  }

}
