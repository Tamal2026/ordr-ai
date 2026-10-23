# OrdR AI

Voice first booking assistant. Say what you need and get the top 3 matches in about 2 seconds.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Open_Now-black?style=for-the-badge)](https://ordr-ai.vercel.app)

**Live Link:** https://ordr-ai.vercel.app

Use Chrome or Edge for voice. In other browsers you can type.

## Try it

Say or type something like

* I need to see a doctor next week
* Barber for a fade this Saturday
* Table for 4 tonight around 7:30

## What it does

* Works for medical clinic, barber shop, legal office and restaurant
* Understands category budget and rating from one sentence
* Shows the top 3 results with image price and rating
* Fixes small speech mistakes using AI
* Book button shows a demo confirmation

## How it works

Voice to text in the browser then Next.js API route then n8n webhook then Groq AI finds the intent then n8n reads Google Sheets then filters and ranks then top 3 come back.

The AI only understands the sentence. All results come from my own Google Sheet so it never makes up a business or a price.

## Tech

Next.js · Tailwind CSS · Framer Motion · Web Speech API · n8n · Groq · Google Sheets · Vercel

## What I learned

Most bugs were small things between systems like a wrong node reference or an old category left in a prompt. Checking each node output one by one was the fastest way to fix them.

## Next

* Real booking saved in Google Sheets
* Session memory so you can say "book number 3"
* Webhook security and Slack error alerts

## Contact

Tamal Krishna

GitHub: https://github.com/Tamal2026

LinkedIn: https://linkedin.com/in/tamalkrishna

Email: tamalkrishnadev@gmail.com
