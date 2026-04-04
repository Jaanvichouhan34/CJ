import os
import subprocess
import webbrowser
import shutil
import psutil
import voice
import sys

def open_app(app_name):
    """
    Opens common applications or websites.
    Supported: youtube, whatsapp, spotify, chrome, notepad, calculator, file explorer.
    """
    app_name = app_name.lower().strip()
    print(f"[System] Attempting to open {app_name}")
    try:
        if "youtube" in app_name:
            webbrowser.open("https://www.youtube.com")
            return "Opening YouTube."
        elif "whatsapp" in app_name:
            webbrowser.open("https://web.whatsapp.com")
            return "Opening WhatsApp."
        elif "spotify" in app_name:
            # Note: opens Spotify desktop app if installed
            os.system("start spotify")
            return "Opening Spotify."
        elif "chrome" in app_name:
            os.system("start chrome")
            return "Opening Google Chrome."
        elif "notepad" in app_name:
            subprocess.Popen(["notepad.exe"])
            return "Opening Notepad."
        elif "calculator" in app_name:
            subprocess.Popen(["calc.exe"])
            return "Opening Calculator."
        elif "file explorer" in app_name or "folder" in app_name:
            # Opens file explorer
            subprocess.Popen(["explorer.exe"])
            return "Opening File Explorer."
        else:
            return f"I don't know how to open {app_name} yet."
    except Exception as e:
        print(f"[System] Error opening {app_name}: {e}")
        return f"Error opening {app_name}."

def delete_temp_files():
    """
    Deletes files in the %TEMP% folder, returns count of deleted files.
    """
    count = 0
    temp_dir = os.environ.get("TEMP")
    if not temp_dir or not os.path.exists(temp_dir):
        return 0

    print(f"[System] Clearing temp directory: {temp_dir}")
    try:
        for item in os.listdir(temp_dir):
            item_path = os.path.join(temp_dir, item)
            try:
                if os.path.isfile(item_path) or os.path.islink(item_path):
                    os.unlink(item_path)
                    count += 1
                elif os.path.isdir(item_path):
                    shutil.rmtree(item_path)
                    count += 1
            except Exception as e:
                # Some files might be in use
                pass
        return count
    except Exception as e:
        print(f"[System] Error deleting temp files: {e}")
        return count

def empty_recycle_bin():
    """
    Uses winshell to empty the recycle bin.
    """
    try:
        import winshell
        winshell.recycle_bin().empty(confirm=False, show_progress=False, sound=False)
        return "Recycle bin emptied successfully."
    except ImportError:
        return "winshell module not installed. Please add it to requirements."
    except Exception as e:
        print(f"[System] Error emptying recycle bin: {e}")
        return "Could not empty the recycle bin."

def get_removable_drives():
    """Returns a list of connected USB drives."""
    drives = []
    try:
        partitions = psutil.disk_partitions()
        for partition in partitions:
            if 'removable' in partition.opts.lower():
                drives.append(partition.device)
    except Exception as e:
        print(f"[System] Error scanning drives: {e}")
    return drives

def transfer_to_pendrive(file_path):
    """
    Detects connected USB drives, asks for 2-way confirmation via voice, and copies file.
    """
    try:
        if not os.path.exists(file_path):
            return "The specified file does not exist."
            
        drives = get_removable_drives()
        if not drives:
            return "No USB drives detected."
            
        target_drive = drives[0] # Just grab the first one for simplicity
        
        # Voice confirmation
        voice.speak(f"I found a USB drive at {target_drive}. Do you want to transfer the file?")
        confirmation = voice.listen()
        
        if "yes" in confirmation or "yeah" in confirmation or "sure" in confirmation:
            voice.speak("Transferring file. Please wait.")
            filename = os.path.basename(file_path)
            shutil.copy(file_path, os.path.join(target_drive, filename))
            return "File transferred successfully."
        else:
            return "File transfer cancelled."
    except Exception as e:
        print(f"[System] Error transferring file to pendrive: {e}")
        return "An error occurred during file transfer."

def check_running_processes():
    """
    Returns list of top 10 running processes (by memory footprint).
    """
    print("[System] Checking running processes...")
    try:
        # Get all processes with name and memory info
        processes = []
        for proc in psutil.process_iter(['name', 'memory_info']):
            try:
                processes.append(proc.info)
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                pass
                
        # Sort by memory usage
        processes.sort(key=lambda p: p['memory_info'].rss if p['memory_info'] else 0, reverse=True)
        
        top_10 = processes[:10]
        results = [p['name'] for p in top_10 if p['name']]
        return results
    except Exception as e:
        print(f"[System] Error checking processes: {e}")
        return []
