import type {Product} from "./types.js"
export function sortItem <T,K extends keyof T>(
    items:T[],
    key:K,
    order:"asc"|"desc"="asc"
): T[] {
    const sortedItem =[...items];

    sortedItem.sort((a,b)=>{
            const valueA = a[key];
            const valueB = b[key];

            let comparison:number;

            if(typeof valueA === "number" && typeof valueB === "number"
            ){
                comparison= valueA -valueB
            } else {
             comparison = String(valueA).localeCompare(String(valueB), undefined, {numeric:true, sensitivity:"base"});
            }
            return order === "asc" ? comparison : -comparison;
        });
        return sortedItem;
    }

export function searchItems <T, K extends keyof T>(
    items: T[],
    query:string,
    key:K
): T[] {
    const search = query.toLowerCase();

    if (!search) return [...items];

    return items.filter(item=>{
        const value = item[key];
        return String(value).toLowerCase().includes(search);
    })
}                

export function paginate<T>(
    items:T[],
    page:number,
    pageSize:number
): T[] {
    if (
        !Number.isInteger(page) ||
        !Number.isInteger(pageSize) ||
        page < 1 ||
        pageSize < 1
    ){
        throw new Error("Invalid page or page size");
    }
    const startIndex= (page -1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
}
