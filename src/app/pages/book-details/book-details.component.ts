import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Book } from '../../Models/Book.model';
import { GenrePipe } from '../../pipes/genre.pipe';
import { DatePipe } from '@angular/common';
import { BooksService } from '../../Services/books.service';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [GenrePipe, DatePipe],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css'
})
export class BookDetailsComponent implements OnInit {
  book!: Book;
  id!: number;
  private readonly bookService = inject(BooksService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.bookService.getById(this.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => this.book = res);
  }
}
