import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Informe seu nome."),
  email: z.string().email("E-mail inválido."),
  phone: z.string().min(8, "Informe um telefone válido."),
  eventType: z.string().min(2, "Informe o tipo de evento."),
  date: z.string().optional(),
  city: z.string().optional(),
  message: z.string().min(5, "Descreva brevemente o evento."),
});

export type ContactFormData = z.infer<typeof contactSchema>;
