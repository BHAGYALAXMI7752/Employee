import { Directive, HostListener, Input, ElementRef, Renderer2, inject } from '@angular/core';

@Directive({ selector: '[appHighlight]', standalone: true })
export class HighlightDirective {
  @Input('appHighlight') highlightColor = 'yellow';
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private originalBackground = '';

  @HostListener('mouseenter') onMouseEnter(): void {
    this.originalBackground = this.elementRef.nativeElement.style.backgroundColor;
    this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', this.highlightColor);
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', this.originalBackground);
  }
}
