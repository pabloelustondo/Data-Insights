/**
 * Created by dister on 2/24/2017.
 */

import { DadFilter} from "../filter";
import { TABLES} from "../sample.tables"
import {DadTable} from "../table.component";
import {DadElement} from "../dadmodels";

describe('DadFilter', () => {
    beforeEach(() => {

    });

    it('should get created', () => {
        let filter = new DadFilter();
        expect(filter).toBeTruthy();
    });

    it('should leave if the configuration is null', () => {
        let element: DadElement = TABLES[0]; //this chart does not have any transformation spec
        element.filter = null;
        let filter = new DadFilter();
        var result = filter.filter(element, element.data);
        expect(result).toBeDefined();
        expect(result.length).toBe(element.data.length); //use better test
    });

    it('should leave data unchaged if filter configuration not provided/undefined', () => {
        let element: DadElement = TABLES[0]; //this chart does not have any transformation spec
        let filter = new DadFilter();
        var result = filter.filter(element, element.data);
        expect(result).toBeDefined();
        expect(result.length).toBe(element.data.length); //use better test
    });

    it("should return one attribute's value", () => {
        let element: DadElement = TABLES[0]; //this chart does not have any transformation spec
        element.filter = {os:'iOS'};
        let filter = new DadFilter();
        var result = filter.filter(element, element.data);
        expect(result).toBeDefined();
        expect(result.length).toBe(2); //use better test
    });

    it("should return one attribute's value and applies a search", () => {
        let element: DadElement = TABLES[0]; //this chart does not have any transformation spec
        element.filter = {os:'Android'};
        element.search = "Samsung";
        let filter = new DadFilter();
        var result = filter.filter(element, element.data);
        expect(result).toBeDefined();
        expect(result.length).toBe(3); //use better test
    });



});