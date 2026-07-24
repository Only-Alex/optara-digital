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
  const budget = String(formData.get("budget") ?? "").trim();
  const brief = String(formData.get("brief") ?? "").trim();

  const fieldErrors: Record<string, string> = {};

  if (name.length < 2) fieldErrors.name = "Add your full name.";
  if (!EMAIL.test(email)) fieldErrors.email = "Use a work email like you@brand.com.";
  if (company.length < 2) fieldErrors.company = "Add the brand you work on.";
  if (!budget) fieldErrors.budget = "Pick the range closest to your monthly spend.";
  if (brief.length < 20) fieldErrors.brief = "Give us at least a sentence or two to work with.";

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Fix the fields marked below and send it again.",
      fieldErrors,
    };
  }

  console.log("[contact]", { name, email, company, budget, brief });

  return {
    status: "success",
    message: `Thanks ${name.split(" ")[0]}. We read every brief and reply within two working days.`,
    fieldErrors: {},
  };
}
