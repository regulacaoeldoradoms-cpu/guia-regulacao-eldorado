// Only the transport's ECONNRESET may retry; HTTP errors and assertions do not.
export const fetchFixtureAsset=route=>route.fetch({maxRetries:1});
