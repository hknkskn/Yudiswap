// supra-l1-sdk type declarations
declare module 'supra-l1-sdk' {
    export class SupraClient {
        static init(rpcUrl: string): Promise<SupraClient>;
        getAccountCoinBalance(address: string, coinType: string): Promise<bigint>;
        getBalance(address: string): Promise<bigint>;
        transferSupraCoin(
            sender: SupraAccount,
            receiver: HexString,
            amount: bigint,
            options?: object
        ): Promise<object>;
    }

    export class SupraAccount {
        constructor(privateKey?: Uint8Array);
        address(): HexString;
    }

    export class HexString {
        constructor(hex: string);
        toString(): string;
        toUint8Array(): Uint8Array;
    }

    export class BCS {
        static bcsSerializeStr(str: string): Uint8Array;
        static bcsSerializeU8(num: number): Uint8Array;
        static bcsSerializeU64(num: bigint): Uint8Array;
        static bcsSerializeU128(num: bigint): Uint8Array;
    }
}
