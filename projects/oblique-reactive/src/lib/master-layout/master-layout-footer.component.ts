import {Component, ContentChildren, HostBinding, Input, OnInit, QueryList, TemplateRef} from '@angular/core';
import {takeUntil} from 'rxjs/operators';

import {Unsubscribable} from '../unsubscribe';
import {ScrollingConfig} from '../scrolling';
import {MasterLayoutService} from './master-layout.service';
import {MasterLayoutConfig} from './master-layout.config';

export interface ORFooterLink {
	url: string;
	label: string;
	title?: string;
	external?: boolean;
}

@Component({
	selector: 'or-master-layout-footer',
	template: `
		<div class="footer-item footer-item-logo footer-sm-collapse">
			<a href="{{'i18n.application.organization.url' | translate}}" target="_blank" class="application-brand-logo">
				<img src="./assets/styles/images/logo.svg"
					 alt="{{'i18n.application.organization.name' | translate}}"/>
			</a>
		</div>
		<div class="footer-item footer-item-info">
			<ng-content select="[orFooterInfo]"></ng-content>
			<div class="footer-sm-collapse">
				<ng-content select="[orFooterInfoSMCollapse]"></ng-content>
			</div>
		</div>
		<div class="footer-item footer-item-links">
			<ng-content select="[orFooterLinks]" *ngIf="!footerLinks.length && !templates.length"></ng-content>
			<ul class="list-unstyled small d-flex flex-row justify-content-lg-end" role="menu" *ngIf="footerLinks.length && !templates.length">
				<li role="presentation" *ngFor="let link of footerLinks">
					<a [href]="link.url" class="link" [attr.title]="link.title | translate" [attr.target]="link.external ? '_blank' : undefined">
						{{link.label | translate}}
					</a>
				</li>
			</ul>
			<ul class="list-unstyled small d-flex flex-row justify-content-lg-end" role="menu" *ngIf="templates.length">
				<li role="presentation" *ngFor="let link of templates" >
					<ng-container [ngTemplateOutlet]="link"></ng-container>
				</li>
			</ul>
		</div>
	`,
	/* tslint:disable:use-host-property-decorator */
	host: {class: 'application-footer'}
})
export class MasterLayoutFooterComponent extends Unsubscribable implements OnInit {
	@Input() footerLinks: ORFooterLink[] = [];
	@HostBinding('class.application-footer-sm') small: boolean;
	@ContentChildren('orFooterLink') readonly templates: QueryList<TemplateRef<any>>;

	constructor(private readonly masterLayout: MasterLayoutService,
				private readonly config: MasterLayoutConfig,
				private readonly scroll: ScrollingConfig) {
		super();

		this.small = this.config.footer.small;

		this.updateFooterSmall();
		this.footerTransitions();
	}

	ngOnInit() {
		this.footerLinks = this.footerLinks.length ? this.footerLinks : this.config.footer.links;
		this.footerLinks.forEach((link) => {
			link.external = link.url.startsWith('http');
		});
	}

	private updateFooterSmall(): void {
		this.masterLayout.smallFooter = this.small;
		this.masterLayout.footerSmallEmitter.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.small = value;
		});
	}

	private footerTransitions(): void {
		if (this.scroll.transitions.footer) {
			this.scroll.onScroll.pipe(takeUntil(this.unsubscribe))
				.subscribe((isScrolling) => {
					this.small = !isScrolling;
				});
		}
	}
}