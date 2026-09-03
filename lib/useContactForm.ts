"use client";

import { useCallback, useState } from "react";
import { DB_PATHS, getDb, getRtdb } from "./firebase";
import { contactCopy } from "@/content/copy";

export type ContactFields = {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
};

export type FieldErrors = Partial<Record<keyof ContactFields, string>>;

export const emptyContact: ContactFields = {
  name: "",
  email: "",
  projectType: "",
  budget: "",
  message: "",
};

/** Deliberately loose — an over-strict pattern rejects real addresses. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validate(fields: ContactFields): FieldErrors {
  const errors: FieldErrors = {};
  if (!fields.name.trim()) errors.name = contactCopy.errors.name;
  if (!EMAIL.test(fields.email.trim())) errors.email = contactCopy.errors.email;
  if (!fields.message.trim()) errors.message = contactCopy.errors.message;
  return errors;
}

export type Status = "idle" | "submitting" | "sent" | "error";

export function useContactForm() {
  const [fields, setFields] = useState<ContactFields>(emptyContact);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  const setField = useCallback((key: keyof ContactFields, value: string) => {
    setFields((f) => ({ ...f, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
    setStatus((s) => (s === "sent" || s === "error" ? "idle" : s));
  }, []);

  const submit = useCallback(async () => {
    const found = validate(fields);
    setErrors(found);
    if (Object.keys(found).length > 0) return false;

    const [db, { push, ref, serverTimestamp, set }] = await Promise.all([getDb(), getRtdb()]);
    if (!db) {
      setStatus("error");
      return false;
    }

    setStatus("submitting");
    try {
      // Shape matches database.rules.json and admin_page.dart exactly:
      // name, email, message, timestamp and status are all required.
      const entry = push(ref(db, DB_PATHS.contactSubmissions));
      await set(entry, {
        name: fields.name.trim(),
        email: fields.email.trim(),
        projectType: fields.projectType.trim(),
        budget: fields.budget.trim(),
        message: fields.message.trim(),
        timestamp: serverTimestamp(),
        status: "new",
        id: entry.key,
      });
      setFields(emptyContact);
      setStatus("sent");
      return true;
    } catch {
      setStatus("error");
      return false;
    }
  }, [fields]);

  return { fields, errors, status, setField, submit };
}
