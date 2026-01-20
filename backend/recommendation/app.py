from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from recommender import recommend
from details import locations, location_type
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/recommend")
def recommend_places(payload: dict):
    return recommend(payload["preferences"])

@app.get("/locations")
def get_locations():
    return locations()

@app.get("/location-types")
def get_location_types():
    return location_type()

@app.post("/contact")
def send_contact_email(payload: dict):
    try:
        name = payload.get('name')
        email = payload.get('email')
        subject = payload.get('subject')
        message = payload.get('message')
        
        # Create email content
        recipient_email = "pixellogic2@gmail.com"
        
        # Create the email message
        msg = MIMEMultipart('alternative')
        msg['From'] = email
        msg['To'] = recipient_email
        msg['Subject'] = f"TravelMate Contact: {subject}"
        
        # Create HTML email body
        html_body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; border-radius: 10px;">
                <h2 style="color: #4facfe; border-bottom: 3px solid #4facfe; padding-bottom: 10px;">New Contact Form Submission</h2>
                
                <div style="background-color: white; padding: 20px; border-radius: 8px; margin-top: 20px;">
                    <p><strong style="color: #555;">Name:</strong> {name}</p>
                    <p><strong style="color: #555;">Email:</strong> {email}</p>
                    <p><strong style="color: #555;">Subject:</strong> {subject}</p>
                    <p><strong style="color: #555;">Date:</strong> {datetime.now().strftime('%B %d, %Y at %I:%M %p')}</p>
                    
                    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
                    
                    <p><strong style="color: #555;">Message:</strong></p>
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #4facfe;">
                        <p style="margin: 0; white-space: pre-wrap;">{message}</p>
                    </div>
                </div>
                
                <div style="margin-top: 20px; padding: 15px; background-color: #e8f5ff; border-radius: 8px; border-left: 4px solid #4facfe;">
                    <p style="margin: 0; font-size: 12px; color: #666;">
                        This email was sent from the TravelMate contact form. Reply directly to this email to respond to {name}.
                    </p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Attach HTML content
        html_part = MIMEText(html_body, 'html')
        msg.attach(html_part)
        
        # Try to send via Gmail SMTP
        # Note: For production, you should use environment variables for credentials
        # and enable "App Passwords" in Gmail settings
        try:
            with smtplib.SMTP('smtp.gmail.com', 587) as server:
                server.starttls()
                # You'll need to set up an app password for Gmail
                # server.login('your-gmail@gmail.com', 'your-app-password')
                # server.send_message(msg)
                pass
        except Exception as smtp_error:
            print(f"SMTP Error: {smtp_error}")
        
        # For now, just log the email content (since SMTP requires credentials)
        print(f"\n{'='*50}")
        print(f"NEW CONTACT FORM SUBMISSION")
        print(f"{'='*50}")
        print(f"From: {name} <{email}>")
        print(f"Subject: {subject}")
        print(f"Message:\n{message}")
        print(f"{'='*50}\n")
        
        # Return success response
        return {
            "success": True,
            "message": "Your message has been received! We'll get back to you soon."
        }
    
    except Exception as e:
        print(f"Error: {e}")
        return {
            "success": False,
            "message": "Failed to send message. Please try again."
        }
