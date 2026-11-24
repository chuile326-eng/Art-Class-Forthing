# DrawPath AI — Frontend Dockerfile (scaffolding)
# ---------------------------------------------------------------------------
# TRẠNG THÁI: file scaffolding tối thiểu, tạo ngày 2026-11-24 trong đợt viết
# tài liệu. CHƯA TỪNG BUILD THỬ (Docker không có trong VM viết tài liệu).
# Code frontend thật đã tồn tại (Next.js 14, src/app...), nhưng Dockerfile
# này chưa được kiểm chứng là build được image chạy được.
# Multi-stage: deps -> builder -> runner (image cuối chỉ chứa bản build).
# Sau lần build đầu tiên, cập nhật lại file này theo lỗi thật gặp phải.
#
# LƯU Ý về NEXT_PUBLIC_API_URL: biến NEXT_PUBLIC_* được nhúng vào bản build
# lúc build-time. Nếu đổi API URL sau khi build, phải build lại image.
# Xem thêm lưu ý lệch tiền tố /api/v1 trong API.md §3.1.
# ---------------------------------------------------------------------------

# ---- Stage 1: cài dependency ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

# ---- Stage 2: build ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Biến public nhúng vào bản build (có giá trị mặc định nếu không truyền).
ARG NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
ARG NEXT_PUBLIC_APP_NAME=DrawPath AI
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME
RUN npm run build

# ---- Stage 3: chạy production ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000 \
    HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
