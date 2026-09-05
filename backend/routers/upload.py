import os
import shutil
from fastapi import APIRouter, File, UploadFile

router = APIRouter(prefix="/api/v1", tags=["File Management"])

@router.post("/uploadfile/")
async def upload_file(file: UploadFile | None = None):
    if not file:
        return {"message": "No upload file provided"}
    else:
        data_dir = "../data"
        os.makedirs(data_dir, exist_ok=True)
        file_path = os.path.join(data_dir, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return {"filename": file.filename, "saved_path": file_path}