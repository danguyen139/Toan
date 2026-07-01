"""Download Starters PDF from Cambridge."""
import urllib.request
import os

url = "https://www.cambridgeenglish.org/Images/506166-starters-movers-flyers-word-list-2025.pdf"
dest = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 
                    "506166-starters-movers-flyers-word-list-2025.pdf")

print(f"Downloading from {url}...")
urllib.request.urlretrieve(url, dest)
size = os.path.getsize(dest)
print(f"Downloaded: {size} bytes -> {dest}")
