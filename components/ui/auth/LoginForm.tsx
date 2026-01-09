"use client";

import React, { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { TextInput } from "@/components/ui/TextInput";
import { Button } from "@/components/ui/Button";
import { apiLogin } from "@/lib/api";

type LoginFormState = {
  email: string;
  password: string;
};

type LoginFormErrors = Partial<Record<keyof LoginFormState | "global", string>>;

function isValidEmail(email: string): boolean {
  return /\S+@\S+\.\S+/.test(email);
}

function validate(values: LoginFormState): LoginFormErrors {
  const errors: LoginFormErrors = {};
  const email = values.email.trim();

  if (!email) errors.email = "E-mail é obrigatório.";
  else if (!isValidEmail(email)) errors.email = "Informe um e-mail válido.";

  if (!values.password) errors.password = "Senha é obrigatória.";

  return errors;
}

export function LoginForm(): JSX.Element {
  const router = useRouter();
  const [values, setValues] = useState<LoginFormState>({ email: "", password: "" });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return Object.keys(validate(values)).length === 0 && !isSubmitting;
  }, [values, isSubmitting]);

  function setField<K extends keyof LoginFormState>(field: K, value: LoginFormState[K]) {
    const next = { ...values, [field]: value };
    setValues(next);
    setErrors((prev) => ({ ...prev, [field]: undefined, global: undefined }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const result = await apiLogin({
        email: values.email.trim(),
        password: values.password,
      });

      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      toast.success("Login realizado com sucesso.");
      router.replace("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Não foi possível realizar login.";
      setErrors({ global: message });
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {errors.global ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errors.global}
        </div>
      ) : null}

      <TextInput
        id="email"
        name="email"
        label="E-mail"
        type="email"
        value={values.email}
        placeholder="voce@exemplo.com"
        autoComplete="email"
        disabled={isSubmitting}
        error={errors.email}
        onChange={(v) => setField("email", v)}
      />

      <TextInput
        id="password"
        name="password"
        label="Senha"
        type="password"
        value={values.password}
        placeholder="••••••••"
        autoComplete="current-password"
        disabled={isSubmitting}
        error={errors.password}
        onChange={(v) => setField("password", v)}
      />

      <Button type="submit" isLoading={isSubmitting} disabled={!canSubmit}>
        Entrar
      </Button>
    </form>
  );
}
