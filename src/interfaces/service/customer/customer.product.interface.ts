import { IProduct } from "../../../types/product.type";

export interface IProductService{
    getProducts(page:number,limit:number,search:string,category:string):Promise<{products:IProduct[],page:number,totalPages:number,limit:number}>
    getProductDetails(slug: string): Promise<IProduct>;
}