import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appDisableIfAdmin]',
  standalone: true
})
export class DisableIfAdminDirective implements OnChanges {
  @Input('appDisableIfAdmin') isAdmin: boolean = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.renderer.setProperty(this.el.nativeElement, 'disabled', this.isAdmin);
  }
}
