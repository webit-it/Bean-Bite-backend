import { ICustomerRewardProgressDocument } from "../../../types/customerRewardProgress.type";
import { IQRCode, QrGenerateResponseDto } from "../../../types/qr.type";

export interface IQrService {
    generate(): Promise<QrGenerateResponseDto>
    verify(
        code: string,
        customerId: string
    ): Promise<IVerifyQrResponse>;

}


export interface IVerifyQrResponse {
    qrVerified: boolean;
    message: string;
    progress: ICustomerRewardProgressDocument | null;
}
