import { useState } from "react";
import { sendContactEmail } from "../services/api";

function Contact() {

  return (
    <div className="contact-page">
      <section className="page-hero contact-hero">
        <div className="container">
          <h1 className="page-title">Get in Touch</h1>
          <p className="page-subtitle">
            Have questions about Sri Lankan destinations? We're here to help!
          </p>
        </div>
      </section>

      <div className="container">
        <div className="contact-content">
          <div className="contact-info">
            <h2>Contact Information</h2>
            <p className="contact-intro">
              Whether you have questions about destinations, need travel advice, or want to share 
              your Sri Lankan adventure with us, we'd love to hear from you!
            </p>

            <div className="emergency-info">
              <h3>Emergency Travel Assistance</h3>
              <p>For urgent travel-related inquiries while in Sri Lanka, contact :</p>
              <p className="emergency-number">Tourism Information & Complaints (SLTDA): 1912</p>
              <p className="emergency-number">Tourist Police: +94 11 242 1052</p>
              <p className="emergency-number">Police Emergency: 119 or 011-2433333</p>
              <p className="emergency-number">Government Information Center: 1919</p>
              <p className="emergency-number">SriLankan Airlines (24/7): +94117 77 1979</p>
              <p className="emergency-number">SLTDA Head Office (Colombo): +94 112426800 </p>
            </div>
          </div>

          <div className="contact-email-card">
            <div className="email-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3>Get In Touch</h3>
            <p className="email-card-text">
              Want to talk about this website or have feedback? We'd love to hear from you!
            </p>
            <div className="email-display">
              <a href="mailto:pixellogic2@gmail.com" className="contact-email-link">
                pixellogic2@gmail.com
              </a>
            </div>
            <p className="email-card-subtext">
              Click to send us an email directly
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Contact;