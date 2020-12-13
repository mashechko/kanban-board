import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appSetBackground]',
})
export class SetBackgroundDirective implements OnInit {
  constructor(private el: ElementRef) {}

  @Input('appSetBackground') color: string;

  ngOnInit() {
    this.setColor(this.color);
  }

  private setColor(color: string) {
    this.el.nativeElement.style.background = color;
  }
}
