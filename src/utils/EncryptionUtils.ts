import {randomBytes, createCipheriv, createDecipheriv, createHash} from "crypto"

export class EncryptionUtils {
	private readonly key: Buffer
	private readonly iv: Buffer
	private readonly salt: string

	public constructor(key: string, salt: string) {
		this.key = Buffer.from(key)
		this.iv = randomBytes(16)
		this.salt = salt
	}

	public encrypt(text: string): string {
		const cipher = createCipheriv("aes-256-gcm", this.key, this.iv)
		return cipher.update(text + this.salt, "utf8", "hex") + cipher.final("hex")
	}

	public decrypt(encrypted: string): string {
		const decipher = createDecipheriv("aes-256-gcm", this.key, this.iv)
		// @ts-ignore
		return (decipher.update(encrypted, "hex", "utf-8") + decipher.final("utf-8")).slice(16)
	}

	public hash(text: string): string {
		return createHash("sha256").update(text, "utf8").digest().toString("hex")
	}
}
