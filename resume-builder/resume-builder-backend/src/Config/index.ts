import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({
    path:path.resolve(__dirname,"../../.env"),
})

export interface ConfigInterface{
    APP_PORT:number;
    MONGO_URI:string;
    SECRET_KEY:string;
}
export class Config implements ConfigInterface{
    public APP_PORT: number;
    public MONGO_URI: string;
    public SECRET_KEY: string;
    constructor(){
        console.log("process.env.port:",process.env.APP_Port);
        this.APP_PORT= Number(process.env.APP_PORT);
        this.MONGO_URI= process.env.MONGO_URI;
        this.SECRET_KEY= process.env.SECRET_KEY;
    }
}

export default new Config();