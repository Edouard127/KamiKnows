import {Client, Presence, register} from "discord-rpc"

export default class RPCHandler {
	public readonly id: string;
	public readonly rpc: Client
	public enabled: boolean

	public constructor(id: string, enabled: boolean) {
		register(id);
		this.id = id;
		this.rpc = new Client({ transport: "ipc" });
		this.enabled = enabled;
	}

	public async update(activity: Presence) {
		await this.rpc.setActivity(activity).catch(console.error);
	}

	public async start() {
		if (!this.enabled) return;
		this.rpc.on("ready", () => console.log("Discord RPC ready"));
		await this.rpc.login({ clientId: this.id }).catch(error => {
			console.error(error);
			this.enabled = false;
		});
	}

	public async end() {
		if (!this.enabled) return null;
		await this.rpc.clearActivity().catch(e => console.log(e));
		return await this.rpc.destroy().catch(e => console.log(e));
	}
}
