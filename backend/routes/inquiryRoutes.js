import express from 'express';
import Inquiry from '../models/Inquiry.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// @desc    Submit a new inquiry
// @route   POST /api/inquiries
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    const inquiry = new Inquiry({
      name, email, phone, subject, message
    });
    
    const savedInquiry = await inquiry.save();

    // Setup Nodemailer transporter
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_PASS !== 'YOUR_16_DIGIT_APP_PASSWORD_HERE') {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Sending to company email
        replyTo: email, // Reply goes to the customer
        subject: `New Inquiry from ${name}: ${subject}`,
        text: `You have received a new inquiry from your website.\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\n\nSubject: ${subject}\n\nMessage:\n${message}`,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log('Inquiry email sent successfully');
      } catch (emailError) {
        console.error('Error sending inquiry email:', emailError);
      }
    }

    res.status(201).json(savedInquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get all inquiries
// @route   GET /api/inquiries
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
