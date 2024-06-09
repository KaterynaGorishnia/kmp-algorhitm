import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective implements OnChanges {
  @Input() text: string = '';
  @Input() pattern: string = '';
  @Input() positions: number[] = [];

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(): void {
    this.highlight();
  }

  private highlight(): void {
    if (!this.pattern) {
      this.renderer.setProperty(this.el.nativeElement, 'innerHTML', this.text);
      return;
    }

    const regex = new RegExp(`(${this.pattern})`, 'gi');
    const highlightedText = this.text.replace(regex, '<span class="highlight">$1</span>');
    this.renderer.setProperty(this.el.nativeElement, 'innerHTML', highlightedText);
  }
}
