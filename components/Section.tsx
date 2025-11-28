import { ReactNode } from "react";
import { motion } from "framer-motion";

type SectionProps = {
  id?: string;
  className?: string;
  children: ReactNode;
};

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function Section({ id, className, children }: SectionProps) {
  return (
    <motion.section
      id={id}
      className={`py-20 px-4 md:px-8 max-w-6xl mx-auto ${className ?? ""}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
    >
      {children}
    </motion.section>
  );
}
