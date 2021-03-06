import { Directive, Input, ElementRef, Renderer2, OnInit, HostBinding, ViewContainerRef } from '@angular/core';
import { TooltipDirective, TooltipConfig } from 'ngx-bootstrap/tooltip';
import { ComponentLoaderFactory } from 'ngx-bootstrap/component-loader';
import { PositioningService } from 'ngx-bootstrap/positioning';

@Directive({
  selector: '[imeTooltip]'
})
export class ImeTooltipDirecive implements OnInit {

  @Input() imeTooltip: string;
  @Input() tooltipPlacement: 'top' | 'bottom' | 'left' | 'right' = 'top';
  @HostBinding('attr.tooltip') bootstrapTooltip;

  constructor(private _viewContainerRef: ViewContainerRef, private _elementRef: ElementRef, private _renderer: Renderer2, private cis: ComponentLoaderFactory, private _config: TooltipConfig,private _positioningService: PositioningService) {

  }

  ngOnInit() {
    const element = this._elementRef;
    this.bootstrapTooltip = new TooltipDirective(this._viewContainerRef, this.cis, this._config, this._elementRef, this._renderer, this._positioningService);
    this.bootstrapTooltip.tooltip = this.imeTooltip;
    this.bootstrapTooltip.placement = this.tooltipPlacement;
    this.bootstrapTooltip.ngOnInit();
  }

}