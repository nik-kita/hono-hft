import { CurrencyPair, CurrencyType } from "./currency.ts";

export type KuHeaders = {
  "KC-API-SIGN": string;
  "KC-API-TIMESTAMP": string;
  "KC-API-KEY": string;
  "KC-API-PASSPHRASE": string;
  "KC-API-KEY-VERSION": "2";
  "Content-Type": "application/json";
};

export type URL = "https://api.kucoin.com";
export type AccountType = "main" | "trade" | "trade_hf";

export type KuHttp = {
  "/api/v1/accounts": {
    url: `${URL}/api/v1/accounts`;
    req: {
      headers: KuHeaders;
      query: {
        currency: CurrencyType; // String	No	currency
        type: AccountType; //	String	No	Account type, trade_hf(high-frequency trading account)
      };
      method: "GET";
      body?: never;
    };
    res: {
      code: "20000";
      data: {
        id: string; //	accountId
        currency: CurrencyType; //	The currency the account is associated with
        type: AccountType; // trade_hf(high-frequency trading account)
        balance: string; //	Total funds
        available: string; //	Available funds
        holds: string; //	Funds frozen
      }[];
    };
  };
  "/api/v2/accounts/inner-transfer": {
    url: `${URL}/api/v2/accounts/inner-transfer`;
    req: {
      method: "POST";
      headers: KuHeaders;
      body: {
        clientOid: string; // String	clientOid, the unique identifier created by the client, use of UUID, with a maximum length of 128 bits.
        currency: CurrencyType;
        from: AccountType; // Payment Account Type: main, trade, margin, or isolated
        to: AccountType; // Receiving Account Type: main, trade, margin, isolated, or contract
        amount: string; // Transfer amount, the precision being a positive integer multiple of the Currency Precision
        fromTag?: CurrencyPair; // [Optional] Trading pair, required when the payment account type is isolated, e.g.: BTC-USDT
        toTag?: CurrencyPair; // [Optional] Trading pair, required when the receiving account type is isolated, e.g.: BTC-USDT
      };
      query?: never;
    };
    res: {
      code: "20000";
      data: {
        orderId: string;
      };
    };
  };
  "/api/v1/sub-accounts": {
    url: `${URL}/api/v1/sub-accounts`;
    req: {
      method: "GET";
      query?: never;
      body?: never;
      headers: KuHeaders;
    };
    res: {
      code: "2000";
      data: {
        subUserId: string; //	The user ID of the sub-user.
        subName: string; //	The username of the sub-user.
        currency: CurrencyType; //	The currency of the account.
        balance: string; //	Total funds in the account.
        available: string; //	Funds available to withdraw or trade.
        holds: string; //	Funds on hold (not available for use).
        baseCurrency: CurrencyType; //	Calculated on this currency.
        baseCurrencyPrice: string; //	The base currency price.
        baseAmount: string; //	The base currency amount.
      }[];
    };
  };
  "/api/v1/accounts/ledgers": {
    url: `${URL}/api/v1/accounts/ledgers`;
    req: {
      method: "GET";
      query: {
        /**
         * @description
         *
         * honestly it is possible to send "CurrencyType,CurrencyType..."
         * but for simplicity declare only single
         */
        currency?: CurrencyType;
        direction?: "in" | "out";
        bizType?:
          | "DEPOSIT"
          | "WITHDRAW"
          | "TRANSFER"
          | "SUB_TRANSFER"
          | "TRADE_EXCHANGE"
          | "MARGIN_EXCHANGE"
          | "KUCOIN_BONUS";
        startAt?: number;
        endAt?: number;
      };
      body?: never;
      headers: KuHeaders;
    };
    res: {
      code: "200000";
      data: {
        id: string;
        currency: CurrencyType;
        amount: string;
        fee: string; //	Fees generated in transaction, withdrawal, etc.
        balance: string; //	Remaining funds after the transaction.
        accountType: "MAIN" | "TRADE" | "MARGIN" | "CONTRACT";
        bizType: string; //	Business type leading to the changes in funds, such as exchange, withdrawal, deposit, KUCOIN_BONUS, REFERRAL_BONUS, Lendings etc.
        direction: "out" | "in";
        createdAt: number; // Time of the event
        context: string; // TODO => JSON-string ???
      };
    };
  };

  "/api/v1/bullet-public": {
    url: `${URL}/api/v1/bullet-public`;
    req: {
      method: "POST";
      query?: never;
      body?: never;
      headers?: never;
    };
    res: {
      code: "200000";
      data: {
        token: string;
        instanceServers: {
          endpoint: "wss://ws-api-spot.kucoin.com/";
          encrypt: true;
          protocol: "websocket";
          pingInterval: number;
          pingTimeout: number;
        }[];
      };
    };
  };
  "/api/v1/bullet-private": {
    url: `${URL}/api/v1/bullet-private`;
    req: {
      method: "POST";
      query?: never;
      body?: never;
      headers: KuHeaders;
    };
    res: {
      code: "200000";
      data: {
        token: string;
        instanceServers: {
          endpoint: "wss://ws-api-spot.kucoin.com/";
          encrypt: true;
          protocol: "websocket";
          pingInterval: number;
          pingTimeout: number;
        }[];
      };
    };
  };
  "/api/v3/market/orderbook/level2": {
    url: `${URL}/api/v3/market/orderbook/level2`;
    req: {
      method: "GET";
      query: { symbol: CurrencyPair };
      body?: never;
      headers: KuHeaders;
    };
    res: {
      type: "message";
      topic: string;
      subject: "trade.l2update";
      data: {
        sequence: string;
        time: number;
        bids: [string, string][];
        asks: [string, string][];
        // changes: {
        //   asks: [string, string, string];
        //   bids: [string, string, string];
        // };
        // sequenceEnd: number;
        // sequenceStart: number;
        // symbol: CurrencyPair;
        // time: number;
      };
    };
  };
};

export type Endpoint = keyof KuHttp;

export type KuReq<T extends Endpoint = Endpoint> =
  KuHttp[T]["req"]["headers"] extends never | void
    ? Omit<KuHttp[T]["req"], "headers"> & { url: KuHttp[T]["url"] }
    : Omit<KuHttp[T]["req"], "headers"> & { url: KuHttp[T]["url"] } & {
      forSignature:
        & {
          endpoint: T;
        }
        & Omit<
          KuHttp[T]["req"],
          | Exclude<keyof KuHttp[T]["req"], keyof Partial<KuHttp[T]["req"]>>
          | "headers"
        >;
    };

export type KuRes<T extends Endpoint = Endpoint> = KuHttp[T]["res"];
