import { Component } from '@angular/core';
import { CvUploadComponent } from "../cv-upload/cv-upload.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CvUploadComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  
}
