import axios from 'axios';

export class BoardServ {
    option;
    constructor() {
        this.option = {
            credentials: 'include',
        }
    };

    async fetchBoard(method:string,url:string) : Promise<Object> {
        const params = {
            method: method,
            url: url,
        }
        const option = this.option;

        return await axios(
            {...params,...option}
        );
    };
}
