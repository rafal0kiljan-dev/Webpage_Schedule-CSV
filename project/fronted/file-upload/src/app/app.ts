import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface GanttItem {
  id: string;
  priority: number;
  start: Date;
  end: Date;
}



@Component({
  selector: 'app-root',
  standalone: true,
  
  imports: [CommonModule],
  template: `
    <div class="p-4">
      <h1>Send us your CSV file and we'll help you plan it out</h1>

      <input type="file" (change)="onFileSelected($event)" accept=".csv" />
      <button (click)="uploadFile()" [disabled]="!selectedFile">Send</button>

      <p *ngIf="message" style="margin-top: 10px;">{{ message }}</p>
	  
	  <!-- GANTT -->
	  
	  <div *ngIf="data.length" class="gantt">
  <h2>Chart Gantt</h2>

  <div class="row" *ngFor="let item of data">
    <span class="label">
      {{ item.id }} (P{{ item.priority }})
    </span>

    <div class="bar"
       [style.marginLeft.px]="getOffset(item)"
       [style.width.px]="getDuration(item)*0.5"
		 >
				{{ + item.start | date:'HH:mm' }} –
      {{ item.end | date:'HH:mm' }}
    </div>
  </div>
</div>
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

data: GanttItem[] = [];
timelineStart!: number;

parseCsv(csv: string): GanttItem[] {
  const lines = csv.trim().split('\n');
  const result: GanttItem[] = [];

  for (const line of lines) {
    const [id, priority, start, end] = line.split(',');

    result.push({
      id,
      priority: Number(priority),
      start: new Date(start),
      end: new Date(end)
    });
  }

  return result;
}

downloadBlob(blob: Blob) {
  const a = document.createElement('a');
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = 'results.csv';
  a.click();
  window.URL.revokeObjectURL(url);
}

/*
getDuration(item: GanttItem): number {
  const ms = item.end.getTime() - item.start.getTime();
  return Math.max(5, ms / 60000); // minuty → px
}
*/
getDuration(item: GanttItem): number {
  const minutes =
    (item.end.getTime() - item.start.getTime()) / 60000;
  return Math.max(10, minutes * 1);
}


getOffset(item: GanttItem): number {
  const minutes =
    (item.start.getTime() - this.timelineStart) / 60000;
  return minutes * 1; // 1 minuta = 2px (skalowanie)
}
/*
getBegining(item: GanttItem): number {
  const s = item.start.getTime()
  console.log(Math.max(10, s / 60000))
  return Math.max(5, s / 600); // minuty → px
}
*/

uploadFile() {
  if (!this.selectedFile) return;

  const formData = new FormData();
  formData.append('file', this.selectedFile);

  this.http.post(
    'http://localhost:8080/api/upload',
    formData,
    { responseType: 'blob' }
  ).subscribe({
    next: async (blob) => {

     
      const text = await blob.text();

      
      this.data = this.parseCsv(text);
	  
	  this.timelineStart = Math.min(
  ...this.data.map(d => d.start.getTime())
);

     
      this.downloadBlob(blob);

      this.message = '';
    },
    error: err => {
      console.error(err);
      this.message = 'Error.';
    }
  });
}
}

