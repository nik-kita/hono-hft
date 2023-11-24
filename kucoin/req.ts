import { KuReq, KuRes } from "./http.ts";
import { ApiKeys, gen_headers } from "./sign-generator.ts";

const { forSignature, method, url }: KuReq<"/api/v1/bullet-private"> = {
  url: "https://api.kucoin.com/api/v1/bullet-private",
  forSignature: {
    endpoint: "/api/v1/bullet-private",
    method: "POST",
  },
  method: "POST",
};

export async function apply_private_connect_token(keys: ApiKeys) {
  const headers = await gen_headers(forSignature, keys);

  return fetch(url, { method, headers })
    .then(
      (res) => res.json() as Promise<KuRes<"/api/v1/bullet-private">>,
    )
    .then((r) => {
      if (r.code !== "200000") {
        throw new Error(
          "kucoin-api: problem during applying private connection-token",
        );
      }

      return r;
    })
    .then(({ data: { instanceServers, token } }) => ({
      instanceServers,
      token,
    }));
}
