import { diskStorage } from 'multer';
import { Response } from 'express';
import {
  Controller, Get, Post, Param,
  UploadedFile, UseInterceptors, BadRequestException,
  Res
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

import { FilesService } from './files.service';
import { fileNamer, fileFilter } from './helpers';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configModule: ConfigService,

  ) { }

  @Get("movie/:imageName")
  findMovieImage(
    @Res() res: Response,
    @Param("imageName") imageName: string
  ) {

    const path = this.filesService.getStaticMovieImage(imageName);
    res.sendFile(path);
  }

  @Post("movie")
  @UseInterceptors(FileInterceptor("file", {
    fileFilter: fileFilter,
    storage: diskStorage({
      destination: "./static/movies",
      filename: fileNamer,
    })
  }))
  uploadMovieImage(
    @UploadedFile() file: Express.Multer.File,
  ) {

    if (!file) {
      throw new BadRequestException("Make sure that the file is an image");
    }

    const secureUrl = `${this.configModule.get("HOST_API")}/files/movie/${file.filename}`

    return {
      secureUrl
    };
  }
}
