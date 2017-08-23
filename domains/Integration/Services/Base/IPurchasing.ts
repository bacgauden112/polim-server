export interface IPurchasing {
    getExchange(customerId:number): Promise<IExchangeRate>;
    getExchange(customerId:number, appliedTime: Date): Promise<IExchangeRate>;
}

export interface IExchangeRate {
    /**
    Tỉ giá đổi 1 baseCurrency = x targetCurrency
     */
    rate: number,
    /**
     * Mã tiền tệ (ví dụ: VND, CNY)
     */
    baseCurrency: string,
    /**
     * Mã tiền tệ (ví dụ VND, CNY)
     */
    targetCurrency: string
    /**
     * Thời gian bắt đầu áp dụng
     */
    appliedFrom?: Date
    /**
     * Thời gian áp dụng đến
     */
    appliedTo?: Date
}