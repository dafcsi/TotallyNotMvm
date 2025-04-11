import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appInaktivFelhasznalo]',
  standalone: true,
})
export class InaktivFelhasznaloDirective implements OnChanges {
  @Input('appInaktivFelhasznalo') aktiv: boolean = true;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.aktiv) {
      this.renderer.setStyle(this.el.nativeElement, 'opacity', '0.5');
      this.renderer.setStyle(this.el.nativeElement, 'pointer-events', 'none');
    } else {
      this.renderer.removeStyle(this.el.nativeElement, 'opacity');
      this.renderer.removeStyle(this.el.nativeElement, 'pointer-events');
    }
  }
}
