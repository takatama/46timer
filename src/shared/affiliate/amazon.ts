export type SupportedLanguage = "ja" | "en";

interface EquipmentItem {
  name: string;
  href: string;
}

type ItemKind = "filter" | "dripper" | "kettle" | "scale" | "comandante" | "canister";

const AMAZON_SEARCH_KEYWORDS: Record<SupportedLanguage, Record<ItemKind, string>> = {
  ja: {
    dripper: "V60ドリッパーNeo",
    filter: "V60 フィルター",
    scale: "コーヒー スケール",
    kettle: "コーヒー 電気ケトル",
    comandante: "コマンダンテ ミル",
    canister: "コーヒー キャニスター",
  },
  en: {
    dripper: "V60 Dripper Neo",
    filter: "V60 filters",
    scale: "coffee scale",
    kettle: "pour over electric kettle",
    comandante: "Comandante grinder",
    canister: "coffee bean canister",
  },
};

const AMAZON_ASSOCIATE_TAG: Record<SupportedLanguage, string> = {
  ja: "tktm-22",
  en: "tktm-20",
};

const AMAZON_BASE_URL: Record<SupportedLanguage, string> = {
  ja: "https://www.amazon.co.jp/s",
  en: "https://www.amazon.com/s",
};

const AMAZON_SELLER_FILTER: Record<SupportedLanguage, string> = {
  ja: "AN1VRQENFRJN5",
  en: "ATVPDKIKX0DER",
};

export function buildAmazonSearchUrl(language: SupportedLanguage, query: string): string {
  const params = new URLSearchParams({
    k: query.replace(/\s+/g, "+"),
    rh: `p_6:${AMAZON_SELLER_FILTER[language]}`,
    tag: AMAZON_ASSOCIATE_TAG[language],
  });
  return `${AMAZON_BASE_URL[language]}?${params.toString().replace(/%2B/g, "+")}`;
}

export function getEquipmentItems(language: SupportedLanguage): EquipmentItem[] {
  const keywords = AMAZON_SEARCH_KEYWORDS[language];
  const names = language === "ja"
    ? ["V60ドリッパーNeo", "V60 フィルター", "スケール", "ケトル", "グラインダー / ミル", "キャニスター"]
    : ["V60 Dripper Neo", "V60 Filters", "Coffee Scale", "Pour-over kettle", "Grinder / Mill", "Bean canister"];
  const kinds: ItemKind[] = ["dripper", "filter", "scale", "kettle", "comandante", "canister"];

  return kinds.map((kind, index) => ({
    name: names[index],
    href: buildAmazonSearchUrl(language, keywords[kind]),
  }));
}
