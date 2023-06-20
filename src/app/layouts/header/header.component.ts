import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  userEmail!: string;
  isLoggendIn$!: Observable<boolean>;
  constructor(
    private authService: AuthService,
  ) {}
  ngOnInit(): void {
    this.userEmail =  JSON.parse( localStorage.getItem('user') || '{}').email;
    this.isLoggendIn$ = this.authService.isloggedIn();
  }

  onLogout(){
    this.authService.logout();
  }
}
