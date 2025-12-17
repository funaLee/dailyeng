# 🚀 DailyEng – Nền tảng học tiếng Anh cá nhân hóa với AI

**DailyEng** là một ứng dụng Web hiện đại hỗ trợ học tiếng Anh toàn diện, ứng dụng trí tuệ nhân tạo (AI) để tối ưu hóa việc luyện nói, ghi nhớ từ vựng và xây dựng lộ trình học tập riêng biệt cho từng người dùng.

Dự án được xây dựng với mục tiêu mang lại trải nghiệm học tập trực quan, hiệu suất cao và có tính ứng dụng thực tế cao.

## ✨ Tính năng nổi bật

Dựa trên việc kiểm tra mã nguồn thực tế và lược đồ cơ sở dữ liệu mới nhất trong các tệp tin bạn đã cung cấp, tôi xin xác nhận lại các tính năng chính xác của hệ thống như sau:

### 1. 🧠 Hệ thống ghi nhớ thông minh (SRS)

* **Thuật toán SM-2 chuẩn hóa**: Triển khai thuật toán SuperMemo-2 tại `src/lib/srs.ts` để tối ưu hóa khoảng cách ôn tập.
* **Chỉ số thông minh**: Tự động tính toán **Ease Factor** (mặc định 2.5), **Interval** và số lần lặp lại (**repetitions**).
* **Quản lý Notebook**: Lưu trữ từ vựng vào `NotebookItem` với trạng thái `isStarred` và theo dõi `masteryLevel` từ 0 đến 100.
* **Lịch trình ôn tập**: Tự động nhắc nhở thông qua trường `nextReviewDate` trong Model `Flashcard` và `nextReview` trong `NotebookItem`.

### 2. 🗣️ Speaking Room & AI Lab

* **Hội thoại Role-play**: Hỗ trợ các kịch bản thực tế với định nghĩa vai người dùng (`userRole`) và vai của Bot (`botRole`).
* **Phân tích AI chi tiết**: Chấm điểm lượt nói qua 4 tiêu chí: **Pronunciation** (phát âm), **Fluency** (độ lưu loát), **Grammar** (ngữ pháp) và **Intonation** (ngữ điệu).
* **Phân tích lỗi sai**: Model `SpeakingTurnError` lưu trữ chi tiết từ bị sai, loại lỗi (Grammar, Vocabulary, Preposition...) và gợi ý phiên bản sửa lỗi chính xác.
* **Shadowing & Metrics**: Theo dõi tốc độ nói (WPM), số lần dừng nghỉ (`pauseCount`) và cao độ giọng nói (`pitchVariance`) để đánh giá độ tự nhiên.

### 3. 📚 Vocabulary Hub (Focus: Learning & Translation)

* **Học từ vựng chuyên sâu**: Cung cấp phiên âm chuẩn (`phonBr`, `phonNAm`), nghĩa chi tiết, loại từ và các ví dụ ngữ cảnh có dịch thuật.
* **Luyện dịch & Mindmap**:
* **Translate Lab**: Tích hợp tại `src/components/vocab/translate-speak-lab.tsx` để luyện dịch thuật Anh-Việt theo ngữ cảnh.
* **Sơ đồ tư duy**: Hiển thị mối liên hệ từ vựng qua collocations, từ đồng nghĩa và trái nghĩa.


* **Hình thức luyện tập**: Tập trung vào trắc nghiệm (`multiple_choice`), điền vào chỗ trống (`fill_blank`) và nối từ (`matching`).

### 4. 📅 Study Plan & Gamification

* **Lộ trình cá nhân hóa**: Xây dựng dựa trên mục tiêu (`StudyGoal`), trình độ hiện tại (`Level`) và thời gian cam kết mỗi ngày.
* **Hệ thống Daily Missions**: Theo dõi tiến độ nhiệm vụ hàng ngày (như học bao nhiêu từ, luyện nói bao nhiêu phút) qua Model `UserDailyMission`.
* **Cơ chế Gamification**:
* **XP & Streak**: Tích lũy điểm kinh nghiệm và duy trì chuỗi ngày học để thăng hạng.
* **Leaderboard**: Bảng xếp hạng người dùng theo tuần/tháng.
* **Badges & Coins**: Nhận huy hiệu thành tựu và tích lũy tiền ảo (`coins`) để sử dụng trong hệ thống.



### 5. 📊 Hồ sơ & Theo dõi tiến độ

* **Radar kỹ năng**: Biểu đồ hình nhện hiển thị điểm số của 5 kỹ năng: Vocab, Grammar, Speaking, Listening và Writing.
* **Study Heatmap**: Theo dõi hoạt động học tập chi tiết hàng ngày qua `UserActivity`, bao gồm số phút đã học và số từ đã thuộc.
* **Thông báo thông minh**: Hệ thống gửi thông báo về lịch học (`plan`), thành tựu (`achievement`) và nhắc nhở ôn tập từ vựng.


## 🛠 Công nghệ sử dụng

### Frontend & Core

* **Framework:** Next.js 15 (App Router)
* **Ngôn ngữ:** TypeScript
* **State Management:** Zustand
* **Validation:** Zod

### UI & UX

* **Styling:** Tailwind CSS v4
* **Components:** shadcn/ui, Radix UI, Framer Motion (Animation)
* **Icons:** Lucide React

### Backend & Database

* **ORM:** Prisma
* **Database:** PostgreSQL (hỗ trợ bởi Supabase hoặc tương đương)
* **Auth:** NextAuth.js v5 (hỗ trợ Credentials & OAuth)
* **AI Integration:** Google Generative AI (Gemini SDK)

### Testing & Tools

* **Testing:** Vitest, MSW (Mock Service Worker)
* **Storage:** Cloudinary (Quản lý hình ảnh/âm thanh)

---

## 📂 Cấu trúc thư mục chính

```text
├── src/
│   ├── app/              # Routes & Pages (Next.js App Router)
│   ├── components/       # UI Components (layout, ui, speaking, vocab...)
│   ├── actions/          # Server Actions (auth, speaking, vocab, user...)
│   ├── lib/              # Logic cốt lõi (srs.ts, gemini.ts, prisma.ts...)
│   ├── hooks/            # Custom React hooks
│   ├── contexts/         # React Context API providers
│   ├── types/            # TypeScript interfaces & enums
│   └── mocks/            # MSW handlers cho môi trường development
├── prisma/               # Schema định nghĩa DB & file Seed dữ liệu
└── public/               # Tài sản tĩnh (images, logos...)

```

---

## 🚀 Cài đặt dự án

### Yêu cầu hệ thống

* **Node.js:** 18.0.0 trở lên
* **Database:** Một instance PostgreSQL (Local hoặc Cloud)

### Các bước thực hiện

1. **Clone dự án:**
```bash
git clone <repository-url>
cd dailyeng

```


2. **Cài đặt thư viện:**
```bash
npm install

```


3. **Cấu hình môi trường:**
Tạo file `.env` và thêm các biến sau:
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
GEMINI_API_KEY="..."
CLOUDINARY_URL="..."

```


4. **Khởi tạo Database & Seed dữ liệu:**
```bash
npx prisma db push
npm run seed:vocab

```


5. **Chạy ứng dụng:**
```bash
npm run dev

```


Truy cập tại: `http://localhost:3000`

---

## 🧠 Sơ đồ Cơ sở dữ liệu (Prisma)

Hệ thống quản lý dữ liệu chặt chẽ qua các Model chính:

* **User & ProfileStats:** Quản lý thông tin người dùng và chỉ số kỹ năng (Radar chart).
* **Topic & VocabItem:** Cấu trúc bài học và từ vựng chuyên sâu.
* **SpeakingSession & SpeakingTurn:** Lưu trữ lịch sử hội thoại và kết quả phân tích AI.
* **NotebookItem & Flashcard:** Quản lý dữ liệu học tập cá nhân và lộ trình SRS.
* **StudyPlan & Task:** Theo dõi lịch trình học tập hằng ngày.

---

## 🧪 Kiểm thử

Dự án sử dụng **Vitest** để đảm bảo tính ổn định của các thuật toán (đặc biệt là SRS) và Logic Type.

```bash
npm run test          # Chạy test
npm run test:ui       # Giao diện trực quan cho test
npm run test:coverage # Kiểm tra độ bao phủ mã nguồn

```

---

## 📜 Giấy phép

Dự án được phát hành dưới giấy phép **MIT**.

---

*DailyEng – Learn English Smarter, Every Day!* ❤️