import {  PaginatedNotificationResponse } from "../../../types/notification.types";


export default interface IDashboardServiceInterface {

    getDashboardCounts(): Promise<{
        users: number;
        products: number;
        rewards: number;
    }>;
    getNotifications(
        page: number,
        limit: number,
        search?: string,
        status?:boolean
      ): Promise<PaginatedNotificationResponse>;
    
}
