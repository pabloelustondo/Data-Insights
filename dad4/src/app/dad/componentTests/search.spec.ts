/**
 * Created by dister on 3/2/2017.
 */
import { DadSearch} from "../search";
import { TABLES} from "../sample.tables"
import {DadTable} from "../table.component";
import {DadElement} from "../dadmodels";

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