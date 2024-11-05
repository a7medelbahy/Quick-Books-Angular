import { Book } from './../../Models/Book.model';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { Genre } from '../../enums/enums';
import { BooksService } from '../../Services/books.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenrePipe } from '../../pipes/genre.pipe';
import { BooksFilterParams } from '../../Models/books-filter-params.model';
import { ActivatedRoute, Router } from '@angular/router';
import { BooksListEmptyStateComponent } from './components/books-list-empty-state/books-list-empty-state.component';

@Component({
  selector: 'app-books-list',
  standalone: true,
  imports: [MatTableModule, DatePipe, MatTooltipModule, GenrePipe, BooksListEmptyStateComponent],
  templateUrl: './books-list.component.html',
  styleUrl: './books-list.component.css'
})
export class BooksListComponent implements OnInit {
  isClearBtnDisabled: boolean = true;
  readonly genreEnum = Genre;
  private readonly bookService = inject(BooksService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly modalServive = inject(NgbModal);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly filterParams = signal<BooksFilterParams>({});
  displayedColumns: string[] = ['id','title', 'description', 'author', 'genre', 'publishedDate','actions'];
  dataSource = new MatTableDataSource<Book>();
  
  ngOnInit(): void {
    this.subscribeToUrlQueryParams();
  }


  public static makeUrlParamsOf(params: { [key: string]: string | number | boolean | any }): { [key: string]: string } {
    const keys = Object.keys(params);
    let newParams: { [key: string]: string } = {};
    for (let key of keys) {
      if (params[key] || params[key] === false || params[key] === undefined || (typeof params[key] === 'number' && params[key] === 0)) {
        if (typeof params[key] === 'object') {
          if (params[key] instanceof Array && params[key].length === 0) {
            continue;
          }
          newParams[key] = JSON.stringify(params[key]);
        } else {
          newParams[key] = params[key].toString();
        }
      }
    }
    return newParams;
  }


  public changeUrlParams(params: any, replaceUrl = false) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: BooksListComponent.makeUrlParamsOf(params),
      replaceUrl
    });
  }

  private subscribeToUrlQueryParams() {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
      params => {
          this.filterParams.set(params as BooksFilterParams);
          this.getBookList(this.filterParams());
      }
    )
  }


  getBookList(filterParams: BooksFilterParams) {
    this.bookService.getAll(filterParams).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
      this.dataSource.data = res;
    });
  }

  filterByText(value: string) {
    this.filterParams.update(params => ({ ...params, searchTitle: value}));
    this.changeUrlParams(this.filterParams());
    this.isClearBtnDisabled = false;
  }
  
  filterByGenre(value: string) {
    this.filterParams.update(params => ({ ...params, genre: +value}));
    this.changeUrlParams(this.filterParams());
    this.isClearBtnDisabled = false;
}

clearFilter() {
  this.filterParams.update(params => ({ ...params,searchTitle:'',}));
  this.filterParams.set({});
  this.changeUrlParams(this.filterParams());
  this.isClearBtnDisabled = true;

}

  delete(book: Book, deleteModal: any) {
    this.modalServive.open(deleteModal).result.then(
      res => {
        this.bookService.deleteBook(book.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
        this.cancel();
        this.getBookList(this.filterParams());
      }
    )
  }

  cancel() {
    this.modalServive.dismissAll();
  }

  edit(book: Book) {
    this.router.navigate([`/books/add-edit/${book.id}`])
  }

  details(book: Book) {
    this.router.navigate([`/books/details/${book.id}`])
  }
  createNew(){
    this.router.navigate([`/books/add-edit`])
  }
}
