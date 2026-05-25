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