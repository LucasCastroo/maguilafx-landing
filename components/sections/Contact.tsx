"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import DatePicker, { registerLocale } from "react-datepicker";
import { ptBR } from "date-fns/locale/pt-BR";
import "react-datepicker/dist/react-datepicker.css";
import { WHATSAPP_URL, INSTAGRAM_URL } from "@/lib/data";

registerLocale("pt-BR", ptBR);

const contatoSchema = z.object({
  nome: z.string().min(2, "Nome obrigatório"),
  cidade: z.string().min(2, "Cidade obrigatória"),
  estado: z.string().min(2, "Estado obrigatório"),
  tipoEvento: z.string().min(2, "Informe o tipo de evento"),
  data: z.string().optional(),
  descricao: z.string().min(5, "Conte um pouco sobre o evento"),
});

type ContatoFormData = z.infer<typeof contatoSchema>;

const EASE = [0.22, 1, 0.36, 1] as const;

export function Contact() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContatoFormData>({
    resolver: zodResolver(contatoSchema),
  });

  const onSubmit = (data: ContatoFormData) => {
    let dataFormatada = "Não definida";
    if (data.data) {
      const dateObj = new Date(data.data);
      if (!isNaN(dateObj.getTime())) {
        const day = String(dateObj.getDate()).padStart(2, "0");
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const year = dateObj.getFullYear();
        dataFormatada = `${day}/${month}/${year}`;
      } else {
        dataFormatada = String(data.data);
      }
    }

    const message = `*Olá, equipe MaguilaFX!* 👋\n\nEstou vindo do site e gostaria de solicitar um orçamento para um evento com efeitos especiais.\n\n*Nome:* ${data.nome}\n*Cidade e Estado do Evento:* ${data.cidade}/${data.estado}\n*Tipo de Evento:* ${data.tipoEvento}\n*Data Prevista:* ${dataFormatada}\n\n*Descrição do Evento:*\n${data.descricao}`;

    const whatsappUrl = `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
    reset();
  };

  return (
    <section id="contato" className="relative overflow-hidden bg-coal py-24 md:py-36">
      {/* brilho quente de fundo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-maguilaRed/10 blur-[140px]"
      />

      <div className="page-container relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <p className="kicker mb-6">Contato</p>
          <h2 className="display-title max-w-4xl text-[clamp(2.8rem,7.5vw,6.5rem)]">
            Vamos <span className="text-maguilaRed">incendiar</span> o seu
            próximo evento?
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-16 lg:grid-cols-[1fr_1.3fr] lg:gap-24">
          {/* Canais diretos */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            className="flex flex-col justify-between gap-10"
          >
            <div className="space-y-8">
              <p className="max-w-md text-base leading-relaxed text-bone/60">
                Conte o que você está planejando. Nosso time analisa o evento e
                responde com uma proposta de efeitos sob medida — direto no seu
                WhatsApp.
              </p>

              <div>
                <p className="field-label">WhatsApp</p>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display text-2xl uppercase text-bone transition-colors hover:text-maguilaRed md:text-3xl"
                >
                  +55 63 9225-2302
                </a>
              </div>

              <div>
                <p className="field-label">Instagram</p>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display text-2xl uppercase text-bone transition-colors hover:text-maguilaRed md:text-3xl"
                >
                  @maguilafx
                </a>
              </div>

              <div>
                <p className="field-label">Atendimento</p>
                <p className="text-sm leading-relaxed text-bone/60">
                  Produtores, cerimonialistas e artistas.
                  <br />
                  Atuação em todo o Brasil*
                </p>
              </div>
            </div>

            <p className="text-[11px] leading-relaxed text-bone/30">
              *Consulte condições de deslocamento e disponibilidade de datas.
            </p>
          </motion.div>

          {/* Formulário */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <div>
              <label className="field-label">Nome completo</label>
              <input
                type="text"
                {...register("nome")}
                className="field-input"
                placeholder="Como devemos te chamar?"
              />
              {errors.nome && <p className="field-error">{errors.nome.message}</p>}
            </div>

            <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
              <div>
                <label className="field-label">Cidade do evento</label>
                <input
                  type="text"
                  {...register("cidade")}
                  className="field-input"
                  placeholder="Cidade"
                />
                {errors.cidade && (
                  <p className="field-error">{errors.cidade.message}</p>
                )}
              </div>
              <div>
                <label className="field-label">Estado</label>
                <input
                  type="text"
                  {...register("estado")}
                  className="field-input"
                  placeholder="UF"
                />
                {errors.estado && (
                  <p className="field-error">{errors.estado.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <label className="field-label">Tipo de evento</label>
                <input
                  type="text"
                  {...register("tipoEvento")}
                  className="field-input"
                  placeholder="Show, casamento, festival..."
                />
                {errors.tipoEvento && (
                  <p className="field-error">{errors.tipoEvento.message}</p>
                )}
              </div>
              <div>
                <label className="field-label">Data (se já tiver)</label>
                <Controller
                  control={control}
                  name="data"
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value ? new Date(field.value) : null}
                      onChange={(date: Date | null) =>
                        field.onChange(date ? date.toISOString() : "")
                      }
                      dateFormat="dd/MM/yyyy"
                      locale="pt-BR"
                      minDate={new Date()}
                      placeholderText="__/__/____"
                      className="field-input"
                      calendarClassName="maguila-datepicker"
                      showPopperArrow={false}
                    />
                  )}
                />
              </div>
            </div>

            <div>
              <label className="field-label">Descrição do evento</label>
              <textarea
                rows={4}
                {...register("descricao")}
                className="field-input"
                placeholder="Público estimado, local, estrutura de palco, tipo de atração..."
              />
              {errors.descricao && (
                <p className="field-error">{errors.descricao.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="btn-primary w-full !py-5"
                disabled={isSubmitting}
              >
                <span>{isSubmitting ? "Enviando..." : "Enviar pelo WhatsApp"}</span>
                <span aria-hidden>→</span>
              </button>
              <p className="mt-3 text-center text-[11px] text-bone/30">
                Ao enviar, você autoriza contato via WhatsApp para continuidade
                do atendimento.
              </p>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
