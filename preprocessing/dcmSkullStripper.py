import os
import pydicom
import numpy as np
from pydicom.pixel_data_handlers.util import apply_voi_lut
import cv2
import argparse

# Define brain window settings
WINDOW_WIDTH = 80
WINDOW_LEVEL = 40
SKULL_THRESHOLD = 80  # HU threshold for skull removal

def apply_brain_window(image, dcm=None):
    """
    Apply brain windowing and skull removal to a DICOM or JPG image.
    
    :param image: The pixel array from the DICOM file or JPG image.
    :param dcm: The original DICOM object to retrieve metadata (optional).
    :return: Processed 8-bit image.
    """
    if dcm:
        # Convert pixel values to Hounsfield Units (HU)
        intercept = dcm.RescaleIntercept if 'RescaleIntercept' in dcm else 0
        slope = dcm.RescaleSlope if 'RescaleSlope' in dcm else 1
        image = image * slope + intercept  # Convert to HU

    # Apply windowing
    lower_bound = WINDOW_LEVEL - (WINDOW_WIDTH / 2)
    upper_bound = WINDOW_LEVEL + (WINDOW_WIDTH / 2)
    windowed_image = np.clip(image, lower_bound, upper_bound)

    # Normalize to 8-bit (0-255)
    windowed_image = ((windowed_image - lower_bound) / (upper_bound - lower_bound) * 255).astype(np.uint8)

    # Skull removal: Set high-intensity pixels (> threshold) to black (0)
    if dcm:
        windowed_image[image > SKULL_THRESHOLD] = 0

    return windowed_image

def segment_brain(image):
    """Segment the brain using thresholding and remove artifacts."""
    # Convert image to uint8 if necessary
    if image.dtype != np.uint8:
        image = ((image - np.min(image)) / (np.max(image) - np.min(image)) * 255).astype(np.uint8)
    
    # Apply Otsu's thresholding
    _, thresh = cv2.threshold(image, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    
    # Morphological operations to remove noise
    kernel = np.ones((1, 1), np.uint8)
    thresh = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel, iterations=2)
    
    # Find the largest contour (brain)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if contours:
        largest_contour = max(contours, key=cv2.contourArea)
        mask = np.zeros_like(image, dtype=np.uint8)
        cv2.drawContours(mask, [largest_contour], -1, (255), thickness=cv2.FILLED)
        
        # Apply mask to remove unwanted artifacts
        result = cv2.bitwise_and(image, image, mask=mask)
        return result
    
    return image  # Return original image if no contours found

def process_image_file(input_path, output_path, apply_seg=False):
    if input_path.lower().endswith(".dcm"):
        dcm = pydicom.dcmread(input_path, force=True)
        image = dcm.pixel_array.astype(np.int16)
        processed_image = apply_brain_window(image, dcm)
        if apply_seg:
            processed_image = segment_brain(processed_image)
    else:
        image = cv2.imread(input_path, cv2.IMREAD_GRAYSCALE).astype(np.int16)
        # Apply thresholding similar to windowing for non-DICOM images
        SKULL_THRESHOLD = 220  # HU threshold for skull removal
        WINDOW_LEVEL = 100
        WINDOW_WIDTH = 150
        lower_bound = WINDOW_LEVEL - (WINDOW_WIDTH / 2)
        upper_bound = WINDOW_LEVEL + (WINDOW_WIDTH / 2)
        image = np.clip(image, lower_bound, upper_bound)
        image = ((image - lower_bound) / (upper_bound - lower_bound) * 255).astype(np.uint8)
        image[image > SKULL_THRESHOLD] = 0
        if apply_seg:
            processed_image = segment_brain(image)
        else:
            processed_image = image

    if output_path.lower().endswith(".dcm"):
        # Convert to uncompressed format
        dcm.file_meta.TransferSyntaxUID = pydicom.uid.ExplicitVRLittleEndian

        # Save new DICOM file with processed pixel data
        dcm.PixelData = processed_image.tobytes()
        dcm.PhotometricInterpretation = "MONOCHROME2"  # Ensure grayscale format
        dcm.SamplesPerPixel = 1
        dcm.BitsAllocated = 8
        dcm.BitsStored = 8
        dcm.HighBit = 7
        dcm.PixelRepresentation = 0  # Unsigned integers
            
        dcm.save_as(output_path)
        print(f"Processed: {input_path} → {output_path}")
    else:
        cv2.imwrite(output_path, processed_image)

def process_dicom_folder(input_folder, output_folder, file_type="dcm", apply_seg=False):
    """
    Process all DICOM files in a folder, apply brain window, and save as new uncompressed DICOM files.
    
    :param input_folder: Path to folder containing original DICOM files.
    :param output_folder: Path to folder where processed DICOM files will be saved.
    :param file_type: File type to process.
    """
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    
    for filename in os.listdir(input_folder):
        if filename.lower().endswith(f".{file_type}"):
            input_path = os.path.join(input_folder, filename)
            output_path = os.path.join(output_folder, filename)
            process_image_file(input_path, output_path, apply_seg)

def main():
    parser = argparse.ArgumentParser(description="Process DICOM and image files for brain windowing and skull stripping.")
    parser.add_argument("input_folder", type=str, help="Path to the input folder containing DICOM or image files.")
    parser.add_argument("output_folder", type=str, help="Path to the output folder to save processed files.")
    parser.add_argument("--file_type", type=str, choices=["dcm", "png", "jpg", "jpeg"], help="File type to process.")
    parser.add_argument("--apply_seg", type=bool, help="apply segmentation to the image")
    args = parser.parse_args()

    process_dicom_folder(args.input_folder, args.output_folder, args.file_type, args.apply_seg)

if __name__ == "__main__":
    main()
