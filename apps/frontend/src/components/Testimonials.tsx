import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Section from "./Section";
import SectionTitle from "./SectionTitle";

const testimonials = [
  {
    name: "Marie Dubois",
    role: "Directrice Service Client",
    company: "TechVision",
    content:
      "AlloKoli a transformé notre service client. La qualité des interactions est remarquable.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    alt: "Portrait de Marie Dubois",
  },
  {
    name: "Thomas Bernard",
    role: "CEO",
    company: "InnovTech",
    content:
      "Une solution innovante qui nous a permis de réduire nos coûts de 40% tout en améliorant la satisfaction client.",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    alt: "Portrait de Thomas Bernard",
  },
  {
    name: "Sophie Martin",
    role: "Responsable Innovation",
    company: "DataFrance",
    content:
      "L'intégration a été simple et les résultats sont au-delà de nos attentes.",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    alt: "Portrait de Sophie Martin",
  },
];

const Testimonials = () => {
  // Testimonial carousel
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(
      () => setIdx((p) => (p + 1) % testimonials.length),
      4000,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <Section className="bg-bgLite">
      <SectionTitle>Ils nous font confiance</SectionTitle>
      <div className="relative h-[400px] mt-12">
        <AnimatePresence initial={false}>
          {testimonials.map((testimonial, index) =>
            idx === index ? (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-white p-8 rounded-2xl shadow-lg flex flex-col h-full justify-center"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.alt}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-primary">
                      {testimonial.name}
                    </h3>
                    <p className="text-gray-600">{testimonial.role}</p>
                    <p className="text-primary">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-lg italic">
                  "{testimonial.content}"
                </p>
              </motion.div>
            ) : null,
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
};

export default Testimonials;
