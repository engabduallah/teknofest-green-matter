import os
import pydicom
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.widgets import Button, Slider, CheckButtons
from tkinter import filedialog, Tk
import cv2

class DICOMViewer:
    def __init__(self):
        self.file_paths = []
        self.current_index = 0
        self.fig, self.ax = plt.subplots()
        self.fig.canvas.mpl_connect('close_event', self.on_close)
        self.window_level = 100
        self.window_width = 150
        self.threshold = 220
        self.apply_segmentation = False

    def open_folder(self):
        """Opens a folder containing DICOM or JPG files and displays the first image."""
        # Hide main Tkinter window
        root = Tk()
        root.withdraw()
        
        # Select folder
        folder_path = filedialog.askdirectory(title="Select a Folder Containing DICOM or JPG Files")
        
        # Destroy the Tkinter root window
        root.destroy()
        
        if not folder_path:
            print("No folder selected.")
            return
        
        # Get all DICOM and JPG files in the folder
        self.file_paths = [os.path.join(folder_path, f) for f in os.listdir(folder_path) if f.endswith(('.dcm', '.jpg', '.jpeg', '.png'))]
        
        if not self.file_paths:
            print("No DICOM or JPG files found in the selected folder.")
            return
        
        self.current_index = 0
        self.display_image()

    def display_image(self):
        """Displays the current DICOM or JPG image."""
        file_path = self.file_paths[self.current_index]
        
        if file_path.lower().endswith('.dcm'):
            dcm = pydicom.dcmread(file_path)
            image = dcm.pixel_array.astype(np.float32)
            
            if 'RescaleIntercept' in dcm and 'RescaleSlope' in dcm:
                image = image * dcm.RescaleSlope + dcm.RescaleIntercept
            
            min_val, max_val = np.min(image), np.max(image)
            image = (image - min_val) / (max_val - min_val)
        else:
            image = cv2.imread(file_path, cv2.IMREAD_GRAYSCALE).astype(np.float32)
            image = self.apply_windowing(image)
            if self.apply_segmentation:
                image = self.segment_brain(image)
        
        self.ax.clear()
        self.ax.imshow(image, cmap="gray")
        self.ax.set_title(f"DICOM Viewer - {os.path.basename(file_path)}")
        self.ax.axis("off")
        plt.draw()

    def apply_windowing(self, image):
        """Applies windowing and thresholding to the image."""
        wl = self.window_level
        ww = self.window_width
        min_val = wl - (ww / 2)
        max_val = wl + (ww / 2)
        image = np.clip(image, min_val, max_val)
        image = ((image - min_val) / (max_val - min_val) * 255).astype(np.uint8)
        image[image > self.threshold] = 0
        return image
    
    
    def segment_brain(self, image):
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

    def update_window_level(self, val):
        """Updates the window level and refreshes the image."""
        self.window_level = val
        self.display_image()

    def update_window_width(self, val):
        """Updates the window width and refreshes the image."""
        self.window_width = val
        self.display_image()

    def update_threshold(self, val):
        """Updates the threshold and refreshes the image."""
        self.threshold = val
        self.display_image()

    def toggle_segmentation(self, label):
        """Toggles the brain segmentation and refreshes the image."""
        self.apply_segmentation = not self.apply_segmentation
        self.display_image()

    def next_image(self, event):
        """Displays the next DICOM or JPG image."""
        if self.current_index < len(self.file_paths) - 1:
            self.current_index += 1
            self.display_image()

    def previous_image(self, event):
        """Displays the previous DICOM or JPG image."""
        if self.current_index > 0:
            self.current_index -= 1
            self.display_image()

    def on_close(self, event):
        """Handles the close event of the matplotlib window."""
        plt.close('all')

if __name__ == "__main__":
    viewer = DICOMViewer()
    viewer.open_folder()
    
    axprev = plt.axes([0.7, 0.01, 0.1, 0.075])
    axnext = plt.axes([0.81, 0.01, 0.1, 0.075])
    bnext = Button(axnext, 'Next')
    bnext.on_clicked(viewer.next_image)
    bprev = Button(axprev, 'Previous')
    bprev.on_clicked(viewer.previous_image)
    
    axlevel = plt.axes([0.25, 0.01, 0.4, 0.03], facecolor='lightgoldenrodyellow')
    axwidth = plt.axes([0.25, 0.05, 0.4, 0.03], facecolor='lightgoldenrodyellow')
    axthreshold = plt.axes([0.25, 0.09, 0.4, 0.03], facecolor='lightgoldenrodyellow')
    
    slevel = Slider(axlevel, 'Level', 0, 1000, valinit=500)
    swidth = Slider(axwidth, 'Width', 0, 1000, valinit=500)
    sthreshold = Slider(axthreshold, 'Threshold', 0, 1000, valinit=500)
    
    slevel.on_changed(viewer.update_window_level)
    swidth.on_changed(viewer.update_window_width)
    sthreshold.on_changed(viewer.update_threshold)
    
    rax = plt.axes([0.025, 0.5, 0.15, 0.15], facecolor='lightgoldenrodyellow')
    check = CheckButtons(rax, ['Segment Brain'], [False])
    check.on_clicked(viewer.toggle_segmentation)
    
    plt.show()
