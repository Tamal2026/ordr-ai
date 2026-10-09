# OrdR AI

OrdR AI is a voice first booking assistant. You just say what you need and it shows you the three best matches in about two seconds. No forms, no scrolling, no phone calls.

For example you can say "I need to see a doctor sometime next week" and it will show you the top three clinics with price and rating.

## Why I made this

I noticed that booking something online takes too many steps. You pick a category, set filters, scroll a long list and then decide. I wanted to see if one spoken sentence could replace all of that. This is version one of that idea.

## What it can do right now

1. You can speak or type your request
2. It works for four categories: medical clinic, barber shop, legal office and restaurant
3. It understands the category from what you say, so you do not need to click the category button first
4. It understands budget and rating when you mention them
5. It shows the top three matches with image, price and rating
6. Each card has a booking button that shows a demo confirmation
7. Small speech mistakes like wrong spelling are handled by the AI

## How it works

When you send a request, this is what happens behind the scenes.

1. Your voice is turned into text in the browser using the Web Speech API
2. The Next.js app sends the text to its own API route
3. That route forwards it to an n8n webhook
4. n8n checks if the request is valid
5. Groq AI reads the sentence and finds the category, budget and rating
6. n8n merges the AI result with the basic result from the browser
7. n8n reads the data from Google Sheets
8. The data is filtered and ranked and the top three are picked
9. The result goes back to the website and the cards appear

The AI only understands the sentence. It never makes up any business or price. All the results come from my own Google Sheet, so there is no hallucination problem.

## Tech stack

1. Next.js with App Router
2. Tailwind CSS and Framer Motion
3. Web Speech API for voice
4. n8n for the workflow
5. Groq with the openai/gpt-oss-20b model
6. Google Sheets as the data source
7. Vercel for hosting

## Things I faced while building

This project taught me a lot because many small things broke. Some of the big ones:

1. Wrong node reference in n8n. I used the wrong way to read data from an earlier node and the whole flow crashed
2. Groq removed two models that I was using. I had to switch to a new one
3. Old category names were still inside the validation and the AI prompt after I changed the project idea
4. Google Sheets column names were in capital letters but my code was looking for small letters
5. A wrong expression in the n8n response made the website receive text instead of a list
6. Brave browser does not support the Web Speech API. Use Chrome or Edge for the voice feature

## Note about the demo

The booking button is a demo for now. It shows a confirmation but does not save anything. Real booking is part of the next version.

## What I want to add next

1. Real booking saved in n8n and Google Sheets
2. Session memory so the AI remembers earlier results and you can say "book number 3"
3. Better voice recognition for different accents
4. More categories like hotels and fashion
5. Webhook security and error alerts on Slack

## About me

I am a student from Bangladesh learning how to build AI products. I made this project to learn how language models, automation tools and real apps work together. Feedback is always welcome.
