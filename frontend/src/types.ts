export type User={id:number;name:string;email:string;role:string|null;permissions:string[]};export type Page<T>={data:T[];page:number;pages?:number;total?:number;hasMore?:boolean};export type Item=Record<string,unknown>&{id:number;title?:string;name?:string;slug?:string};
declare global{interface Window{Razorpay:new(options:Record<string,unknown>)=>{open:()=>void}}}
