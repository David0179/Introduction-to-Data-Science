from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io
import time
from ultralytics import YOLO

app = Flask(__name__)
CORS(app) # Mandatory: Allows React to access this API

# Load your custom best.pt model
model = YOLO("best.pt")
print(f"🔍 YOLO is running on device: {model.device}")

# NEW: Health check route so you don't get a "Not Found" error in the browser
@app.route('/', methods=['GET'])
def home():
    return "Underwater Detection YOLO Backend is running! The /detect endpoint is active."

# UPDATED: Added 'POST' to the methods array to accept images
@app.route('/detect', methods=['POST'])
def detect():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400
    
    file = request.files['image']
    
    try:
        # 1. Time the Image Processing
        t0 = time.time()
        img_bytes = file.read()
        img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        t1 = time.time()
        print(f"⏱️ Image loading took: {t1 - t0:.4f} seconds")
        
        # 2. Time the YOLO Inference
        results = model(img)
        t2 = time.time()
        print(f"⏱️ YOLO inference took: {t2 - t1:.4f} seconds")
        
        # Format results for the frontend
        detections = []
        for result in results:
            for box in result.boxes:
                detections.append({
                    "class": result.names[int(box.cls)],
                    "confidence": float(box.conf),
                    # Fixed indexing to safely extract the 4 coordinates
                    "bbox": [float(x) for x in box.xyxy[0]] 
                })
        
        return jsonify({"objects": detections})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)