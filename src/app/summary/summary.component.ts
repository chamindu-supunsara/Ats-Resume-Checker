import { DatePipe } from '@angular/common';
import { Component, OnInit, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Knob } from 'primeng/knob';
import { PanelModule } from 'primeng/panel';
import { ProgressBar } from 'primeng/progressbar';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CardModule, Knob, FormsModule, DatePipe, PanelModule, ProgressBar, ButtonModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent implements OnInit {
  score = input.required<number | null>();
  ScoreValue = signal<number | null>(null);
  Loading = signal<boolean>(false);
  currentDate = new Date();
  progress1 = signal<number>(0);
  progress2 = signal<number>(0);
  progress3 = signal<number>(0);
  
  ngOnInit() {
    if (this.score() !== null) {
      this.ScoreValue.set(Math.round(this.score()!));
    }
    this.updateProgressBars();
  }

  load() {
    this.Loading.set(true);

    setTimeout(() => {
      this.Loading.set(false);
      location.reload();
    }, 3000);
  }

  getRandomValue(): number {
    return Math.floor(Math.random() * (98 - 81 + 1)) + 81;
  }

  updateProgressBars() {
    this.progress1.set(this.getRandomValue());
    this.progress2.set(this.getRandomValue());
    this.progress3.set(this.getRandomValue());
  }
}
