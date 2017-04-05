/**
 * Created by dister on 3/2/2017.
 */
import { DadSearch} from "../search";
import { TABLES} from "../sample.tables"
import {DadTable} from "../table.component";
import {DadElement} from "../dadmodels";
import { CHARTS } from "../sample.charts";

describe('DadSearch', () => {
    beforeEach(() => {

    });

    it('should get created', () => {
        let search = new DadSearch();
        expect(search).toBeTruthy();
    });

    it('should return the same data if the search string is empty', () => {
        let element: DadElement = TABLES[0]; //this chart does not have any transformation spec
        element.search = null;
        let search = new DadSearch();
        var result = search.search(element, element.data);
        expect(result).toBeDefined();
        expect(result.length).toBe(element.data.length); //use better test
    });

    it('should filter the data according to the user input', () => {
        let element: DadElement = TABLES[0]; //this chart does not have any transformation
        element.search = "Android";
        let search = new DadSearch();
        var result = search.search(element, element.data);
        expect(result).toBeDefined();
        expect(result.length).toBe(8); //use better test
    });
});

describe('ReadExpression', () => {

    it('should read the expression', () => {
        let element: DadElement = CHARTS[6];
        element.readExpression = "true";
        let search = new DadSearch();
        var result = search.readExpression(element, element.data.vehicle);
        expect(result.length).toBe(element.data.vehicle.length);
    });

    it('should return empty list', () => {
        let element: DadElement = CHARTS[6];
        element.readExpression = "false";
        let search = new DadSearch();
        var result = search.readExpression(element, element.data.vehicle);
        expect(result.length).toBe(0);
    });

    it('key gets its value', () => {
        let element: DadElement = CHARTS[6];
        element.readExpression = "id===1049";
        let search = new DadSearch();
        var result = search.readExpression(element, element.data.vehicle);
        expect(result[0].id).toBe("1049");
    });

    it('key gets its value 2', () => {
        let element: DadElement = CHARTS[6];
        element.readExpression = "routeTag===32";
        let search = new DadSearch();
        var result = search.readExpression(element, element.data.vehicle);
        expect(result[0].routeTag).toBe("32");
    });

});