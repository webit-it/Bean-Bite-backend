import { IQRCode, QrGenerateResponseDto } from "../../../types/qr.type";

export interface IQrService{
    generate():Promise<QrGenerateResponseDto>
    verify(code:string):Promise<IQRCode>
}