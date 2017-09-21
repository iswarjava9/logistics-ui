import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
// import { AuthService } from './../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor() {} 
  /* constructor(public auth: AuthService, private router: Router) { 
  if(!auth.isAuthenticated()){
    this.router.navigate(['/']);
  }
  } */

  ngOnInit() {
  }

}
