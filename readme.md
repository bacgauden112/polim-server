## Dự án Polim, Server Application
Cung cấp API cho Client App (bao gồm cả mobile app và web app) sử dụng.

## Các công nghệ & framework sử dụng

1. Loopback
2. PostgreSQL
3. Và các thành phần khác...

## Quy định

### Quy định về mã lỗi

Lỗi được trả về qua HTTP STATUS.

Đối với đối tượng Error, chỉ sử dụng mã 5xx trong những trường hợp lỗi do code hệ thống hoặc không xác định được nguyên nhân lỗi
 
Sử dụng mã lỗi 4xx cho những trường hợp lỗi đã xác định

**error.message**: Thể hiện thông báo lỗi có thể dùng để thông báo cho người dùng

**error.details**: Chỉ có thể sử dụng khi mã lỗi là 4xx chứa thông tin cụ thể của lỗi

Định dạng của details: thống nhất chung là một mảng các lỗi có định dạng chung như sau:

    [
      { "code": "ERROR_CODE", "message": "ERROR_MESSAGE" }
    ]

Lỗi validations: sử dụng cấu trúc của loopback. Tham khảo thêm loopback (yêu cầu có utils để sinh ra lỗi dạng này)

Ví dụ:

    let error = new Error('You can not do this');
    error.details = [
      { "code": "ACCESS_TOKEN_IS_NOT_VALID", "message": "Access Token không đúng" }
    ]