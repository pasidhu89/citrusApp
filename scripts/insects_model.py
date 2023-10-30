
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
    
    # Define the URL of your API endpoint
api_url = "http://localhost:3000/upload/complete"  # Replace with your actual API URL

# Prepare the data to send in the request
data = {
    "case_id": case_id,
    "output_urls": output_urls,
    "output_labels": output_labels
}


try:
    response = requests.post(api_url, json=data)

    # Check the response status code
    if response.status_code == 201:
        logging.info("Upload record created successfully.")
    else:
        logging.info("Failed to update the record. Status code:", response.status_code)

except requests.exceptions.RequestException as e:
    logging.info("An error occurred while sending the request:", e)
    
    logging.info("Python script finished")