import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4">
      <h1>Wyślij plik CSV, a my pomożemy ci go rozplanować</h1>

      <input type="file" (change)="onFileSelected($event)" accept=".csv" />
      <button (click)="uploadFile()" [disabled]="!selectedFile">Wyślij</button>

      <p *ngIf="message" style="margin-top: 10px;">{{ message }}</p>
    </div>
  `
})
export class App {
  selectedFile?: File;
  message = '';

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.message = '';
  }

  uploadFile() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

	  this.http.post('http://localhost:8080/api/upload', formData, {
      responseType: 'blob' }).subscribe({
      next: (blob) => {
        const a = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'modified_' + this.selectedFile!.name;
        a.click();
        window.URL.revokeObjectURL(url);
        this.message = 'Plik został przetworzony i pobrany.';
      },
      error: err => {
        console.error('Błąd:', err);
        this.message = 'Wystąpił błąd podczas wysyłania pliku.';
      }
    });
  }
}
