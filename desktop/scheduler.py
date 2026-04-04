import schedule
import time
import json
import threading
import os
import voice

REMINDERS_FILE = os.path.join(os.path.dirname(__file__), 'reminders.json')

def load_reminders():
    """Load reminders from the JSON file."""
    if not os.path.exists(REMINDERS_FILE):
        return []
    try:
        with open(REMINDERS_FILE, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"[Scheduler] Error loading reminders: {e}")
        return []

def save_reminders(reminders):
    """Save reminders back to the JSON file."""
    try:
        with open(REMINDERS_FILE, 'w') as f:
            json.dump(reminders, f, indent=4)
    except Exception as e:
        print(f"[Scheduler] Error saving reminders: {e}")

def trigger_reminder(message):
    """Function to call when a reminder fires."""
    voice.speak(f"Reminder: {message}")

def schedule_existing_reminders():
    """Load all reminders and register them with schedule."""
    schedule.clear()
    reminders = load_reminders()
    for rm in reminders:
        time_str = rm.get("time")
        message = rm.get("message")
        if time_str and message:
            try:
                schedule.every().day.at(time_str).do(trigger_reminder, message=message)
                print(f"[Scheduler] Scheduled '{message}' at {time_str}")
            except Exception as e:
                print(f"[Scheduler] Failed to schedule reminder {rm}: {e}")

def add_reminder(time_str, message):
    """
    Adds a reminder to reminders.json and schedules it.
    Expects time_str in 'HH:MM' 24-hour format.
    """
    reminders = load_reminders()
    reminders.append({"time": time_str, "message": message})
    save_reminders(reminders)
    schedule_existing_reminders()
    print(f"[Scheduler] Added new reminder for {time_str}")

def _run_scheduler():
    """Internal loop to run pending scheduled tasks."""
    while True:
        schedule.run_pending()
        time.sleep(1)

def start():
    """Starts the scheduler in a background thread."""
    schedule_existing_reminders()
    t = threading.Thread(target=_run_scheduler, daemon=True)
    t.start()
    print("[Scheduler] Background thread started.")
