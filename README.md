# Hướng Dẫn Cài Đặt Chương Trình

## 1. Cấu Hình Database
- Mở file `config.json` trong thư mục dự án và cập nhật các thông số trong mục `development`:
```json
"development": {
    "username": "root",
    "password": "mật khẩu",
    "database": "tên database",
    "host": "127.0.0.1",
    "dialect": "mysql"
}
```
- Tạo một database trong MySQL với tên trùng khớp với thông số bạn đã cấu hình.
-  Trỏ đến thư mục server. Chạy lệnh để tạo model và các migration cho database:
     ```bash
    npx sequelize db:migrate


---

## 2. Cài Đặt File .env
- Tạo file `.env` trong thư mục gốc của dự án và lưu các thông tin sau vào file này:

```
CLIENT_URL=http://localhost:3000
PORT=5000
EMAIL_USER=ssresystem@gmail.com
EMAIL_PASS=evjn ozdv bdon gmab
JWT_SECRET=dsadkljfajsaklfjafajkfreioweiowernj

# Cloudinary
CLOUDINARY_CLOUD_NAME=deotvipwa
CLOUDINARY_API_KEY=686938353963466
CLOUDINARY_API_SECRET=4i3gv-QSalUikK0a2rH_xZHeOXc

# Key Map
MAPKEY=AlzaSy9fbwrObb9dZLUbfmr5mdpSGMVqPiw3z-X

# Gemini Key
GOOGLE_API_KEY=AIzaSyBhrLKzKGBXZw21kPdBxdc-lbXFCD7_mQE
```
> **Lưu ý:** Nếu key hết hạn, hãy tạo key mới từ các dịch vụ tương ứng.

---

## 3. Chạy Chương Trình

### Client
1. Truy cập vào thư mục `client`:
    ```bash
    cd client
    ```
2. Cài đặt thư viện:
    ```bash
    npm i
    ```
3. Chạy chương trình:
    ```bash
    npm start
    ```

### Server
1. Truy cập vào thư mục `server`:
    ```bash
    cd server
    ```
2. Cài đặt thư viện:
    ```bash
    npm i
    ```
3. Chạy chương trình:
    ```bash
    npm start
    ```

---

## 4. Lưu Ý
- Đảm bảo bạn đã cài đặt Node.js và MySQL trước khi bắt đầu.
- Kiểm tra kết nối mạng để sử dụng các dịch vụ bên thứ ba như Cloudinary, Google Maps API, v.v.
- Nếu gặp lỗi, kiểm tra lại cấu hình file `.env` và `config.json`.

---

## 5. Hỗ Trợ
Nếu có bất kỳ thắc mắc hoặc lỗi nào trong quá trình cài đặt, vui lòng liên hệ qua email: **nvh01022003@gmail.com**


