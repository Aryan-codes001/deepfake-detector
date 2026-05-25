import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"

import { vscDarkPlus }
from "react-syntax-highlighter/dist/esm/styles/prism"
import { useState } from "react"
import { motion } from "framer-motion"

export default function Code(){

const files={

"train.py":`
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import Xception
from tensorflow.keras.layers import GlobalAveragePooling2D,Dense,Dropout,BatchNormalization
from tensorflow.keras.models import Model
from tensorflow.keras.callbacks import ModelCheckpoint,EarlyStopping,ReduceLROnPlateau
from tensorflow.keras.optimizers import Adam

# GPU setup
gpus=tf.config.experimental.list_physical_devices('GPU')

if gpus:
    for gpu in gpus:
        tf.config.experimental.set_memory_growth(gpu,True)
    print("GPU Enabled")
else:
    print("GPU Not Found")

# Config
IMG_SIZE=224
BATCH_SIZE=32
EPOCHS=20

# Data augmentation
train_gen=ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    zoom_range=0.2,
    horizontal_flip=True,
    brightness_range=[0.8,1.2],
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    validation_split=0.2
)

# Training data
train_data=train_gen.flow_from_directory(
    "dataset/train",
    target_size=(IMG_SIZE,IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='binary',
    subset='training',
    shuffle=True
)

# Validation data
val_data=train_gen.flow_from_directory(
    "dataset/train",
    target_size=(IMG_SIZE,IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='binary',
    subset='validation',
    shuffle=False
)

# Xception model
base_model=Xception(
    weights='imagenet',
    include_top=False,
    input_shape=(224,224,3)
)

base_model.trainable=False

# Custom layers
x=GlobalAveragePooling2D()(base_model.output)
x=BatchNormalization()(x)

x=Dense(512,activation='relu')(x)
x=Dropout(0.5)(x)

x=Dense(256,activation='relu')(x)
x=Dropout(0.3)(x)

output=Dense(1,activation='sigmoid')(x)

model=Model(
    inputs=base_model.input,
    outputs=output
)

# Compile
model.compile(
    optimizer=Adam(learning_rate=0.0001),
    loss='binary_crossentropy',
    metrics=['accuracy']
)

# Callbacks
checkpoint=ModelCheckpoint(
    "models/best_model.keras",
    monitor='val_accuracy',
    save_best_only=True
)

early_stop=EarlyStopping(
    monitor='val_loss',
    patience=5,
    restore_best_weights=True
)

reduce_lr=ReduceLROnPlateau(
    monitor='val_loss',
    factor=0.2,
    patience=2
)

# Initial training
print("Training Started...")

model.fit(
    train_data,
    validation_data=val_data,
    epochs=EPOCHS,
    callbacks=[
        checkpoint,
        early_stop,
        reduce_lr
    ]
)

# Fine tuning
print("Fine Tuning Started...")

base_model.trainable=True

for layer in base_model.layers[:-20]:
    layer.trainable=False

model.compile(
    optimizer=Adam(learning_rate=0.00001),
    loss='binary_crossentropy',
    metrics=['accuracy']
)

model.fit(
    train_data,
    validation_data=val_data,
    epochs=10,
    callbacks=[
        checkpoint,
        early_stop,
        reduce_lr
    ]
)

# Save final model
model.save("models/deepfake_model.keras")

print("Training Complete")
`,

"preprocess.py":`
import cv2
import os
base = r"D:\dataset\FaceForensics++_C23"
real_folder = os.path.join(base,"original")
fake_folders = [
    "Deepfakes",
    "Face2Face",
    "FaceSwap",
    "FaceShifter",
    "NeuralTextures"
]
save_real="dataset/train/real"
save_fake="dataset/train/fake"
os.makedirs(save_real,exist_ok=True)
os.makedirs(save_fake,exist_ok=True)
def extract(video_folder,save_path,prefix,start_count=0):
    count=start_count
    for root,dirs,files in os.walk(video_folder):
        for file in files:
            if file.endswith(".mp4"):
                path=os.path.join(root,file)
                print("Processing:",path)
                cap=cv2.VideoCapture(path)
                frame_no=0
                while True:
                    ret,frame=cap.read()
                    if not ret:
                        break
                    # take every 30th frame
                    if frame_no % 30 == 0:
                        frame=cv2.resize(
                            frame,
                            (224,224)
                        )
                        cv2.imwrite(
                            os.path.join(
                                save_path,
                                f"{prefix}_{count}.jpg"
                            ),
                            frame
                        )
                        count+=1
                    frame_no+=1
                cap.release()
    return count

print("\nExtracting REAL...")
extract(
    real_folder,
    save_real,
    "real"
)
count=0
for folder in fake_folders:
    print(f"\nExtracting {folder}...")
    path=os.path.join(
        base,
        folder
    )
    count=extract(
        path,
        save_fake,
        "fake",
        count
    )

print("\nDONE")
print(
    "Real images:",
    len(os.listdir(save_real))
)
print(
    "Fake images:",
    len(os.listdir(save_fake))
)
`,
"predict.py":`
import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
print("Loading model...")
model=tf.keras.models.load_model(
    r"D:\Deepfake\models\best_model.keras"
)
print("Model Loaded")
IMG_SIZE=224
def predict_image(img_path):
    print("Opening:",img_path)
    img=image.load_img(
        img_path,
        target_size=(IMG_SIZE,IMG_SIZE)
    )
    img=image.img_to_array(img)
    img=img/255.0
    img=np.expand_dims(
        img,
        axis=0
    )
    print("Predicting...")
    pred=model.predict(
        img,
        verbose=0
    )[0][0]
    print("Raw prediction:",pred)
    if pred>0.5:
        result="REAL"
        confidence=float(
            pred*100
        )
    else:
        result="FAKE"
        confidence=float(
            (1-pred)*100
        )
    return{
        "prediction":result,
        "confidence":
        round(
            confidence,
            2
        )
    }
`,

"main.py":`from fastapi import FastAPI,File,UploadFile
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
`,

"best_model.keras":`
Xception Transfer Learning Model

Model Type:
Binary Classification

Classes:
REAL
FAKE

Training Images:
395,000+

Validation Accuracy:
93.6%

Input Size:
224 x 224

Saved Best Weights:
EarlyStopping + ModelCheckpoint

Output:
Prediction + Confidence Score
`,

"dataset":`
dataset/

├── train/
│   ├── real/
│   │   220000+ images
│   │
│   └── fake/
│       175000+ images

Sources:

• FaceForensics++
• Celeb-DF
• DFDC

Image Size:
224 x 224

Classes:
REAL
FAKE
`,

"requirements.txt":`
# CREATE VIRTUAL ENVIRONMENT (Windows)

python -m venv venv


# Activate Virtual Environment

venv\Scripts\activate


# INSTALL PYTHON LIBRARIES

pip install tensorflow==2.10.1

pip install numpy==1.23.5

pip install opencv-python==4.8.1.78

pip install fastapi==0.115.0

pip install uvicorn==0.30.6

pip install python-multipart==0.0.9

pip install pillow==10.4.0

pip install scikit-learn==1.5.1

pip install matplotlib==3.9.2

pip install pandas==2.2.2



# ==================================
# INSTALL FRONTEND LIBRARIES
# ==================================

npm install react

npm install framer-motion

npm install lucide-react

npm install react-router-dom

npm install react-syntax-highlighter



# ==================================
# LIBRARY USES
# ==================================

tensorflow
→ Deep Learning + Xception Model

numpy
→ Numerical Operations

opencv-python
→ Image Processing

fastapi
→ Backend API

uvicorn
→ Run FastAPI Server

python-multipart
→ Upload Image Support

pillow
→ Image Loading

scikit-learn
→ ML Utilities

matplotlib
→ Training Graphs

pandas
→ Dataset Handling

react
→ Frontend UI

framer-motion
→ Animations

lucide-react
→ Icons

react-router-dom
→ Multi Page Routing

react-syntax-highlighter
→ VS Code Style Code Viewer



# RUN PROJECT

Backend:

uvicorn main:app --reload


Frontend:

npm run dev
`
}
const [selected,setSelected] = useState("train.py")

return(

<div className="min-h-screen bg-black text-white p-10">

<h1 className="text-6xl font-bold text-purple-500 mb-10">
Project Code Structure
</h1>

<div className="grid md:grid-cols-3 gap-8">


<div className="
bg-slate-950
border
border-purple-500
rounded-3xl
p-8">

<h1 className="text-2xl font-bold mb-6">
Project Structure
</h1>

{Object.keys(files).map((file)=>(

<div
key={file}

onClick={()=>setSelected(file)}

className={`

p-4
mb-3
cursor-pointer
rounded-xl
transition

${selected===file
?
"bg-purple-600"
:
"bg-slate-900 hover:bg-slate-800"}

`}
>

📄 {file}

</div>

))}

</div>



<motion.div

key={selected}

initial={{opacity:0,x:50}}
animate={{opacity:1,x:0}}

className="
md:col-span-2
bg-slate-950
border
border-purple-500
rounded-3xl
p-8
"

>

<h1 className="
text-3xl
font-bold
text-purple-500
mb-6
">

{selected}

</h1>

<div className="
bg-[#1e1e1e]
rounded-2xl
overflow-hidden
border
border-gray-700
shadow-[0_0_30px_rgba(0,0,0,.5)]
">

<div className="
bg-[#2d2d30]
px-5
py-3
flex
items-center
gap-2
border-b
border-gray-700
">

<div className="w-3 h-3 rounded-full bg-red-500"></div>
<div className="w-3 h-3 rounded-full bg-yellow-500"></div>
<div className="w-3 h-3 rounded-full bg-green-500"></div>

<p className="ml-4 text-gray-300">
{selected}
</p>

</div>


<SyntaxHighlighter
language={
selected.endsWith(".py")
? "python"
: "jsx"
}

style={vscDarkPlus}

customStyle={{
borderRadius:"20px",
padding:"30px",
background:"#1e1e1e"
}}

showLineNumbers={true}
>

{files[selected]}

</SyntaxHighlighter>

</div>

</motion.div>

</div>

</div>

)

}