import { AsyncPipe } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import type { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { NxWelcomeComponent } from './nx-welcome.component';
import { ScssInlineTestComponent } from './scss-inline-test';

@Component({
  imports: [
    NxWelcomeComponent,
    RouterModule,
    ScssInlineTestComponent,
    AsyncPipe,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'rsbuild-csr-css';
  greeting$!: Observable<string>;

  constructor(private readonly apiService: ApiService) {}

  ngOnInit() {
    this.greeting$ = this.apiService.getGreeting('world');
  }
}
