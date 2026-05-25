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