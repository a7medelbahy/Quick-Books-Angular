import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Book } from '../Models/Book.model';
import { BooksFilterParams } from '../Models/books-filter-params.model';

const baseUrl: string = "http://localhost:5096/api/books";

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  private readonly http: HttpClient = inject(HttpClient);

  getAll(params?: BooksFilterParams) {
    let queryParams = new HttpParams();
  if (params?.searchTitle) {
    queryParams = queryParams.set('searchTitle', params.searchTitle);
  }
  if (params?.genre !== undefined) {
    queryParams = queryParams.set('genre', params.genre.toString());
  }
  return this.http.get<Book[]>(`${baseUrl}`, { params: queryParams });
  }

  getById(id: number) {
    return this.http.get<Book>(`${baseUrl}/${id}`);
  }

  createBook(book: Book) {
    return this.http.post(`${baseUrl}`, book);
  }

  updateBook(id: number, book: Book) {
    return this.http.put(`${baseUrl}/${id}`, book);
  }

  deleteBook(id: number) {
    return this.http.delete(`${baseUrl}/${id}`);
  }

}
