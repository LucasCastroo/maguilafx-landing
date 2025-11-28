"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, ContactFormData } from "@/lib/validations";
import { useState } from "react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    // Aqui você conecta com API route, e-mail, CRM, etc.
    console.log("Contato enviado:", data);
    setSubmitted(true);
    reset();
  };

  return (
    <form className="space-y-3 text-xs" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-[11px] text-white/70">Nome*</label>
          <input
            className="w-full rounded-lg border border-white/15 bg-black/60 px-3 py-2 outline-none focus:border-maguila-gold"
            {...register("name")}
            placeholder="Seu nome"
          />
          {errors.name && (
            <p className="mt-1 text-[11px] text-red-400">
              {errors.name.message}
            </p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-[11px] text-white/70">
            E-mail*
          </label>
          <input
            className="w-full rounded-lg border border-white/15 bg-black/60 px-3 py-2 outline-none focus:border-maguila-gold"
            {...register("email")}
            placeholder="seuemail@exemplo.com"
          />
          {errors.email && (
            <p className="mt-1 text-[11px] text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-[11px] text-white/70">
            Telefone / WhatsApp*
          </label>
          <input
            className="w-full rounded-lg border border-white/15 bg-black/60 px-3 py-2 outline-none focus:border-maguila-gold"
            {...register("phone")}
            placeholder="(63) 9 0000-0000"
          />
          {errors.phone && (
            <p className="mt-1 text-[11px] text-red-400">
              {errors.phone.message}
            </p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-[11px] text-white/70">
            Tipo de evento*
          </label>
          <input
            className="w-full rounded-lg border border-white/15 bg-black/60 px-3 py-2 outline-none focus:border-maguila-gold"
            {...register("eventType")}
            placeholder="Show, festival, corporativo..."
          />
          {errors.eventType && (
            <p className="mt-1 text-[11px] text-red-400">
              {errors.eventType.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-[11px] text-white/70">
            Data do evento
          </label>
          <input
            type="date"
            className="w-full rounded-lg border border-white/15 bg-black/60 px-3 py-2 text-white/80 outline-none focus:border-maguila-gold"
            {...register("date")}
          />
        </div>
        <div>
          <label className="mb-1 block text-[11px] text-white/70">
            Cidade
          </label>
          <input
            className="w-full rounded-lg border border-white/15 bg-black/60 px-3 py-2 outline-none focus:border-maguila-gold"
            {...register("city")}
            placeholder="Cidade/UF"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-[11px] text-white/70">
          Detalhes do evento*
        </label>
        <textarea
          rows={4}
          className="w-full rounded-lg border border-white/15 bg-black/60 px-3 py-2 outline-none focus:border-maguila-gold"
          {...register("message")}
          placeholder="Quantidade de público, local, estrutura de palco, bandas, etc."
        />
        {errors.message && (
          <p className="mt-1 text-[11px] text-red-400">
            {errors.message.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 w-full rounded-full border border-maguila-gold bg-maguila-gold px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-black shadow-glow transition hover:bg-maguila-goldSoft disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Enviando..." : "Enviar mensagem"}
      </button>

      {submitted && (
        <p className="mt-2 text-[11px] text-green-400">
          Mensagem enviada! Em breve entraremos em contato.
        </p>
      )}
    </form>
  );
}
