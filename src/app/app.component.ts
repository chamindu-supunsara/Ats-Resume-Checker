import { RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Ats-Cv-checker';

  toggleDarkMode() {
    const element = document.querySelector('html');
    if (element != null) {
      element.classList.toggle('my-app-dark');
    }
  }
}
