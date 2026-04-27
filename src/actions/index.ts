import { z } from "astro/zod";
import { defineAction, ActionError } from "astro:actions";
import { FORM_APIKEY, FORM_URL } from 'astro:env/server';

async function sendEmail(form: string, params: Record<string, string | string[]>) {
  const response = await fetch(FORM_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': FORM_APIKEY,
    },
    body: JSON.stringify({ form, params }),
  });

  if (!response.ok) {
    throw new Error('Erro ao enviar formulário');
  }
}


export const server = {
  enviarContato: defineAction({
    input: z.object({
      form: z.string(),
      params: z.object({
        nome: z.string().min(1, "O nome é obrigatório"),
        telefone: z.string(),
        email: z.string().min(1, "O email é obrigatório"),
        cidade: z.string().min(1, "A cidade é obrigatória"),
      })
    }),
    handler: async (input) => {
      try {
        // await sendEmail(input.form, input.params);

        await new Promise((resolve) => setTimeout(resolve, 3000)); // Simula um atraso para teste

        console.log("Contato enviado:", input.params);
        return { success: true, message: "Contato enviado com sucesso!" };
      } catch (error) {
        console.error("Erro ao enviar contato:", error);
        throw new ActionError({
          message: "Erro ao enviar mensagem. Tente novamente ou entre em contato por telefone.",
          code: "BAD_REQUEST",
        });
      }
    }
  })
}
