import { RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';
import { HeaderComponent } from "./ui/header/header.component";
import { FooterComponent } from './ui/footer/footer.component';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, NgxSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private spinner: NgxSpinnerService) {}

  ngOnInit() {
    document.body.style.overflow = 'hidden';
    this.spinner.show('mainSpinner');

    setTimeout(() => {
      this.spinner.hide('mainSpinner');
      document.body.style.overflow = 'auto';
    }, 5000);
  }
}
