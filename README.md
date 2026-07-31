# 🦆 Game Đua Vịt & Admin Cấu Hình Kết Quả

Dự án Game Đua Vịt HTML5 tích hợp Trang Quản Trị Admin điều khiển kết quả đua theo ý muốn, sẵn sàng deploy lên Cloudflare Pages (`*.pages.dev`) hoặc máy chủ Node.js.

## 🚀 Tính năng chính:
- 🎮 **Game Đua Vịt HTML5**: Giao diện trắng sạch sẽ nguyên bản.
- 🔐 **Trang Admin Cấu Hình Kết Quả (`/admin/`)**: Đăng nhập Admin bảo mật để tùy chỉnh thứ tự vịt về đích.
- ⚡ **Local & Serverless API**: Tích hợp sẵn API điều khiển kết quả cho cả máy chủ Node.js cục bộ và Cloudflare Pages Functions.

## 🛠️ Chạy cục bộ (Local Server):
```bash
npm install
npm run serve
```
- Trang Game: http://localhost:3000/
- Trang Admin: http://localhost:3000/admin/

## ☁️ Deploy lên Cloudflare Pages:
Build sẵn tài nguyên:
```bash
node prepare-cloudflare.js
```
Upload thư mục `public/` và `functions/` lên Cloudflare Pages.
