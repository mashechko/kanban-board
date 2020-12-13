import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appZoom]',
})
export class ZoomDirective {
  constructor(private el: ElementRef) {}

  @Input('appZoom') defaultSize: string;

  @HostListener('mouseenter') onMouseEnter() {
    this.zoom(this.defaultSize);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.el.nativeElement.style.fontSize = this.defaultSize;
  }

  private zoom(size: string) {
    const bigSize = `${(parseInt(size, 10) * 1.1).toString()}px`;
    this.el.nativeElement.style.fontSize = bigSize;
  }
}
