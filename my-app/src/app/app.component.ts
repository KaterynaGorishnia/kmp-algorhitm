import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HighlightDirective } from "./highlight.directive";

interface Step {
    textIndex: number;
    patternIndex: number;
    action: string;
    textState: string;
}

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        FormsModule,
        HighlightDirective
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
}
