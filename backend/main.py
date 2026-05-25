from fastapi import FastAPI,File,UploadFile
from fastapi.middleware.cors import CORSMiddleware
from predict import predict_image
import shutil
import os

app=FastAPI()
os.makedirs(
    "uploads",
    exist_ok=True
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)
@app.get("/")
def home():
    return{
        "status":"API Running"
    }

@app.post("/predict")
async def predict(
    file:UploadFile=File(...)
):
    print("File received:",file.filename)
    path=os.path.join(
        "uploads",
        file.filename
    )
    with open(
        path,
        "wb"
    ) as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )
    print("Saved:",path)
    result=predict_image(path)
    print("Result:",result)
    return result