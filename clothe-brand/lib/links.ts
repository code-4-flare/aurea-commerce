export type UtmParameters = Partial<{
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
}>;

const utmKeys: Array<[keyof UtmParameters, string]> = [
  ["utmSource", "utm_source"],
  ["utmMedium", "utm_medium"],
  ["utmCampaign", "utm_campaign"],
  ["utmContent", "utm_content"],
  ["utmTerm", "utm_term"],
];

export function isExternalHttpUrl(href: string) {
  return /^https?:\/\//i.test(href);
}

export function isPrivateStorePath(href: string) {
  try {
    const pathname = new URL(href, "https://aurea.invalid").pathname;
    return pathname === "/studio" || pathname.startsWith("/studio/");
  } catch {
    return false;
  }
}

export function withUtmParameters(href: string, parameters: UtmParameters) {
  const external = isExternalHttpUrl(href);
  const url = new URL(href, "https://aurea.invalid");

  for (const [inputKey, queryKey] of utmKeys) {
    const value = parameters[inputKey]?.trim();
    if (value) url.searchParams.set(queryKey, value);
  }

  return external ? url.toString() : `${url.pathname}${url.search}${url.hash}`;
}

export function buildWhatsAppUrl(baseUrl: string, message: string) {
  const url = new URL(baseUrl);
  const hostname = url.hostname.toLowerCase();

  if (url.protocol !== "https:" || (hostname !== "wa.me" && hostname !== "api.whatsapp.com")) {
    throw new Error("WhatsApp URL must use wa.me or api.whatsapp.com over HTTPS.");
  }

  url.searchParams.set("text", message.trim());
  return url.toString();
}

export function createWhatsAppOrderMessage(input: {
  orderNumber: string;
  total: number;
  items: Array<{ name: string; size: string; color: string; quantity: number }>;
  trackedStoreUrl: string;
}) {
  const itemLines = input.items.map(
    item => `• ${item.name} — ${item.size}, ${item.color} × ${item.quantity}`,
  );

  return [
    "Hello Aurea Nairobi, I would like to complete this order via WhatsApp.",
    `Inquiry: ${input.orderNumber}`,
    "",
    ...itemLines,
    "",
    `Quoted total: KES ${input.total.toLocaleString("en-KE")}`,
    `Store: ${input.trackedStoreUrl}`,
  ].join("\n");
}
