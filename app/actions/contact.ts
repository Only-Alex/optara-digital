"use server";

export type ContactState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors: Record<string, string>;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const service = String(formData.get("service") ?? "").trim();
  const budget = String(formData.get("budget") ?? "").trim();
  const brief = String(formData.get("brief") ?? "").trim();

  const fieldErrors: Record<string, string> = {};

  if (name.length < 2) fieldErrors.name = "Add your full name.";
  if (!EMAIL.test(email)) fieldErrors.email = "Add a work email like you@company.co.uk.";
  if (company.length < 2) fieldErrors.company = "Add your company name.";
  if (!service) fieldErrors.service = "Pick the service closest to what you need.";
  if (!budget) fieldErrors.budget = "Pick the range closest to your monthly budget.";
  if (brief.length < 20)
    fieldErrors.brief = "Give us a sentence or two about what you need.";

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Fix the fields marked below and send it again.",
      fieldErrors,
    };
  }

  console.log("[contact]", { name, email, company, phone, service, budget, brief });

  return {
    status: "success",
    message: `Thanks ${name.split(" ")[0]}, we have got your brief. We reply within two working days.`,
    fieldErrors: {},
  };
}
