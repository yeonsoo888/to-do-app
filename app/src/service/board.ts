import axios from 'axios';

interface Data {
    _id?:Number,
    title?:string,
    content?:string,
    writer?:string,
    date?:string,
    status?:string,
}

export class BoardServ {
    option;
    constructor() {
        this.option = {
            credentials: 'include',
        }
    };

    async fetchBoard(method:string,url:string,data?:Data) : Promise<Object> {
        const params = {
            method: method,
            url: url,
            data: data
        }
        const option = this.option;

        return await axios(
            {...params,...option}
        );
    };
}
