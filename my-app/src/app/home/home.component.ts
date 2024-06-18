import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterOutlet} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {HighlightDirective} from "../highlight.directive";
interface Step {
  textIndex: number;
  patternIndex: number;
  action: string;
  textState: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    FormsModule,
    HighlightDirective
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  text: string = '';
  pattern: string = '';
  result: number[] = [];
  isSearchPerformed: boolean = false;
  steps: Step[] = [];
  currentStepIndex: number = -1;
  intervalId: any = null;
  stepInterval: number = 1000;

  examples = [
    { text: 'ABABDABACDABABCABAB', pattern: 'ABABCABAB' },
    { text: 'AAAAABAAABA', pattern: 'AAAA' },
    { text: 'AABAACAADAABAABA', pattern: 'AABA' }
  ];

  computeLPSArray(pattern: string, M: number, lps: number[]): void {
    let length = 0;
    let i = 1;
    lps[0] = 0;
    console.log(`LPS array initialization: ${lps}`);

    while (i < M) {
      if (pattern[i] === pattern[length]) {
        length++;
        lps[i] = length;
        i++;
        console.log(`Match found. Updated LPS array: ${lps}`);
      } else {
        if (length !== 0) {
          length = lps[length - 1];
          console.log(`Mismatch after match. Length updated to ${length}`);
        } else {
          lps[i] = 0;
          i++;
          console.log(`Mismatch at the start. LPS[${i - 1}] set to 0`);
        }
      }
    }
  }

  KMPAlgorithm(text: string, pattern: string): number[] {
    let M = pattern.length;
    let N = text.length;
    let lps: number[] = new Array(M).fill(0);
    let result: number[] = [];
    this.steps = [];

    this.computeLPSArray(pattern, M, lps);

    let i = 0;
    let j = 0;
    while (i < N) {
      this.recordStep(i, j, 'Comparing', text, pattern);
      console.log(`Comparing text[${i}] and pattern[${j}]`);
      if (pattern[j] === text[i]) {
        j++;
        i++;
        this.recordStep(i, j, 'Match', text, pattern);
        console.log(`Match: text[${i - 1}] = pattern[${j - 1}]`);
      }

      if (j === M) {
        result.push(i - j);
        this.recordStep(i, j, `Pattern found at index ${i - j}`, text, pattern);
        console.log(`Pattern found at index ${i - j}`);
        j = lps[j - 1];
      } else if (i < N && pattern[j] !== text[i]) {
        if (j !== 0) {
          j = lps[j - 1];
          this.recordStep(i, j, 'Mismatch after match, jump in pattern', text, pattern);
          console.log(`Mismatch after match, jump to pattern[${j}]`);
        } else {
          i++;
          this.recordStep(i, j, 'Mismatch at start, move in text', text, pattern);
          console.log(`Mismatch at start, move to text[${i}]`);
        }
      }
    }

    return result;
  }

  recordStep(textIndex: number, patternIndex: number, action: string, text: string, pattern: string) {
    const highlightedText = this.highlightCurrentMatch(text, pattern, textIndex, patternIndex);
    this.steps.push({ textIndex, patternIndex, action, textState: highlightedText });
    console.log(`Step recorded: ${action}, textIndex: ${textIndex}, patternIndex: ${patternIndex}`);
  }

  highlightCurrentMatch(text: string, pattern: string, textIndex: number, patternIndex: number): string {
    const beforeMatch = text.substring(0, textIndex);
    const match = text.substring(textIndex, textIndex + patternIndex);
    const afterMatch = text.substring(textIndex + patternIndex);
    return `${beforeMatch}<span class="highlight">${match}</span>${afterMatch}`;
  }

  findPattern() {
    this.isSearchPerformed = true;
    this.result = this.KMPAlgorithm(this.text, this.pattern);
    this.currentStepIndex = -1;
    this.steps = [];
  }

  findPatternDetailed() {
    this.isSearchPerformed = true;
    this.result = this.KMPAlgorithm(this.text, this.pattern);
    this.currentStepIndex = 0;
    this.startAutoStep();
  }

  reset() {
    this.text = '';
    this.pattern = '';
    this.result = [];
    this.isSearchPerformed = false;
    this.steps = [];
    this.currentStepIndex = -1;
    this.stopAutoStep();
  }

  loadExample(exampleNumber: number) {
    const example = this.examples[exampleNumber - 1];
    this.text = example.text;
    this.pattern = example.pattern;
    this.isSearchPerformed = false;
    this.result = [];
    this.steps = [];
    this.currentStepIndex = -1;
    this.stopAutoStep();
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const fileContent = e.target.result;
        const lines = fileContent.split('\n');
        if (lines.length >= 2) {
          this.text = lines[0].trim();
          this.pattern = lines[1].trim();
          this.isSearchPerformed = false;
          this.result = [];
          this.steps = [];
          this.currentStepIndex = -1;
          this.stopAutoStep();
        }
      };
      reader.readAsText(file);
    }
  }

  previousStep() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      console.log(`Moved to previous step: ${this.currentStepIndex}`);
    }
  }

  nextStep() {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
      console.log(`Moved to next step: ${this.currentStepIndex}`);
    }
  }

  get currentStep(): Step | null {
    return this.steps[this.currentStepIndex] || null;
  }

  startAutoStep() {
    this.stopAutoStep();
    this.intervalId = setInterval(() => {
      if (this.currentStepIndex < this.steps.length - 1) {
        this.currentStepIndex++;
        console.log(`Auto step to: ${this.currentStepIndex}`);
      } else {
        this.stopAutoStep();
        console.log('Auto step completed');
      }
    }, this.stepInterval);
  }

  stopAutoStep() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('Auto step paused');
    }
  }

  increaseSpeed() {
    this.stepInterval = Math.max(100, this.stepInterval - 200);
    this.startAutoStep();
    console.log(`Increased speed, interval: ${this.stepInterval}ms`);
  }

  decreaseSpeed() {
    this.stepInterval += 200;
    this.startAutoStep();
    console.log(`Decreased speed, interval: ${this.stepInterval}ms`);
  }
}

