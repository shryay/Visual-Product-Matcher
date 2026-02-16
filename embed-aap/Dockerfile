FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .
COPY .env .

EXPOSE 8081

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8081", "app:app"]
