
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