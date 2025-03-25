import os
import pydicom
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.widgets import Button
from tkinter import filedialog, Tk
import cv2

class DICOMViewer:
    def __init__(self):
        self.file_paths = []
        self.current_index = 0
        self.fig, self.ax = plt.subplots()
        self.fig.canvas.mpl_connect('close_event', self.on_close)

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
            min_val, max_val = np.min(image), np.max(image)
            image = (image - min_val) / (max_val - min_val)
        
        self.ax.clear()
        self.ax.imshow(image, cmap="gray")
        self.ax.set_title(f"DICOM Viewer - {os.path.basename(file_path)}")
        self.ax.axis("off")
        plt.draw()

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
    
    plt.show()
