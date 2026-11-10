# Urban GreenEye AI – Vercel Edition

Đây là bản chuyển giao giao diện Streamlit sang Next.js cho Vercel, dựa trên mã nguồn `app.py` người dùng đã gửi (Urban GreenEye AI: báo cáo ảnh, Cloudflare Vision, Supabase, bản đồ, chat, đội dọn dẹp, hoàn thành, bảng xếp hạng, phản ánh, kiểm duyệt và quản trị).

## 1. Công nghệ
- Next.js 15 + React 19 + TypeScript
- Supabase Postgres + Storage
- Cloudflare Workers AI (`@cf/meta/llama-3.2-11b-vision-instruct`)
- Leaflet / OpenStreetMap / Esri
- Vercel Functions

## 2. Cấu hình Supabase
Bản chuyển đổi giữ các bảng và cột hiện có:
- `reports`: `id`, `reporter_name`, `image_path`, `description`, `location`, `latitude`, `longitude`, `status`, `ai_result`, `ai_raw_json`, `ai_analyzed`, `ai_error`, `assigned_team`, `cleanup_image_path`, `cleanup_note`, `cleaned_at`, `created_at`
- `user_points`: `name`, `points`
- `team_points`: `name`, `points`
- Storage bucket: `urban-greeneye`

Nếu bảng `feedbacks` chưa tồn tại, chạy file `supabase/feedbacks.sql` trong Supabase SQL Editor.

**Không chạy lại schema cũ nếu các bảng đã tồn tại.** File SQL ở trên chỉ tạo bảng feedbacks còn thiếu.

## 3. Biến môi trường Vercel
Vào Vercel → Project → Settings → Environment Variables và khai báo theo `.env.example`:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only; không dùng tiền tố `NEXT_PUBLIC_`)
- `SUPABASE_BUCKET` (mặc định `urban-greeneye`)
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_AUTH_TOKEN`
- `CLOUDFLARE_MODEL` (có thể để mặc định)
- `ADMIN_PIN`, `TEAM_PIN`, `STAFF_PIN`
- `SESSION_SECRET` (chuỗi ngẫu nhiên dài tối thiểu 32 ký tự)

Để hiển thị ảnh ở client, đặt thêm:
- `NEXT_PUBLIC_SUPABASE_URL` = cùng giá trị `SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_BUCKET` = `urban-greeneye`

Hai biến NEXT_PUBLIC trên chỉ là URL/tên bucket công khai, tuyệt đối không đưa key bí mật vào NEXT_PUBLIC.

**Bảo mật:** Không commit `.env`, không gửi service-role key trong chat, không để key trong file frontend. Thay PIN mặc định cũ `1234` bằng PIN mới, khó đoán.

## 4. Chạy thử
```bash
npm install
npm run dev
```
Mở http://localhost:3000.

## 5. Deploy Vercel
1. Tải ZIP và giải nén.
2. Đưa các file trong thư mục dự án lên một repository GitHub mới hoặc thư mục dự án hiện tại (không chép `.env`).
3. Vercel → Add New → Project → Import repository.
4. Framework preset: Next.js; Root Directory là thư mục có `package.json`.
5. Thêm Environment Variables như mục 3.
6. Deploy.

## 6. Lưu ý chức năng / giới hạn phiên bản đầu
- Gửi báo cáo: upload ảnh vào Supabase Storage, ghi hàng `reports`, gọi Cloudflare Vision và cập nhật trạng thái.
- Trạng thái AI: `Đã duyệt`, `Cần xem lại`, `Spam/Từ chối`, `Lỗi AI`.
- Chat AI dùng cùng Cloudflare endpoint và prompt an toàn rút gọn theo phạm vi trợ lý Mắt Xanh.
- Đội dọn dẹp: đăng nhập PIN, nhận nhiệm vụ `Đã duyệt`, gửi ảnh sau dọn và chuyển `Đã dọn`.
- Bảng xếp hạng: tính từ bảng `reports` theo quy tắc 5 điểm/báo cáo hợp lệ, 10 điểm/nhiệm vụ hoàn thành.
- Bản đồ: hiển thị báo cáo có latitude/longitude; sử dụng OpenStreetMap và Esri.
- Phản ánh: cần bảng `feedbacks` (SQL bổ sung ở trên).
- Quản trị/kiểm duyệt: được bảo vệ bằng PIN và cookie ký HMAC server-side.

Một số tác vụ nền trong Streamlit (tự quét báo cáo pending và tự retry nền, dọn Spam tự động sau 7 ngày, phần xem/xử lý feedback đầy đủ, xác nhận model "agree") chưa được chuyển thành lịch chạy nền trong bản đầu này. Không coi trạng thái AI đang xử lý là đã hoàn tất nếu Cloudflare/Vercel timeout. Có thể bổ sung Vercel Cron sau khi triển khai và xác nhận môi trường chạy ổn.

## 7. Không làm mất dữ liệu
Bản này kết nối vào Supabase hiện có, không tạo database mới và không reset bảng. Không chạy nút Reset trừ khi bạn thực sự muốn xóa dữ liệu.
