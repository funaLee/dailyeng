# DailyEng – Nền tảng học tiếng Anh tự động hóa bằng AI

*(Đồ án môn học IE104 – Xây dựng Website)*


DailyEng là một nền tảng học tiếng Anh hiện đại, ứng dụng AI để hỗ trợ luyện từ vựng, luyện nói, luyện nghe – đọc – viết, hệ thống SRS ghi nhớ từ vựng, cùng lộ trình học cá nhân hóa.
Website được xây dựng với **Next.js 14**, **TypeScript**, **Tailwind CSS**, và **Zustand**, theo hướng **hiện đại – trực quan – hiệu suất cao**.

---

# 1. ✨ Tính năng chính

### 🟦 1. Vocabulary Hub

* Học từ theo chủ đề (Oxford)
* Hiển thị phát âm, nghĩa, collocations, ví dụ
* Tìm kiếm theo từ hoặc topic
* Luyện từ vựng: MCQ, gap-fill, dictation, translation
* Daily Review theo Spaced Repetition (SM-2)

### 🟧 2. Translate & Speak Lab

* Dịch Việt ↔ Anh theo ngữ cảnh
* Luyện nói theo tình huống
* Ghi âm và AI đánh giá phát âm
* Writing lab: chấm lỗi + gợi ý cải thiện

### 🟩 3. Listening & Reading

* Bài nghe với transcript, từ vựng kèm theo
* Bài đọc song ngữ + glossary
* Câu hỏi luyện tập sau mỗi bài

### 🟪 4. Quiz System

* Nhiều dạng bài tập:
  MCQ, điền từ, nối cặp, reorder, comprehension
* Hệ thống XP + streak + badges

### 🟥 5. Speaking Room

* Hội thoại role-play theo chủ đề
* Shadowing + ghi âm + AI chấm điểm
* Tạo tình huống hội thoại mới bằng AI

### 🟨 6. Spaced Repetition (SRS)

* Áp dụng thuật toán **SM-2 chuẩn SuperMemo**
* Chấm điểm 0–5
* Điều chỉnh Ease Factor, Interval tự động

### 🟫 7. Study Plan

* Cá nhân hóa theo mục tiêu + thời gian học
* Nhiệm vụ mỗi ngày
* Theo dõi tiến độ và gợi ý bài tiếp theo

### 🟦 8. Profile & Badges

* Radar kỹ năng
* Lịch sử học tập
* XP – streak – thành tựu

---

# 2. 🛠 Công nghệ sử dụng

### ⚙️ Framework & Ngôn ngữ

* **Next.js 15 (App Router)**
* **TypeScript**
* **React 18**

### 🎨 UI & Styling

* **Tailwind CSS v4**
* **shadcn/ui**
* **Lucide Icons**

### 📦 State & Logic

* **Zustand**
* **Zod** (validate schema)

### 🧪 Testing

* **Vitest**
* **MSW** (Mock API)

---

# 3. 🚀 Bắt đầu dự án

## Yêu cầu

* Node.js 18+
* npm hoặc yarn

## Cài đặt

```bash
# Clone repository
git clone <repository-url>
cd english-learning-app

# Cài dependencies
npm install

# Chạy ở chế độ dev
npm run dev
```

Mở trình duyệt tại **[http://localhost:3000](http://localhost:3000)**

---

# 4. 📁 Cấu trúc thư mục

```
├── app/                    # App Router
│   ├── layout.tsx         
│   ├── page.tsx           
│   ├── vocab/             
│   ├── speaking/          
│   ├── notebook/          
│   ├── plan/              
│   ├── profile/           
│   └── auth/              
├── components/            
│   ├── layout/            
│   ├── vocab/             
│   ├── speaking/          
│   ├── flashcard/         
│   ├── profile/           
│   └── ui/                
├── lib/                   
│   ├── api.ts             
│   ├── store.ts           
│   ├── srs.ts             
│   ├── auth.ts            
│   └── mock-data.ts       
├── types/                
├── mocks/                
└── public/               
```

---

# 5. 🌐 API mock (MSW)

Tất cả API được mô phỏng trong môi trường dev.

### Bật MSW (mặc định)

`mocks/browser.ts`

### Tắt MSW (production)

Xóa đoạn sau trong `layout.tsx`:

```tsx
if (typeof window !== "undefined") {
  import("@/mocks/browser").then(({ worker }) => {
    worker.start()
  })
}
```

---

# 6. 🧩 Danh sách API

### 📌 Topics

* `GET /api/topics`
* `GET /api/topics/:id`
* `POST /api/topics`

### 📌 Vocabulary

* `GET /api/vocab?topicId=:id`

### 📌 Quizzes

* `GET /api/quizzes?topicId=:id`
* `POST /api/quizzes/submit`

### 📌 Speaking

* `GET /api/speaking/library`
* `POST /api/ai/create-topic`
* `POST /api/speaking/submit-turn`

### 📌 Flashcards

* `GET /api/flashcards`
* `POST /api/flashcards`

### 📌 SRS

* `GET /api/srs/queue`
* `POST /api/srs/review`

### 📌 AI Services

* `POST /api/ai/translate`
* `POST /api/ai/feedback`

---

# 7. 🔐 Authentication

Hệ thống đang dùng **auth giả lập** với localStorage.
Tài khoản mẫu:

* Email: `demo@example.com`
* Password: `password`

Để tích hợp Auth thật → thay thế `lib/auth.ts`.

---

# 8. 🧠 Thuật toán Spaced Repetition (SM-2)

* Điểm chất lượng: **0–5**
* Tính toán:

  * Ease Factor
  * Interval
  * Repetition count
* Nếu điểm < 3 → reset vòng lặp
* Được triển khai tại: `lib/srs.ts`

---

# 9. 🧪 Testing

```bash
npm run test
npm run test:watch
npm run test:ui
npm run test:coverage
```

Các file test chính:

* `lib/srs.test.ts`
* `types/index.test.ts`

---

# 10. 🎨 Styling & tokens

File: `app/globals.css`

```css
@theme inline {
  --color-primary: #3b82f6;
  --color-secondary: #f3f4f6;
}
```

---

# 11. ⚡ Tối ưu hiệu năng

* Tối ưu hình ảnh với Next.js
* Dynamic imports
* React memo
* Virtualized list
* Lưu cache LocalStorage

---

# 12. ♿ Accessibility

* HTML ngữ nghĩa
* ARIA labels
* Hỗ trợ bàn phím
* Quản lý focus
* Contrast đạt chuẩn WCAG

---

# 13. 🌍 Hỗ trợ trình duyệt

* Chrome / Edge 90+
* Firefox 88+
* Safari 14+
* Mobile browsers

---

# 14. 🤝 Quy trình đóng góp

1. Fork repo
2. Tạo nhánh mới
3. Commit
4. Push
5. Tạo Pull Request

---

# 15. 🗺 Roadmap

* [ ] Kết nối API thật
* [ ] OAuth (Google, GitHub)
* [ ] Ứng dụng di động (React Native)
* [ ] Offline mode
* [ ] Dashboard nâng cao
* [ ] Leaderboard + Challenges
* [ ] AI tạo bài học tự động
* [ ] Hỗ trợ đa ngôn ngữ

---

# 16. 📜 Giấy phép

MIT License – xem file LICENSE.

---

# 17. ❤️ Lời kết

DailyEng được xây dựng với mục tiêu mang đến trải nghiệm học tiếng Anh hiệu quả, sinh động và cá nhân hóa — giúp người học tự tin hơn trong giao tiếp và sử dụng tiếng Anh hằng ngày.
