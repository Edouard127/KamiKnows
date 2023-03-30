import AbstractPlugin from "./abstract/AbstractPlugin";
import {ISetting} from "../interface/ISetting";
import KrunkerClient from "./KrunkerClient";

export default class Plugin extends AbstractPlugin {
    public override settings: ISetting[];
    public override readonly client: KrunkerClient;

    public constructor(client: KrunkerClient) {
        super(client)
        this.client = client
    }

    public override run(arg0: ISetting<any>): void {
        throw new Error("Method not implemented.")
    }
}
