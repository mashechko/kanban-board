import { Directive, DoCheck, ElementRef, Input, OnChanges, OnInit } from '@angular/core';

@Directive({
  selector: '[appSetBackground]',
})
export class SetBackgroundDirective implements OnInit, OnChanges {
  constructor(private el: ElementRef) {}

  @Input('appSetBackground') status: string;

  private color: string;

  ngOnInit() {
    this.setColor(this.status);
  }

  ngOnChanges() {
    this.setColor(this.status);
  }

  private setColor(status: string) {
    switch (status) {
      case 'ready to dev':
        this.color = 'linear-gradient(91.84deg, #4DE89E 0%, #439450 55.56%, #A9C604 100%)';
        break;
      case 'in development':
        this.color = 'linear-gradient(91.84deg, #A06BF7 0%, #B833CD 100%)';
        break;
      case 'in qa':
        this.color = 'linear-gradient(91.84deg, #4441F3 0%, #59CCE6 100%)';
        break;
      case 'closed':
        this.color = 'linear-gradient(91.84deg, #FB7B33 0%, #F8CA56 100%)';
        break;
      case 'Low Priority':
        this.color = 'linear-gradient(91.86deg, #3654F4 0%, rgba(48, 200, 248, 0.92) 100%)';
        break;
      case 'Med Priority':
        this.color = 'linear-gradient(92.24deg, #04C62F -42.63%, rgba(14, 219, 232, 0.92) 100%)';
        break;
      case 'High Priority':
        this.color = 'linear-gradient(91.86deg, #F43691 0%, rgba(248, 48, 72, 0.92) 100%)';
        break;
      default:
        this.color = this.status;
    }
    this.el.nativeElement.style.background = this.color;
  }
}
