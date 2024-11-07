import sys
import cv2
import pytesseract

def extract_plate_number(image_path):
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    processed = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
    plate_number = pytesseract.image_to_string(processed, config='--psm 8').strip().upper()
    return plate_number

if __name__ == "__main__":
    image_path = sys.argv[1]
    print(extract_plate_number(image_path))
