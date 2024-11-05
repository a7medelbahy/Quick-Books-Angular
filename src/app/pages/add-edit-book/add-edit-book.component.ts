import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BooksService } from '../../Services/books.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Genre } from '../../enums/enums';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-edit-book',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, DatePipe],
  templateUrl: './add-edit-book.component.html',
  styleUrl: './add-edit-book.component.css'
})
export class AddEditBookComponent implements OnInit {
  bookForm!: FormGroup;
  id!: number;
  readonly genreEnum = Genre;
  private readonly bookService = inject(BooksService)
  private readonly fb = inject(FormBuilder);
  private readonly modalService = inject(NgbModal);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.initalizeBookForm();
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    if (this.id != null && this.id !== 0) {
      this.mapFormValuesForEdit();
    }
  }

  initalizeBookForm() {
    this.bookForm = this.fb.group({
      title: [null,[Validators.required, Validators.pattern('^[a-zA-Z_ ]{3,50}$')]],
      description: [null,[Validators.required, Validators.pattern('^[a-zA-Z_ ]{3,200}$')]],
      author: [null,[Validators.required, Validators.pattern('^[a-zA-Z_ ]{3,50}$')]],
      genre: [Number,[Validators.required]],
      publishedDate:[null, [Validators.required]]
    });
  }

  mapFormValuesForEdit() {
      this.bookService.getById(this.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
        this.bookForm.patchValue(res);        
      });
  };

  submitForm(e: Event){
    e.preventDefault();
    this.bookForm.controls['genre'].setValue(Number(this.bookForm.controls['genre'].value));
    if (this.bookForm.valid) {
      if (this.id != null && this.id != 0) {
        this.updateExistingBook();
      } else {
        this.createNewBook();
      }
    } else {
      this.bookForm.markAllAsTouched();
    }
  }

  createNewBook() {
    this.bookService.createBook(this.bookForm.value).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
      res => {
        alert("Book Created Successfully")
        this.resetFormAndNavigateToBookList();
      },
      error => alert(error.error)
    );
  }

  updateExistingBook() {
    this.bookService.updateBook(this.id,this.bookForm.value).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
      res => {
        alert("Book Updated Successfully");
        this.resetFormAndNavigateToBookList();
      },
      error => alert(error.error)
    );
  }

  confirmCancel(closeModal: any) {
    if (this.bookForm.dirty) {
      this.modalService.open(closeModal).result.then(res => {
        this.resetFormAndNavigateToBookList();
        this.cancel();
      });
    } else {
      this.resetFormAndNavigateToBookList();
    }
  }

  resetFormAndNavigateToBookList() {
    this.bookForm.reset();
    this.router.navigate(['/books']);
  }

  cancel() {
    this.modalService.dismissAll();
  }
}
