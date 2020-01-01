import { Directive, Input, ElementRef, Renderer2, OnInit, HostBinding, ViewContainerRef } from '@angular/core';
import { TooltipDirective, TooltipConfig, ComponentLoaderFactory } from 'ngx-bootstrap';

@Directive({
  selector: '[imeTooltip]'
})
export class ImeTooltipDirecive implements OnInit {

  @Input() imeTooltip: string;
  @Input() tooltipPlacement: 'top'|'bottom'| 'left'|'right' = 'top';
  @HostBinding('attr.tooltip') bootstrapTooltip;

  constructor(private _viewContainerRef: ViewContainerRef, private _elementRef: ElementRef, private renderer2: Renderer2, private _renderer: Renderer2, private cis: ComponentLoaderFactory, private config: TooltipConfig) {

  }

  ngOnInit() {
    const element = this._elementRef;
    this.bootstrapTooltip = new TooltipDirective(this._viewContainerRef, this._renderer, this._elementRef, this.cis, this.config);
    this.bootstrapTooltip.tooltip = this.imeTooltip;
    this.bootstrapTooltip.placement = this.tooltipPlacement;
    this.bootstrapTooltip.ngOnInit();
  }

}