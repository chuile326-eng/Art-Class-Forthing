# DrawPath AI — Backend Dockerfile (scaffolding)
# ---------------------------------------------------------------------------
# TRẠNG THÁI: file scaffolding tối thiểu, tạo ngày 2026-11-24 trong đợt viết
# tài liệu. CHƯA TỪNG BUILD THỬ (Docker không có trong VM viết tài liệu).
# Code backend thật đã tồn tại (app/main.py, routers, models...), nhưng
# Dockerfile này chưa được kiểm chứng là build được image chạy được.
# Sau lần build đầu tiên, cập nhật lại file này theo lỗi thật gặp phải.
# ---------------------------------------------------------------------------
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# curl: phục vụ healthcheck của docker-compose (GET /health).
# build-essential: dự phòng nếu có dependency cần biên dịch.
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . .

# Upload lưu trong container — compose mount volume `uploads` vào đây.
RUN mkdir -p /app/uploads

EXPOSE 8000

# Lưu ý: DATABASE_URL/SECRET_KEY... được truyền qua environment của compose
# hoặc file .env, KHÔNG hard-code trong image.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
