import { Component, computed, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ButtonModule, DividerModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isDarkMode = signal<boolean>(false);
  private mediaQueryList = signal(window.matchMedia('(prefers-color-scheme: dark)'));

  constructor() {
    this.initializeTheme();
    this.mediaQueryList().addEventListener('change', this.handleSystemThemeChange.bind(this));
  }

  initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
      this.isDarkMode.set(savedTheme === 'dark');
    } else {
      this.isDarkMode.set(systemPrefersDark);
    }

    this.updateTheme();
  }

  toggleDarkMode() {
    this.isDarkMode.set(!this.isDarkMode());
    localStorage.setItem('theme', this.isDarkMode() ? 'dark' : 'light');
    this.updateTheme();
  }

  updateTheme() {
    const element = document.querySelector('html');
    if (element) {
      if (this.isDarkMode()) {
        element.classList.add('my-app-dark');
      } else {
        element.classList.remove('my-app-dark');
      }
    }
  }

  handleSystemThemeChange(event: MediaQueryListEvent) {
    const userSetTheme = localStorage.getItem('userSetTheme');
  
    if (userSetTheme) {
      localStorage.removeItem('userSetTheme');
    }
  
    this.isDarkMode.set(event.matches);
    localStorage.setItem('theme', event.matches ? 'dark' : 'light');
    this.updateTheme();
  }  

  buttonIcon = computed(() => (this.isDarkMode() ? 'pi pi-sun' : 'pi pi-moon'));
}
