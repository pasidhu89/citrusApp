
from ultralytics import YOLO
from PIL import Image
import cv2
import sys
import logging
import os
import requests

logging.basicConfig(filename='python_script.log', level=logging.DEBUG)

script_dir = os.path.dirname(os.path.abspath(__file__)
model_path = os.path.join(script_dir, '..', 'ml_models', 'insects_model.pt')

# Log a message when the script starts
logging.info("Python script started")

if len(sys.argv) != 3:
    print("Please provide both the image path and the case_id as command-line arguments.")
    sys.exit(1)
    
    # Get the image path from the command-line argument
image_paths = sys.argv[1].split(',')  # Split the comma-separated image paths
case_id = sys.argv[2]


output_urls = []
output_labels = {}

for image_path in image_paths:
    # Input file path
    filepath = os.path.join(script_dir, '..', 'public', 'uploads', image_path)
    # Output file path (use case_id and a unique identifier for each image)
    output_path = os.path.join(script_dir, '..', 'public', 'outputs', f'{case_id}_{image_path}_output.png')

    model = YOLO(model_path)
    image = cv2.imread(filepath)
    results = model.predict(image)
    result = results[0]

    for box in result.boxes:
        class_id = result.names[box.cls[0].item()]
        cords = box.xyxy[0].tolist()
        cords = [round(x) for x in cords]
        conf = round(box.conf[0].item(), 2)

        output_labels[image_path] = class_id

        # Change your logging statements like this
        logging.info(f"Object type: {class_id}")
        logging.info(f"Coordinates: {cords}")
        logging.info(f"Probability: {conf}")

    Image.fromarray(result.plot()[:, :, ::-1]).save(output_path)
    output_urls.append(f'{case_id}_{image_path}_output.png')