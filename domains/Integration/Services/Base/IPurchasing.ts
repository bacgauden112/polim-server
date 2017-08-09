export interface IPurchasing {
    getExchange(): Promise<IExchangeRate>;
    getExchange(appliedTime): Promise<IExchangeRate>;
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