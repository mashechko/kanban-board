import { Directive, DoCheck, ElementRef, Input, OnChanges, OnInit } from '@angular/core';

@Directive({
  selector: '[appCheckDueDate]',
})
export class CheckDueDateDirective implements OnInit {
  constructor(private el: ElementRef) {}

  @Input('appCheckDueDate') dueDate: number;

  ngOnInit() {
    this.checkDate();
  }

  private checkDate() {
    const currentDate = new Date().getTime();
    const timeLeft = this.dueDate - currentDate;
    if (timeLeft < 0) {
      this.highlight('red');
    } else if (timeLeft < 86400000) {
      this.highlight('orange');
    }
  }

  private highlight(color: string) {
    this.el.nativeElement.style.color = color;
  }
}
