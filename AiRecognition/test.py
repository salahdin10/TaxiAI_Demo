import cv2
import numpy as np
import face_recognition
import easyocr
import os
import json
from datetime import datetime
import threading
import queue
import time
import mysql.connector

# Configuration
DATASET_PATH = r'C:\Users\salad\Documents\TaxiAI_Final\AiRecognition\DataBasePic'
FACE_CONFIDENCE_THRESHOLD = 0.6  # Lower is more strict (0-1)
PLATE_CONFIDENCE_THRESHOLD = 0.4  # Higher is more strict (0-1)
FRAME_SCALE = 0.25
MIN_PLATE_AREA = 2000  # Minimum area for valid license plate detection
FRAME_QUEUE_MAXSIZE = 5

# Define the absolute path for the output folder
OUTPUT_FOLDER = os.path.abspath("public/web")

# Ensure the output folder exists
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Initialize OCR reader
reader = easyocr.Reader(['en'], gpu=True)  # Enable GPU if available

# Connect to the database
conn = mysql.connector.connect(
    host="127.0.0.1", 
    user="root", 
    password="", 
    database="alert"
)
cursor = conn.cursor(dictionary=True)

def load_known_faces():
    known_encodings = []
    class_names = []
    for filename in os.listdir(DATASET_PATH):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            img_path = os.path.join(DATASET_PATH, filename)
            img = face_recognition.load_image_file(img_path)
            encodings = face_recognition.face_encodings(img)
            if encodings:
                known_encodings.append(encodings[0])
                class_names.append(os.path.splitext(filename)[0])
            else:
                print(f"Warning: No face found in {filename}")
    return known_encodings, class_names

# Load known faces
known_encodings, class_names = load_known_faces()
if not known_encodings:
    print("Error: No valid faces in dataset")
    exit()

print(f"Loaded {len(known_encodings)} authorized faces")

# Initialize video capture
cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

# License plate cascade
plate_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_russian_plate_number.xml"
)

# Shared frame queue
frame_queue = queue.Queue(maxsize=FRAME_QUEUE_MAXSIZE)

def frame_producer():
    """Continuously capture frames from the camera and put them into the queue."""
    while True:
        ret, frame = cap.read()
        if not ret:
            continue
        if not frame_queue.full():
            frame_queue.put(frame)
        else:
            time.sleep(0.01)

def processing_consumer():
    """Consume frames from the queue, process face and license plate detection."""
    global plate_number  # so we can refer to it later when saving output
    while True:
        try:
            frame = frame_queue.get(timeout=1)
        except queue.Empty:
            continue

        # Resize frame for face recognition
        small_frame = cv2.resize(frame, (0, 0), fx=FRAME_SCALE, fy=FRAME_SCALE)
        rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

        # Face detection and recognition
        face_locations = face_recognition.face_locations(rgb_small_frame)
        face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

        # Initialize variables for output
        name = "No Detection"
        plate_number = "None"

        # Process each detected face
        for face_encoding, (top, right, bottom, left) in zip(face_encodings, face_locations):
            # Scale face locations back to original size
            scale = int(1/FRAME_SCALE)
            top, right, bottom, left = top*scale, right*scale, bottom*scale, left*scale
            distances = face_recognition.face_distance(known_encodings, face_encoding)
            best_match_index = np.argmin(distances)
            if distances[best_match_index] <= FACE_CONFIDENCE_THRESHOLD:
                name = class_names[best_match_index].upper()
                color = (0, 255, 0)  # Green for authorized
                print(f"[{datetime.now().strftime('%H:%M:%S')}] Authorized: {name}")
            else:
                name = "UNKNOWN PERSON"
                color = (0, 0, 255)  # Red for unauthorized
                print(f"[{datetime.now().strftime('%H:%M:%S')}] Security Alert: Unauthorized person detected!")

            cv2.rectangle(frame, (left, top), (right, bottom), color, 2)
            cv2.putText(frame, name, (left + 6, bottom - 6),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)

        # License plate detection using Haar cascade
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        plates = plate_cascade.detectMultiScale(gray, 1.1, 5, minSize=(100, 50))
        for (x, y, w, h) in plates:
            if w * h < MIN_PLATE_AREA:
                continue
            plate_img = frame[y:y+h, x:x+w]
            results = reader.readtext(plate_img)
            plate_text = []
            for (bbox, text, confidence) in results:
                if confidence >= PLATE_CONFIDENCE_THRESHOLD:
                    clean_text = ''.join(c for c in text if c.isalnum()).upper()
                    if clean_text:
                        plate_text.append(clean_text)
            if plate_text:
                plate_number = ' '.join(plate_text)
                cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
                cv2.putText(frame, plate_number, (x, y-10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 0, 0), 2)
                print(f"[{datetime.now().strftime('%H:%M:%S')}] License Plate: {plate_number}")

        # Build the output data
        timestamp = datetime.now().strftime('%H:%M:%S')
        output_data = {
            "face": name,
            "plate": plate_number,
            "time": timestamp
        }

        # Save the current frame to an image file in the public/web folder
        frame_path = os.path.join(OUTPUT_FOLDER, "frame.jpg")
        if cv2.imwrite(frame_path, frame):
            print(f"Frame saved successfully at {frame_path}")
        else:
            print(f"Failed to save frame at {frame_path}")

        # Save detection data to a JSON file in the public/web folder
        data_path = os.path.join(OUTPUT_FOLDER, "data.json")
        try:
            with open(data_path, "w") as f:
                json.dump(output_data, f)
            print(f"Data JSON written successfully at {data_path}")
        except Exception as e:
            print(f"Error writing JSON at {data_path}:", e)

        # Database logic to check for face and license plate
        detected_cin = name  # This is the CIN (Face Recognition result)
        detected_plate = plate_number  # This is the License Plate number

        # Query the database for the driver based on CIN (face recognition)
        cursor.execute("SELECT * FROM drivers WHERE cin = %s", (detected_cin,))
        driver = cursor.fetchone()

        if driver is None:
            # If no driver found (unknown person)
            print(f"Alert: unknown_person - Unrecognized person detected (CIN: {detected_cin})")
            # Log to alerts table
            cursor.execute(
                "INSERT INTO alerts (type, description, detected_at) VALUES (%s, %s, NOW())",
                ('unknown_person', f'Unrecognized person detected (CIN: {detected_cin})')
            )
            conn.commit()
        else:
            # Check if the license plate matches the driver's taxi
            if detected_plate != driver['Taxi']:
                # If the plate doesn't match, log the wrong taxi
                print(f"Alert: wrong_taxi - Driver {detected_cin} is driving the wrong taxi (Plate: {detected_plate})")
                # Log to alerts table
                cursor.execute(
                    "INSERT INTO alerts (type, description, detected_at, driver_id, taxi_id) VALUES (%s, %s, NOW(), %s, %s)",
                    ('wrong_taxi', f'Driver {detected_cin} is driving the wrong taxi (Plate: {detected_plate})', driver['id'], driver['Taxi'])
                )
                conn.commit()
            else:
                # Everything is fine (you can add any other logic here)
                print("Everything is fine: Driver and taxi are correct.")

        # Optionally, show the frame locally (for development)
        cv2.imshow('Security System', frame)
        if cv2.waitKey(1) & 0xFF == 27:
            print("\nSystem shutdown by user request (ESC pressed)")
            break

# Start producer and consumer threads
producer_thread = threading.Thread(target=frame_producer, daemon=True)
producer_thread.start()

consumer_thread = threading.Thread(target=processing_consumer, daemon=True)
consumer_thread.start()

consumer_thread.join()

cap.release()
cv2.destroyAllWindows()

# Debug: Show current working directory
import os
print("Current working directory:", os.getcwd())

