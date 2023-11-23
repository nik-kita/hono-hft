import { KuReq } from "./http.ts";

const te = new TextEncoder();

const prepare_str = ({
  endpoint,
  method,
  timestamp,
  body,
}: {
  endpoint: string;
  timestamp: number;
  method: "POST" | "GET" | "DELETE";
  body?: object | string;
}) => {
  let _body: string | object = body ?? "";

  if (Object(body) === body) {
    _body = JSON.stringify(body);
  }

  return `${timestamp}${method}${endpoint}${_body}`;
};

const sign = async ({
  apiSecret,
  payload,
}: {
  payload: string;
  apiSecret: string;
}): Promise<string> => {
  const tePayload = te.encode(payload);
  const cryptoKey = await crypto
    .subtle
    .importKey(
      "raw",
      te.encode(apiSecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
  const result = btoa(
    String.fromCharCode(
      ...new Uint8Array(
        await crypto
          .subtle
          .sign("HMAC", cryptoKey, tePayload),
      ),
    ),
  );

  return result;
};

export const gen_headers = async (
  {
    method,
    endpoint,
    query,
    body,
  }: KuReq["forSignature"],
  {
    key,
    secret,
    passphrase,
  }: ApiKeys,
) => {
  const _endpoint = query && Object.keys(query).length
    ? `${endpoint}?${new URLSearchParams(query as Record<string, string>)}`
    : endpoint;
  const timestamp = Date.now();
  const stringToSign = prepare_str({
    endpoint: _endpoint,
    timestamp,
    method,
    body,
  });
  const [signature, signedPassphrase] = await Promise.all([
    sign({
      payload: stringToSign,
      apiSecret: secret,
    }),
    sign({
      payload: passphrase,
      apiSecret: secret,
    }),
  ]);
  const headers = {
    "KC-API-SIGN": signature,
    "KC-API-TIMESTAMP": timestamp.toString(),
    "KC-API-KEY": key,
    "KC-API-PASSPHRASE": signedPassphrase,
    "KC-API-KEY-VERSION": "2",
    "Content-Type": "application/json",
  } as const;

  return headers;
};

export type ApiKeys = {
  key: string;
  secret: string;
  passphrase: string;
};
