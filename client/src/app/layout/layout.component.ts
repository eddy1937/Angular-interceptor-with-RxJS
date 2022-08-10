import { Component, OnInit } from '@angular/core';
import { AuthService } from '../authentication/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.queryUserInfoByAuth().subscribe();
  }

}
