import { Component } from '@angular/core';
import { CvUploadComponent } from "../cv-upload/cv-upload.component";
import { Meta, Title } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CvUploadComponent, ButtonModule, DividerModule, CardModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  constructor(private titleService: Title, private metaService: Meta) {
    this.setSEO();
  }

  private setSEO() {
    this.titleService.setTitle('Free Ats Resume Checker AI Resume Cv Score Tool');
    
    this.metaService.updateTag({ name: 'description', content: 'Free Score your resume with AI-powered ATS resume scoring. Optimize your CV for job applications and pass ATS filters with ease. Free Ats Resume Checker' });
    this.metaService.updateTag({ name: 'keywords', content: 'ats resume checker, ats resume scan, resume optimization, ats resume test, ats resume, CV checker, CV optimization, CV scan, CV test, CV score, CV analysis, CV keywords scan, CV keywords test, CV keywords score' });
    this.metaService.updateTag({ property: 'og:title', content: 'Free Ats Resume Checker AI Resume Cv Score Tool' });
    this.metaService.updateTag({ property: 'og:description', content: 'Improve your resume with AI-powered ATS scoring. Get higher rankings for job applications! Free Ats Resume Checker' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://atschecker.site/Cover.jpg' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://atschecker.site' });
  }
}
