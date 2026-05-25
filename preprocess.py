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