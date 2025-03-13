import { RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';
import { FooterComponent } from "./ui/footer/footer.component";
import { HeaderComponent } from "./ui/header/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

}
