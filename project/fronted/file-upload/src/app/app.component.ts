import { Component, OnInit } from '@angular/core';
import { HelloService } from './hello.service';

@Component({
  selector: 'app-root',
  template: `
    <h1>{{ message }}</h1>
    <button (click)="loadMessage()">Pobierz z backendu</button>
  `
})
export class AppComponent implements OnInit {
  message = '';

  constructor(private helloService: HelloService) {}

  ngOnInit(): void {
    this.loadMessage();
  }

  loadMessage(): void {
    this.helloService.getMessage().subscribe({
      next: msg => this.message = msg,
      error: err => console.error('Błąd połączenia z backendem', err)
    });
  }
}