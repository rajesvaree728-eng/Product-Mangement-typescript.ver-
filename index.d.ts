export declare function sortItem<T, K extends keyof T>(items: T[], key: K, order?: "asc" | "desc"): T[];
export declare function searchItems<T, K extends keyof T>(items: T[], query: string, key: K): T[];
export declare function paginate<T>(items: T[], page: number, pageSize: number): T[];
//# sourceMappingURL=index.d.ts.map