import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective implements OnChanges {
  @Input('appTooltip') tooltipText: string = '';
  
  private tooltipElement: HTMLElement | null = null;
  
  constructor(private el: ElementRef, private renderer: Renderer2) {
    // Make the host element position relative for absolute positioning of tooltip
    this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');
    
    // Add mouse events
    this.renderer.listen(this.el.nativeElement, 'mouseenter', () => this.showTooltip());
    this.renderer.listen(this.el.nativeElement, 'mouseleave', () => this.hideTooltip());
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tooltipText'] && this.tooltipElement) {
      this.renderer.setProperty(this.tooltipElement, 'textContent', this.tooltipText);
    }
  }
  
  private showTooltip(): void {
    if (!this.tooltipText) return;
    
    // Create tooltip element
    this.tooltipElement = this.renderer.createElement('div');
    this.renderer.appendChild(document.body, this.tooltipElement);
    
    // Set content and style
    this.renderer.setProperty(this.tooltipElement, 'textContent', this.tooltipText);
    this.renderer.addClass(this.tooltipElement, 'tooltip');
    
    // Position the tooltip
    const hostPos = this.el.nativeElement.getBoundingClientRect();
    this.renderer.setStyle(this.tooltipElement, 'position', 'absolute');
    this.renderer.setStyle(this.tooltipElement, 'top', `${hostPos.bottom + 5}px`);
    this.renderer.setStyle(this.tooltipElement, 'left', `${hostPos.left}px`);
    this.renderer.setStyle(this.tooltipElement, 'background-color', 'rgba(0, 0, 0, 0.8)');
    this.renderer.setStyle(this.tooltipElement, 'color', 'white');
    this.renderer.setStyle(this.tooltipElement, 'padding', '5px 10px');
    this.renderer.setStyle(this.tooltipElement, 'border-radius', '4px');
    this.renderer.setStyle(this.tooltipElement, 'z-index', '10000');
    this.renderer.setStyle(this.tooltipElement, 'font-size', '12px');
  }
  
  private hideTooltip(): void {
    if (this.tooltipElement) {
      this.renderer.removeChild(document.body, this.tooltipElement);
      this.tooltipElement = null;
    }
  }
}