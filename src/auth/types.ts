export const OAUTH_PROVIDER = ["google", "github"] as const;

export type OAUTH_PROVIDER_TYPE = (typeof OAUTH_PROVIDER)[number];
