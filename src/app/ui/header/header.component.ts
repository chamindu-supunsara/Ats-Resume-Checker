import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isDarkMode = signal<boolean>(false);

  toggleDarkMode() {
    const element = document.querySelector('html');
    if (element != null) {
      element.classList.toggle('my-app-dark');
      this.isDarkMode.set(!this.isDarkMode());
    }
  }

  get buttonIcon() {
    return this.isDarkMode() ? 'pi pi-sun' : 'pi pi-moon';
  }
}
