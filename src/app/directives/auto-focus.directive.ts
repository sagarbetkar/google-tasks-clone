import { Directive, AfterContentInit, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]'
})
export class AutoFocusDirective implements AfterContentInit {

  @Input() appAutoFocus: boolean;

  public constructor(private el: ElementRef) {

  }

  ngAfterContentInit() {
      setTimeout(() => {
          this.el.nativeElement.focus();
      }, 500);
  }

}
