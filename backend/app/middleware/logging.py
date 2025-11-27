from fastapi import Request
import time

async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = round(time.time() - start, 4)

    print(f"{request.method} {request.url} - {duration}s")
    return response
