# 🚀 Hướng Dẫn Nhanh - Data Structure

## 🗂️ Cấu Trúc Files Quan Trọng

### 1. **Database Schema**
📁 `prisma/schema.prisma`
- Định nghĩa toàn bộ database structure
- 30+ models (User, Topic, VocabItem, SpeakingScenario, Quiz, etc.)
- Relationships và indexes đã được tối ưu

### 2. **Migration Files**
📁 `prisma/migrations/`
- `20251122182432_init/migration.sql` - Initial database setup
- `migration_lock.toml` - Lock file cho PostgreSQL

### 3. **Seed Scripts**
📁 `prisma/`
- `seed.ts` - Seed cơ bản (topics, vocab, grammar, quiz, badges)
- `seed-speaking.ts` - 24 speaking scenarios đầy đủ
- `seed-sessions.ts` - Demo user + sample speaking sessions

### 4. **Prisma Client Singleton**
📁 `lib/prisma.ts`
- Tạo một instance duy nhất của PrismaClient
- Tránh tạo quá nhiều database connections trong development
- **Được sử dụng trong tất cả API routes** để query database
- Import: `import { prisma } from '@/lib/prisma'`

---

## 🎯 Data Đã Tạo

### ✅ Topics (3)
- Travel (A2) - 5 từ vựng
- Food & Dining (A2) - 3 từ vựng  
- Job Interview (B1) - 5 từ vựng

### ✅ Speaking Scenarios (24)
Chia theo 6 categories:
- **Daily Life** (4): Café, Shopping, Doctor, Taxi
- **Professional** (4): Meeting, Presentation, Interview, Negotiation
- **Academic** (4): Class Questions, Group Discussion, Research, Thesis
- **Business** (4): Sales, Marketing, Budget, Team Building
- **Travel** (4): Hotel, Airport, Tickets, Lost Luggage
- **Social** (4): Party, Weather Chat, Introductions, First Date

### ✅ Other Data
- 5 Flashcard Collections
- 5 Badges
- 1 Grammar Note
- 3 Quiz Items
- 1 Demo User với sample sessions

---

## 🔗 Xem Data Trên Supabase

### Cách 1: Supabase Dashboard (Recommended)
1. Truy cập: https://supabase.com/dashboard
2. Login vào project
3. Chọn project: `grjzaglfknshmbibgeii`
4. Vào **Table Editor** ở sidebar
5. Xem các tables: `topics`, `vocab_items`, `speaking_scenarios`, etc.

### Cách 2: Prisma Studio (Local)
```bash
npx prisma studio
```
- Mở browser: http://localhost:5555
- Browse và edit data trực tiếp

### Cách 3: SQL Editor (Advanced)
Vào **SQL Editor** trong Supabase Dashboard, chạy queries:
```sql
-- Xem tất cả topics
SELECT * FROM topics;

-- Xem speaking scenarios theo category
SELECT category, COUNT(*) as count 
FROM speaking_scenarios 
GROUP BY category;

-- Xem vocab items với topic
SELECT v.word, t.title as topic 
FROM vocab_items v 
JOIN topics t ON v."topicId" = t.id;
```

---

## 🛠️ Commands Hữu Ích

### Chạy Seed Scripts
```bash
# Seed cơ bản
npx tsx prisma/seed.ts

# Seed 24 speaking scenarios
npx tsx prisma/seed-speaking.ts

# Seed demo sessions
npx tsx prisma/seed-sessions.ts
```

### Database Operations
```bash
# Generate Prisma Client
npx prisma generate

# Push schema changes
npx prisma db push

# Create migration
npx prisma migrate dev --name your_migration_name

# Reset database (⚠️ XÓA HẾT DATA)
npx prisma migrate reset
```

---

## 📊 Database Connection Info

**Direct Connection** (cho migrations):
```
postgresql://postgres:maitrucquan@db.grjzaglfknshmbibgeii.supabase.co:5432/postgres
```

**Pooler Connection** (cho production):
```
postgresql://postgres.grjzaglfknshmbibgeii:maitrucquan@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

> ⚠️ **Lưu ý**: Credentials này đã có trong file `.env`

---

## 🔍 API Routes Đã Tạo

### Vocabulary
- `GET /api/vocab` - Lấy vocab items
- `GET /api/vocab?topicId=xxx` - Lấy vocab theo topic

### Speaking
- `GET /api/speaking/scenarios` - Lấy tất cả scenarios
- `GET /api/speaking/sessions` - Lấy sessions của user
- `GET /api/speaking/sessions/[id]` - Chi tiết session
- `POST /api/speaking/sessions` - Tạo session mới
- `POST /api/speaking/turns` - Thêm turn vào session

### Test
- `GET /api/test` - Test database connection

---

## 📚 Tài Liệu Khác

Xem thêm trong folder `_docs/`:
- `DATABASE_ERD.md` - Entity Relationship Diagram
- `API_DOCUMENTATION.md` - API endpoints chi tiết
- `SEED_DATA_GUIDE.md` - Hướng dẫn seed data đầy đủ
- `SETUP_GUIDE.md` - Setup project từ đầu

---

## 💡 Tips

1. **Xem data nhanh**: Dùntudio (`npx prisma studio`)
2. **Test API**: Dùng file `app/api/test/route.ts`
3. **Thêm data**: Tạo seed script mới hoặc dùng Prisma Studio
4. **Backup**: Export data từ Supabase Dashboard

---

## 🆘 Troubleshooting

### Lỗi connection
- Check `.env` file có đúng DATABASE_URL
- Thử đổi sang pooler connection
- Check Supabase project có active không

### Lỗi Prisma Client
```bash
npx prisma generate
```

### Data không hiện
- Check đã chạy seed scripts chưa
- Verify trong Prisma Studio hoặc Supabase Dashboard

---

**Last Updated**: 24/11/2024  
