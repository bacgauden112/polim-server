export interface IPurchasing {
    getExchange(customerId:number): Promise<IExchangeRate>;
    getExchange(customerId:number, appliedTime: Date): Promise<IExchangeRate>;
    getOrderFeature(customerId:number): Promise<IOrderFeature>;
    getOrderFeature(customerId:number, appliedTime: Date): Promise<IOrderFeature>;
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

export interface IOrderFeature {
    /**
     * Danh sách các nhóm tính chất
     */
    groups: Array<IGroup>,
    /**
     * Danh sách các tính chất
     */
    features: Array<IFeature>,
}

export interface IGroup {
    /**
     * Mã nhóm
     */
    code: string,
    /**
     * Tên nhóm
     */
    name: string,
    /**
     * Có bắt buộc phải chọn một tính chất của nhóm này hay không
     * (ví dụ luôn phải chọn một dịch vụ vận chuyển quốc tế)
     */
    isRequired: boolean,
    /**
     * Có cho phép chọn nhiều tính chất trong cùng nhóm hay không.
     * Nếu không (false) tức là trong nhóm này chỉ được chọn một.
     */
    isMultiChoice: boolean
}

export interface IFeature {
    /**
     * Mã tính chất
     */
    code: string,
    /**
     * Tên tính chất
     */
    name: string,
    /**
     * Đường dẫn tới file icon của tính chất (nếu có),
     * có thể sử dụng cho việc hiển thị trên App
     */
    icon: string,
    /**
     * Có cho phép chọn tính chất này hay không
     */
    enabled: boolean,
    /**
     * Có yêu cầu phải chờ duyệt hay không
     */
    pending: boolean,
    /**
     * Có mặc định chọn khi tạo đơn hay khôn
     */
    default: boolean,
    /**
     * Tính chất này thuộc nhóm nào
     */
    groupCode: string,
    /**
     * Để chọn được tính chất này, có bắt buộc phải chọn một trong các tính chất khác hay không.
     * Ví dụ: phải chọn chuyển phát nhanh thì mới chọn được chuyển thẳng.
     */
    requires: Array<string>
}