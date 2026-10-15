import { singleton } from "../singleton";
import { InMemorySearchProvider } from "./provider";
import { SearchService } from "./service";

export * from "./types";
export { SearchService, clampLimit, DEFAULT_LIMIT, MAX_LIMIT } from "./service";
export { InMemorySearchProvider, CATALOG } from "./provider";

export const searchService = singleton("search", () => new SearchService(new InMemorySearchProvider()));
