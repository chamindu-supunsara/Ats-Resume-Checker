import { DatePipe } from '@angular/common';
import { Component, OnInit, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { Knob } from 'primeng/knob';
import { PanelModule } from 'primeng/panel';
import { ProgressBar } from 'primeng/progressbar';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CardModule, Knob, FormsModule, DatePipe, PanelModule, ProgressBar],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent implements OnInit {
  score = input.required<number | null>();
  ScoreValue = signal<number | null>(null);
  currentDate = new Date();
  
  ngOnInit() {
    if (this.score() !== null) {
      this.ScoreValue.set(Math.round(this.score()!));
    }
  }
}
