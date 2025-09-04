# Use an official TF image with CPU runtime
FROM tensorflow/tensorflow:2.11.0

WORKDIR /app

# Copy server code
COPY server/ /app/

# Install python deps (excluding tensorflow since image has it)
RUN pip install --no-cache-dir -r requirements.txt

# Expose port
ENV PORT 8080
EXPOSE 8080

# Run with gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "app:app", "--workers", "1", "--threads", "4"]
