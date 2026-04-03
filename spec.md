# Acharya Ravinder - 21 Day Yoga Weight Loss Challenge

## Current State
The project has a previous yoga landing page (festival offer focused) and a performance marketing consultant website. The frontend has existing App.tsx with components and styling. The backend has a simple audit request submission form. The new request is a completely new single product landing page for a 21-Day Weight Loss Yoga Challenge.

## Requested Changes (Diff)

### Add
- Full 12-section single product landing page for 21-Day Yoga Weight Loss Challenge
- Section 1: Hero with headline, price box, urgency badges, CTA, social proof bar, transformation image placeholder
- Section 2: Problem identification - 6 problem cards (Why Most People Fail)
- Section 3: Solution - 3 pillar cards (Daily Yoga, Diet Guidance, Accountability)
- Section 4: Transformation proof - before/after gallery placeholders + result highlights
- Section 5: Video testimonials - 3 video placeholders
- Section 6: What You Get - benefit list + FREE BONUS box + value stack
- Section 7: Program structure - 5 step process
- Section 8: Instructor authority - Acharya Ravinder profile
- Section 9: Pricing + urgency - price card with countdown timer, urgency text
- Section 10: FAQ accordion
- Section 11: Final emotional CTA + WhatsApp button
- Section 12: Trust footer with badges + contact links
- Sticky header with CTA button
- Sticky mobile bottom CTA bar
- Floating WhatsApp button
- Countdown timer (animated)
- Backend: lead capture for "Join Challenge" form submissions

### Modify
- Replace existing App.tsx entirely with new 21-Day Challenge landing page
- Update backend to support challenge enrollment lead capture

### Remove
- Old yoga festival pricing page content
- Old performance marketing consultant content

## Implementation Plan
1. Generate Motoko backend for lead capture (name, phone, email for challenge enrollment)
2. Build full frontend landing page with all 12 sections
3. Implement green color theme (#16A34A primary), white secondary, light green accents
4. Add sticky header, sticky mobile CTA bar, floating WhatsApp button
5. Add countdown timer with live animation
6. All CTA buttons green with white text
7. Mobile-first responsive design
8. Psychological triggers: urgency, social proof, authority, scarcity, risk reversal throughout
9. Multiple CTA repetitions after every 2 sections
