# Site de apresentação — Géssica Lima · GL Fight
Site estático (HTML + CSS + JS puro, sem build) da atleta e professora de Muay Thai Géssica Lima, dona da GL Fight.

## Abrir
`npm run dev` e acesse `http://localhost:5174/`. Para o link da loja funcionar localmente, mantenha o servidor da loja na porta 5173.

## Conteúdo
- **Contatos:** edite `perfil` no topo de `js/atleta.js` (Instagram e WhatsApp). Os botões só aparecem quando preenchidos.
- **Textos:** direto no `index.html`. Fonte das informações: card de divulgação da Karasu (ago/2025) enviado pela cliente.
- **Fotos:** `img/fotos/` (cada uma em `.jpg` + `.webp`). **Vídeo:** `media/campea.mp4` + `media/campea-poster.jpg`.

## Seções
Hero · Marquee · História · Vídeo da vitória (pinado, cresce com o scroll) · Conquistas · Manifesto · Trajetória & formação · Galeria horizontal + lightbox · Aulas · A marca · Rodapé.
Animações respeitam `prefers-reduced-motion` e no celular o vídeo e a galeria viram blocos simples.

## Publicação
Publique esta pasta. Antes, troque os links `../GLfight/index.html` pelo endereço público da loja e use URL absoluta em `og:image`.
