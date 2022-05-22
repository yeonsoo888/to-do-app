import axios from "axios"

type Data = {
    mail: String,
    pw: String,
}
export class Member {
    option: {
        credentials: string
    }
    constructor() {
        this.option = {
            credentials: 'include',
        }
    }

    

    member = async (method:string,url:string,data:Data) : Promise<Object> => {
        const params = {
            method: method,
            url: url,
            data: data,
        };
        
        const option = this.option;

        return await axios(
            {...params, ...option}
        )
    } 
}