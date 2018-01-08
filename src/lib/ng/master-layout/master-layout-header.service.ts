import {Injectable, EventEmitter} from '@angular/core';
import 'rxjs/add/operator/takeUntil';
import {ScrollingConfig} from '../scrolling';
import {Unsubscribable} from '../unsubscribe';

/**
 * Service for controlling ObliqueUI header composite features.
 */
@Injectable()
export class MasterLayoutHeaderService extends Unsubscribable {

	public openChange: EventEmitter<boolean> = new EventEmitter<boolean>();
	public variantChange: EventEmitter<boolean> = new EventEmitter<boolean>();

	private openValue = false;
	private mediumValue = false;

	constructor(private config: ScrollingConfig) {
		super();

		if (config.transitions) {
			config.onScroll.takeUntil(this.unsubscribe).subscribe((isScrolling) => {
				this.medium = isScrolling;
			});
		}
	}

	set open(value) {
		if (this.openValue !== value) {
			this.openChange.next(value);
		}
		this.openValue = value;
	}

	get open() {
		return this.openValue;
	}

	set medium(value) {
		this.mediumValue = value;
		this.variantChange.next(this.mediumValue);
	}

	get medium() {
		return this.mediumValue;
	}
}
