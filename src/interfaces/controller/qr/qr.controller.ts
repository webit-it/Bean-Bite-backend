import { Request, Response } from "express";

export interface IQrController{
    generateQr(req:Request,res:Response):Promise<void>
    verifyQr(req:Request,res:Response):Promise<void>
}