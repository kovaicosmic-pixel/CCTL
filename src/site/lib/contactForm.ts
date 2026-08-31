import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { Resend } from "resend";
import { company } from "../data/content";

const locationIds = company.locations.map((l) => l.id) as [string, ...string[]];

const contactFormSchema = z.object({
  firstName: z.string().trim().min(1).max(200),
  lastName: z.string().trim().min(1).max(200),
  companyName: z.string().trim().min(1).max(200),
  phone: z.string().trim().min(1).max(50),
  email: z.string().trim().email().max(320),
  locationId: z.enum(locationIds),
  service: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(5000),
  // Honeypot: real visitors never fill this (it's visually hidden); bots
  // that blindly fill every field do. Silently accept and drop instead of
  // erroring, so a bot gets no signal that it was caught.
  companyWebsite: z.string().optional(),
});

export const submitContactForm = createServerFn({ method: "POST" })
  .validator((data: unknown) => contactFormSchema.parse(data))
  .handler(async ({ data }) => {
    if (data.companyWebsite) {
      return { ok: true as const };
    }

    const location = company.locations.find((l) => l.id === data.locationId);
    if (!location) {
      throw new Error("Unknown location");
    }

    const apiKey = process.env["RESEND_API_KEY"];
    const fromAddress = process.env["CONTACT_FROM_EMAIL"];
    if (!apiKey || !fromAddress) {
      console.error(
        "submitContactForm: RESEND_API_KEY / CONTACT_FROM_EMAIL are not set — see .env.example.",
      );
      throw new Error("Email is not configured on the server yet.");
    }

    // Testing override: while confirming delivery works, point every
    // submission at one inbox you can actually check, regardless of which
    // location was selected. Remove TEST_RECIPIENT_EMAIL from .env once
    // delivery is confirmed, so real submissions go to the real per-location
    // addresses again.
    const testRecipient = process.env["TEST_RECIPIENT_EMAIL"];
    const recipient = testRecipient || location.email;

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: fromAddress,
      to: recipient,
      replyTo: data.email,
      subject: `New enquiry from ${data.firstName} ${data.lastName} (${location.label})`,
      text: [
        `Location: ${location.label}`,
        `Name: ${data.firstName} ${data.lastName}`,
        `Company: ${data.companyName}`,
        `Phone: ${data.phone}`,
        `Email: ${data.email}`,
        `Service: ${data.service}`,
        "",
        "Message:",
        data.message,
      ].join("\n"),
    });

    if (error) {
      console.error("submitContactForm: Resend error", error);
      throw new Error("Failed to send the enquiry email.");
    }

    console.log(`submitContactForm: sent OK to ${recipient}`);
    return { ok: true as const };
  });
