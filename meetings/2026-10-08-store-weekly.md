# Store weekly sync: sample transcript

Sample data for `/create-tickets --dry-run`. The people and events are made up. Speakers are named by role.

- Date: 2026-10-08
- Attendees: Product lead (PL), Engineering lead (EL), Support lead (SL), Designer (DS)

---

**[00:00] PL:** Thanks for joining. Three things today: support's list, the checkout numbers, and what goes in the next sprint.

**[00:41] SL:** Support first. We had four tickets this week from people who said the order history page shows their orders in a strange order. One customer had order 10 above order 9. I checked, and the list is sorted by order ID as text, not by date.

**[01:20] EL:** That is the old data layer. The order history route still reads through `src/legacy/`. The new repository sorts newest first. We have a ticket to move those reads, LEGACY-06.

**[01:38] PL:** So it is covered there?

**[01:42] EL:** The move fixes it, yes, if we decide the new order is the right one. I want that written down as a decision, because the API response changes.

**[02:05] PL:** Decision then: order history shows newest first. EL, you own adding that to LEGACY-06.

**[02:14] EL:** Will do, by Friday.

**[02:30] SL:** Second thing. Customers ask the support agent "where is my order" and it answers with the total in dollars with a long tail, like 33.989999999. It looks broken.

**[02:52] EL:** That comes from the legacy layer too. It returns dollars as floats. Same root cause, but the support agent is a different call site.

**[03:10] SL:** Third. Two customers asked if they can save a cart and come back to it.

**[03:18] PL:** We have FEAT-02 for that already.

**[03:25] DS:** On the same screen: when a discount code is wrong, the error shows under the button and people miss it. I would like it next to the code field.

**[03:40] PL:** Is that a ticket?

**[03:44] DS:** Not yet. It is a small change on the checkout page.

**[04:02] PL:** Checkout numbers. The breakdown table is live. Exit rate on checkout went from 41% to 37% over two weeks of sample sessions. That is about a 10% relative drop, which is right at the pass line we set.

**[04:30] EL:** Two weeks is short. Can we keep the experiment running one more week before we call it?

**[04:36] PL:** Agreed. We keep it in testing for one more week.

**[05:00] SL:** One more from support. A customer wants an invoice as a PDF for their accountant.

**[05:12] PL:** That is billing. We do not have a tree for paid plans yet, so I do not want to start that now. Let us park it.

**[05:30] DS:** Unrelated, but has anyone tried the new coffee place downstairs?

**[05:34] EL:** Yes. Long line.

**[05:50] EL:** Last item from me. The test for order listing failed twice in CI last week before we skipped it. That is FLAKY-05. I will pick it up this sprint.

**[06:05] PL:** Good. Summary: LEGACY-06 gets the newest-first decision, EL owns it. Discount error placement needs a ticket. Checkout experiment runs one more week. PDF invoices are parked. FLAKY-05 is in the sprint.

**[06:30] PL:** Thanks, all.
