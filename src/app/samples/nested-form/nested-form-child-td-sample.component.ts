import {Component, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ObThemeService} from 'oblique';

@Component({
	selector: 'app-nested-form-child-td-sample',
	exportAs: 'childTD',
	templateUrl: './nested-form-child-td-sample.component.html',
	styleUrls: ['./mandatory.scss']
})
export class NestedFormChildTDSampleComponent {
	@ViewChild(NgForm, {static: true}) ngForm;
	field1 = '';
	field2 = '';
	grandchild;
	material: Observable<boolean>;

	constructor(theme: ObThemeService) {
		this.material = theme.theme$.pipe(map(() => theme.isMaterial()));
	}
}
