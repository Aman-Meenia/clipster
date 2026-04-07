import { z } from "zod";

// ── Create Campaign Request (public form) ────────────────────────────────────

export const createCampaignRequestSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be at most 100 characters"),

  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email must be at most 255 characters"),

  phoneNumber: z
    .string()
    .max(20, "Phone number must be at most 20 characters")
    .optional()
    .or(z.literal("")),

  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title must be at most 150 characters"),

  campaignGoals: z
    .string()
    .min(10, "Campaign goals must be at least 10 characters")
    .max(2000, "Campaign goals must be at most 2000 characters"),
});

export type CreateCampaignRequestInput = z.infer<
  typeof createCampaignRequestSchema
>;

// ── Update Status (admin) ────────────────────────────────────────────────────

export const CampaignRequestStatusEnum = z.enum([
  "PENDING",
  "APPROVED",
  "REJECTED",
]);
export type CampaignRequestStatus = z.infer<typeof CampaignRequestStatusEnum>;

export const updateCampaignRequestStatusSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"], {
    message: "Status must be APPROVED or REJECTED",
  }),
  adminNotes: z
    .string()
    .max(1000, "Admin notes must be at most 1000 characters")
    .optional()
    .or(z.literal("")),
});

export type UpdateCampaignRequestStatusInput = z.infer<
  typeof updateCampaignRequestStatusSchema
>;

// ── Response Types ───────────────────────────────────────────────────────────

export interface CampaignRequestResponse {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  title: string;
  campaignGoals: string;
  status: CampaignRequestStatus;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignRequestListResponse {
  requests: CampaignRequestResponse[];
  total: number;
  page: number;
  limit: number;
}
