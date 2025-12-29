# UX Improvement Plan

**Created:** 2025-12-29
**Last Updated:** 2025-12-29
**Status:** Planning

---

## Overview

This document tracks UX improvements identified from evaluating the platform from three perspectives:
1. **Viewer** - Looking for events, products, services
2. **Artist** - Marketing their products on the platform
3. **Admin** - Managing artists

---

## Implementation Phases

### Phase 1: Fix Core Display Issues ✅
*Goal: Make existing data visible to viewers*

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1.1 | Show portfolio on public artist profile | ✅ Done | Already existed in code - `PortfolioGallery` component with lightbox |
| 1.2 | Show availability badges on artist profile | ✅ Done | Already existed - shows "Open for Commissions", "Open to Collaborate", "Available for Events" |
| 1.3 | Show social links on artist profile | ✅ Done | Already existed - Email, Instagram, Facebook, Website. Added WhatsApp link |
| 1.4 | Show price range on artist profile | ✅ Done | Added Quick Info Card with Experience level and Price Range |

**Review after Phase 1:**

### Phase 1 Review (2025-12-29)

**What was implemented?**
- Discovered Phase 1.1-1.3 were already implemented in the codebase
- Added `PRICE_RANGE_LABELS` and `EXPERIENCE_LABELS` to `src/types/index.ts`
- Added Quick Info Card to artist profile showing Experience and Price Range
- Added WhatsApp link (with `whatsapp_public` privacy control)

**What works well?**
- Portfolio gallery has full lightbox with keyboard navigation
- Availability badges display with appropriate colors (ochre, teal, terracotta)
- Contact section shows email and all social links
- Price range hidden when set to "Contact for pricing" (cleaner UX)

**What issues were discovered?**
- Test artist has minimal data populated (no portfolio, no social links, no experience/price set)
- Need real artist data to fully verify all display features

**Screenshot verification:**
- `.playwright-mcp/artist-profile-phase1-review.png`

**Scope changes for Phase 2:** None - proceed as planned

---

### Phase 2: Enhanced Discoverability ✅
*Goal: Help viewers find the right artists*

| # | Task | Status | Notes |
|---|------|--------|-------|
| 2.1 | Add "Available For" filters to directory | ✅ Done | Toggle pills for Commissions, Collaboration, Events |
| 2.2 | Add search bar to artist directory | ✅ Done | Already existed - search by name, tagline, bio |
| 2.3 | Enhance artist cards in directory | ✅ Done | All availability badges + price range displayed |
| 2.4 | Featured artists on homepage | ✅ Done | Already existed - pulls artists with `featured: true` |

**Review after Phase 2:**

### Phase 2 Review (2025-12-29)

**What was implemented?**
- Added availability filter pills: Commissions (ochre), Collaboration (teal), Events (terracotta)
- Filter pills toggle on/off with color feedback
- Mobile-responsive: pills appear in mobile filter dropdown
- Enhanced ArtistCard with all availability badges
- Added price range display to artist cards (with $ icon in teal)

**What works well?**
- Filters are visually distinct with brand colors
- Toggle behavior is intuitive (click to enable/disable)
- Clear button resets all filters including availability
- Cards show comprehensive info at a glance

**What issues were discovered?**
- Search bar already existed (was in Phase 2.2)
- Featured artists section already existed (was in Phase 2.4)
- Test artist has no availability flags set, so badges don't display

**Screenshot verification:**
- `.playwright-mcp/phase2-filters-deployed.png`

**Scope changes for Phase 3:** None - proceed as planned

---

### Phase 3: Products & Services
*Goal: Let artists list what they offer*

| # | Task | Status | Notes |
|---|------|--------|-------|
| 3.1 | Design products/services schema | Pending | DB tables for offerings |
| 3.2 | Add services section to artist dashboard | Pending | CRUD for services |
| 3.3 | Display services on public profile | Pending | With pricing, description |
| 3.4 | Inquiry form with service selection | Pending | "I'm interested in: [service]" |

**Review after Phase 3:** _To be completed_

---

### Phase 4: Events Feature
*Goal: Artists can promote exhibitions, workshops, performances*

| # | Task | Status | Notes |
|---|------|--------|-------|
| 4.1 | Design events schema | Pending | DB table for events |
| 4.2 | Events page for viewers | Pending | `/events` with filters |
| 4.3 | Add events to artist dashboard | Pending | Artists can create events |
| 4.4 | Events on artist profile | Pending | "Upcoming Events" section |

**Review after Phase 4:** _To be completed_

---

### Phase 5: Admin Enhancements
*Goal: Improve admin efficiency*

| # | Task | Status | Notes |
|---|------|--------|-------|
| 5.1 | Search in admin artists list | Pending | |
| 5.2 | Bulk approve/reject artists | Pending | |
| 5.3 | Featured artist toggle in admin | Pending | |
| 5.4 | Connect settings to actual functionality | Pending | |

**Review after Phase 5:** _To be completed_

---

## Implementation Log

### 2025-12-29 - Phase 2 Complete
- Added availability filter pills (Commissions, Collaboration, Events)
- Enhanced artist cards with all badges and price range
- Discovered search and featured artists already existed
- Deployed and verified on production

### 2025-12-29 - Phase 1 Complete
- Reviewed artist profile code - discovered most features already existed
- Added Quick Info Card (Experience level, Price Range) to artist profile
- Added WhatsApp link to contact section
- Deployed to production and verified
- Updated plan with Phase 1 review

### 2025-12-29 - Initial Planning
- Completed UX evaluation from 3 perspectives
- Identified 15+ issues across viewer, artist, admin experiences
- Created this implementation plan
- **Priority decision:** Start with Phase 1 (fix core display issues) as it has highest impact with lowest effort

---

## Review Template

After each phase, answer:

1. **What was implemented?**
2. **What works well?**
3. **What issues were discovered?**
4. **Any scope changes for next phase?**
5. **Screenshot/verification link:**

---

## Current Focus

**Next up:** Phase 3 - Products & Services

Phase 3 will let artists list what they offer:
- 3.1: Design products/services schema (DB tables)
- 3.2: Add services section to artist dashboard (CRUD)
- 3.3: Display services on public profile
- 3.4: Inquiry form with service selection

---
