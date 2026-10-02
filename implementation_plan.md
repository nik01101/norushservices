# Plan: Feature Improvements, Security Hardening, and Performance Optimization for No Rush

This plan details the implementation of user-approved improvements, security fixes, performance optimizations, and feature enhancements for No Rush ([https://norushservices.com/](https://norushservices.com/)).

---

## User Decisions Confirmed

- **Admin Authentication**: Using **Firebase Authentication (`firebase/auth`)** for admin login and securing `/admin/dashboard`.
- **Email Notifications**: Integrating **Resend** for automated booking confirmation emails to both customer and business.
- **AI Integration Cost Context**: Google Gemini 2.5 Flash / 1.5 Flash on Google AI Studio provides a generous **free tier** (up to 15 requests/minute, 1,500 requests/day at $0 cost). We will build the infrastructure cleanly so it runs within the free tier with zero ongoing hosting cost.

---

## Execution Phases

### Phase 1: Dependencies & Core Fixes
1. Install project dependencies (`npm install`).
2. Add `resend` for transactional email delivery.
3. Fix Next.js 15 dynamic route parameter typing in `src/app/book/[serviceId]/page.tsx` (`params: Promise<{ serviceId: string }>`).
4. Add environment variable fallback for Google Maps API Key in `src/lib/server-utils.ts` to prevent local crashes.
5. Remove duplicate file `src/app/lib/gallery-images.ts` and dead code `src/components/ui/oldosocials.tsx`.

### Phase 2: Security & Firebase Auth Hardening
1. **Firebase Auth Integration**:
   - Refactor `src/app/admin/login/page.tsx` to use `signInWithEmailAndPassword(auth, email, password)`.
   - Remove client-side bcrypt password hash exposure.
2. **Dashboard Protection**:
   - Implement route guard in `src/app/admin/dashboard/page.tsx` using `onAuthStateChanged(auth)` with loading state and redirect to `/admin/login`.
   - Add a secure **Sign Out** button in the dashboard.
3. **Firestore Security Rules**:
   - Update `firestore.rules` with strict, role-based rules preventing unauthorized reads of customer bookings, messages, and admin records.

### Phase 3: Resend Email Notification System
1. Create `src/lib/email.ts` to send branded HTML emails via Resend:
   - **Customer Confirmation**: Appointment details, service name, date, time slot, and address.
   - **Admin Alert**: Immediate alert with customer contact info and direct dashboard link.
2. Integrate email dispatch into the booking submission flow in `BookingForm.tsx` (or API route). Gracefully log if `RESEND_API_KEY` is not yet configured so bookings succeed uninterrupted.

### Phase 4: Performance, SEO & UI Polish
1. **LCP & Image Optimization**:
   - Add `priority` to above-the-fold hero image in `LandingCarousel`.
   - Replace placeholder `alt="waawaaa"` with accessible descriptions.
   - Configure image formats (`image/avif`, `image/webp`) in `next.config.ts`.
2. **Local SEO & Schema Markup**:
   - Add `LocalBusiness` JSON-LD schema markup to `src/app/layout.tsx`.
   - Add custom metadata titles & descriptions for `/services`, `/about`, `/gallery`, `/contact`, and `/book/[serviceId]`.
3. **Booking & UI Polish**:
   - Fix double-dollar sign display (`$$50/hr` -> `$50/Hr`).
   - Group booking time slots (Morning / Afternoon / Evening).

---

## Verification Plan
1. **Type Check**: `npm run typecheck` (`tsc --noEmit`) to ensure clean types.
2. **Build Test**: `npm run build` to verify Next.js production build succeeds without errors.
3. **Admin Auth Test**: Verify `/admin/dashboard` blocks unauthenticated users and redirects to `/admin/login`.
4. **Booking Flow & Email**: Test booking submittal and verify Resend trigger.
