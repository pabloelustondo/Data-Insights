import {Route, Get, Post, Delete, Patch, Example} from 'tsoa';
import {SDS} from '../models/user';
// import * as https from 'https';
const config = require('../../appconfig.json');
import * as querystring from 'querystring';
import * as rp from 'request-promise';
@Route('Data')
export class MultiplePostsController {

    /**
     * Post a unit of data to be stored in the cloud analytics database
     */

    @Post()
    @Example<any>({
        metadata: 'here is where metadata explaining the data should go',
        createdAt: '2016-08-08',
        data: ['aaa', 'bbb', 'ccc']
    })
    public async Create(request: SDS, optionalString?: string): Promise<SDS> {

        this.amazonCall(request, optionalString);
        return  {
            metadata: 'Thanks a lot',
            createdAt: new Date()
        };
    }

    private async amazonCall (request: SDS, optionString?: string): Promise<SDS> {
        return  {
            metadata: 'Thanks a lot',
            createdAt: new Date()
        };
    }
    // Build the post string from an object



}
/**
 * Created by vdave on 12/6/2016.
 */
