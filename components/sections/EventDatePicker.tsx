"use client";

import DatePicker, { registerLocale } from "react-datepicker";
import { ptBR } from "date-fns/locale/pt-BR";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("pt-BR", ptBR);

/**
 * Isolado num arquivo próprio para o `react-datepicker` + `date-fns` saírem
 * do bundle inicial (~89KB). Só carrega quando o usuário toca no campo de data.
 */
export default function EventDatePicker({
  value,
  onChange,
}: {
  value?: string;
  onChange: (isoDate: string) => void;
}) {
  return (
    <DatePicker
      selected={value ? new Date(value) : null}
      onChange={(date: Date | null) => onChange(date ? date.toISOString() : "")}
      dateFormat="dd/MM/yyyy"
      locale="pt-BR"
      minDate={new Date()}
      placeholderText="__/__/____"
      className="field-input"
      calendarClassName="maguila-datepicker"
      showPopperArrow={false}
      autoFocus
    />
  );
}
