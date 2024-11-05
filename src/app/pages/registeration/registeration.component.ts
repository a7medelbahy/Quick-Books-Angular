import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../Services/user.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-registeration',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './registeration.component.html',
  styleUrl: './registeration.component.css'
})
export class RegisterationComponent implements OnInit {
  registForm!: FormGroup;
  private readonly userService = inject(UserService)
  private readonly fb = inject(FormBuilder);
  private readonly modalService = inject(NgbModal);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  
  ngOnInit(): void {
    this.initalizeRegistForm()
  }

  initalizeRegistForm() {
    this.registForm = this.fb.group({
      firstName: [null,[Validators.required, Validators.pattern('^[a-zA-Z_ ]{3,50}$')]],
      lastName: [null,[Validators.required, Validators.pattern('^[a-zA-Z_ ]{3,50}$')]],
      username: [null,[Validators.required, Validators.pattern('^[a-zA-Z_ ]{3,50}$')]],
      email: [null,[Validators.required, Validators.email]],
      password:[null, [Validators.required,Validators.minLength(8)]]
    });
  }

  submit(e: Event) {
    e.preventDefault();
    if (this.registForm.valid) {
        this.userService.createUser(this.registForm.value).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
          res => {
            alert("Your account Created Successfully")
            this.resetFormAndNavigateToLogin();
          },
          error => alert(error.error)
        );
    } else {
      this.registForm.markAllAsTouched();
    }
  }

  confirmCancel(closeModal: any) {
    if (this.registForm.dirty) {
      this.modalService.open(closeModal).result.then(res => {
        this.resetFormAndNavigateToLogin();
        this.cancel();
      });
    } else {
      this.resetFormAndNavigateToLogin();
    }
  }

  resetFormAndNavigateToLogin() {
    this.registForm.reset();
    this.router.navigate(['/login']);
  }

  cancel() {
    this.modalService.dismissAll();
  }
}
