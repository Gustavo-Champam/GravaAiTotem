# GRAVA.AI · Totem de Personalização com IA

Protótipo navegável de uma experiência de compra de brindes com personalização
por **Inteligência Artificial (Google Gemini)**, no formato **totem vertical (9:16)**.
Visual escuro premium com a identidade da **GRAVA.AI**. Feito para gravação de
vídeo de demonstração.

## ▶️ Como rodar

```bash
npm install      # primeira vez
npm run dev      # abre em http://localhost:5173
```

Para gravar o vídeo, abra `http://localhost:5173` em **tela cheia** (F11).
Em um monitor comum aparece como um "totem na sala"; numa tela vertical (totem
real) ele ocupa a tela inteira automaticamente.

```bash
npm run build && npm run preview   # versão de produção (opcional)
```

## 🤖 Inteligência Artificial (Gemini)

A etapa de personalização usa o **Google Gemini de verdade** (`gemini-2.5-flash`)
para a assistente **Grava** criar estampas exclusivas sob medida para a ocasião.

- A chave fica em `.env.local` (`VITE_GEMINI_API_KEY`) — **não versionada**.
- **Fallback automático:** se a internet/API falhar ou estourar a cota, o sistema
  cai num modo de estampas inteligentes local — **nunca trava durante a gravação**.
- Quando a IA real responde, aparece o selo *"Gerado por IA · Gemini"*.
- Para trocar o modelo: `VITE_GEMINI_MODEL` no `.env.local`.

> ⚠️ **Segurança:** a chave de API foi compartilhada em texto e fica embutida no
> app (client-side). Após a demonstração, **gere uma nova chave** no Google AI
> Studio e descarte esta. Em produção, as chamadas devem passar por um backend,
> nunca direto do navegador.
>
> ℹ️ O modelo `gemini-2.0-flash` está com cota **0** neste projeto (erro 429); por
> isso o padrão é `gemini-2.5-flash`, que funciona no nível gratuito.

## 🧭 A jornada (fluxo da demo)

1. **Tela de espera** — logo GRAVA.AI. *Toque para começar*.
2. **Catálogo** — grade de produtos com foto, nome, preço e cores; filtros por categoria.
3. **Produto** — foto grande, seleção de cor/modelo, especificações e preço.
4. **Personalização com IA** — a **Grava** conversa, você escolhe a ocasião, a IA
   gera **3 estampas exclusivas**, você escolhe uma e pode **gravar um nome/frase**.
   A pré-visualização aplica a arte no produto em tempo real.
5. **Resumo / Pagamento** — pedido completo, PIX (5% off) ou Cartão, *Finalizar compra*.
6. **Sucesso** — confirmação com número do pedido e confete. *Iniciar novo pedido*.

## 🗂️ Estrutura

```
public/products/      Fotos reais dos produtos (otimizadas)
src/
  pages/              Idle, Catalog, Product, Personalize, Checkout, Success
  components/         GravaOrb, MockupPreview, EstampaArt, ProductCard, Logo (hexágono)
  data/               products.ts (catálogo) · estampas.ts (temas + fallback de IA)
  lib/                gemini.ts (cliente Gemini) · utils, useTypewriter
  store/              useStore.ts (estado/pedido — Zustand)
  index.css           Design system (tema escuro + glow ciano GRAVA.AI)
```

## 🛠️ Stack

Vite · React + TypeScript · Tailwind CSS v4 · Framer Motion · React Router ·
Zustand · Google Gemini API.

## ✏️ Ajustes rápidos

- **Produtos / preços / cores:** `src/data/products.ts`
- **Estampas e temas (fallback):** `src/data/estampas.ts`
- **Prompt / modelo da IA:** `src/lib/gemini.ts` e `.env.local`
- **Cores da marca:** bloco `@theme` em `src/index.css`
- **Textos da Grava:** `src/pages/Personalize.tsx`
