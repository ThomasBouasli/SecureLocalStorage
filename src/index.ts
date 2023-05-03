import * as crypto from "crypto";

export default class SecureLocalStorage {
  private readonly key: string;

  constructor(key: string) {
    this.key = key;
  }

  public setItem(key: string, value: string): void {
    localStorage.setItem(key, this.encrypt(value));
  }

  public getItem(key: string): string | null {
    const value = localStorage.getItem(key);
    if (value === null) {
      return null;
    }
    return this.decrypt(value);
  }

  public removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  private encrypt(value: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-ctr", this.key, iv);
    const encrypted = Buffer.concat([cipher.update(value), cipher.final()]);
    return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
  }

  private decrypt(value: string): string {
    const [iv, encrypted] = value.split(":");
    const decipher = crypto.createDecipheriv(
      "aes-256-ctr",
      this.key,
      Buffer.from(iv, "hex")
    );
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encrypted, "hex")),
      decipher.final(),
    ]);
    return decrypted.toString();
  }
}
