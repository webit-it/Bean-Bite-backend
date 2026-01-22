import HttpStatus from "../../constants/httpsStatusCode";
import { Messages } from "../../constants/messages";
import IProductRepository from "../../interfaces/repository/product.repository.interface";
import { IProductService } from "../../interfaces/service/customer/customer.product.interface";
import AppError from "../../utils/AppError";

export class ProductService implements IProductService{
    constructor(private _productRepo:IProductRepository){}
    getProducts=async(page:number,limit:number,search:string,category:string)=>{
       try {
           const result=await this._productRepo.findAllPaginated(page,limit,search,category)
            const totalPages = Math.ceil(result.total / limit);
           return {products:result.data,page,totalPages,limit}
       } catch (error) {
        console.log("Error get products",error)
        throw error
       }
    }
    getProductDetails = async (slug: string) => {
        try {
          const product = await this._productRepo.findBySlug(slug);
    
          if (!product) {
            throw new AppError(
              Messages.PRODUCT_NOT_FOUND,
              HttpStatus.NOT_FOUND
            );
          }
          return product;
        } catch (error) {
          console.log("Get category for edit error:", error);
          throw error;
        }
      };
}