import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { UserService } from '../../Services/user.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  loginFlag:boolean=false;
  private readonly userService = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router)
  
  get username(): string | null {
    return localStorage.getItem('userName');
  }
  ngOnInit(): void {
  }

  logout(){
    this.userService.logout();
    this.router.navigate(['/login']);
  }
  
}
