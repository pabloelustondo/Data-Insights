"use strict";
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var forms_1 = require('@angular/forms');
var ng2_slimscroll_1 = require('ng2-slimscroll/ng2-slimscroll');
var ng2_datepicker_component_1 = require('./src/components/ng2-datepicker.component');
var ng2_datepicker_component_2 = require('./src/components/ng2-datepicker.component');
exports.DatePickerOptions = ng2_datepicker_component_2.DatePickerOptions;
exports.DateModel = ng2_datepicker_component_2.DateModel;
var DatePickerModule = (function () {
    function DatePickerModule() {
    }
    DatePickerModule.decorators = [
        { type: core_1.NgModule, args: [{
                    declarations: [
                        ng2_datepicker_component_1.DatePickerComponent
                    ],
                    imports: [
                        common_1.CommonModule,
                        forms_1.FormsModule,
                        ng2_slimscroll_1.SlimScrollModule
                    ],
                    exports: [
                        ng2_datepicker_component_1.DatePickerComponent,
                        ng2_slimscroll_1.SlimScrollModule
                    ]
                },] },
    ];
    /** @nocollapse */
    DatePickerModule.ctorParameters = function () { return []; };
    return DatePickerModule;
}());
exports.DatePickerModule = DatePickerModule;
