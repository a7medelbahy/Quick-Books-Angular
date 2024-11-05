import { Pipe, PipeTransform } from '@angular/core';
import { Genre } from '../enums/enums';

@Pipe({
  name: 'genre',
  standalone: true
})
export class GenrePipe implements PipeTransform {
  transform(genre: number): string {
    let genreText = "-";
    switch (genre) {
      case Genre.Fiction:
        genreText = 'Fiction';
        break;
      case Genre.Historical:
		genreText = 'Historical';
        break;
      case Genre.Mystery:
		genreText = 'Mystery';
        break;
      case Genre.Narrative:
		genreText = 'Narrative';
        break;
      case Genre.Novel:
		genreText = 'Novel';
        break;
      case Genre.Romance:
		genreText = 'Romance';
        break;
      case Genre.Science:
		genreText = 'Science';
        break;
      default:
        genreText = '-';
        break;
    }
    return genreText;
  }
}
