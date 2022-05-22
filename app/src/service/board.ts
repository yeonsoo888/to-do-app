import axios from 'axios';

export class BoardServ {
    option;
    constructor() {
        this.option = {
            credentials: 'include',
        }
    };

    async fetchBoard(method:string,url:string,data?:Object) : Promise<Object> {
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
