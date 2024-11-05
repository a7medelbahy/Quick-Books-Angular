import { Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../Services/user.service';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;
  private readonly userService = inject(UserService)
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  
  ngOnInit(): void {
    this.initalizeLoginForm()
  }

  initalizeLoginForm() {
    this.loginForm = this.fb.group({
      email: [null,[Validators.required, Validators.email]],
      password:[null, [Validators.required]]
    });
  }

  login(e: Event) {
    e.preventDefault();
    if (this.loginForm.valid) {
        this.userService.login(this.loginForm.value).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
          res => {
            alert("You are logged Successfully")
            this.resetFormAndNavigateToBooks();
          },
          error => alert(error.error)
        );
    } else {
      this.loginForm.markAllAsTouched();
    }
  }


  resetFormAndNavigateToBooks() {
    this.loginForm.reset();
    this.router.navigate(['/books']);
  }
}
