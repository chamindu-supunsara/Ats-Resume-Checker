import { RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';
import { HeaderComponent } from "./ui/header/header.component";
import { FooterComponent } from './ui/footer/footer.component';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { provideNgIdle, Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, NgxSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [provideNgIdle()]
})
export class AppComponent {
  constructor(private spinner: NgxSpinnerService, private idle: Idle) {
    // Set idle timeout for 3 minutes (180 seconds)
    this.idle.setIdle(600);
    this.idle.setTimeout(1);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleEnd.subscribe(() => {
    });

    this.idle.onTimeout.subscribe(() => {
      location.reload();
    });

    this.idle.watch();
  }

  ngOnInit() {
    this.spinner.show('mainSpinner');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      this.spinner.hide('mainSpinner');
      document.body.style.overflow = 'auto';
    }, 5000);
  }
}
