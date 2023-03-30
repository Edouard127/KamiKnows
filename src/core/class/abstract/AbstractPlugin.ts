import {IPlugin} from "../../interface/IPlugin";
import {ISetting} from "../../interface/ISetting";
import KrunkerClient from "../KrunkerClient";

export default abstract class AbstractPlugin implements IPlugin {
    abstract settings: ISetting[];
    abstract readonly client: KrunkerClient;

    protected constructor(client: KrunkerClient) {}

    abstract run(arg0: ISetting<any>): void
}
