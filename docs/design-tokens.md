# Design tokens — Géssica Lima · GL Fight

Tokens definidos em `:root` no `css/atleta.css`.

| Grupo | Escolha |
|---|---|
| Cores | `--bg #08070a`, `--surface #15121b`, `--violet #8b2cf5` (roxo do logo, `#7C36AF`, um pouco mais vivo para tela), `--violet-hi #b98bff` (roxo para texto) |
| Tipografia | Display: Big Shoulders Display 900 (pôster de luta). Texto: Archivo. Detalhe: "มวยไทย" (Muay Thai em tailandês) em Noto Sans Thai, carregando só esses glifos |
| Escala | Tipografia e espaçamento fluidos com `clamp()` (`--step-*`, `--space-*`) |
| Movimento | `--ease-out cubic-bezier(.16,1,.3,1)`, `--ease-io cubic-bezier(.65,0,.35,1)`. Interações ≤ 200 ms; entradas de seção 0,9–1,3 s. Só `transform`, `opacity` e `clip-path` |
| Raio | `--radius 4px` (cantos quase retos, visual de ringue) |

Componentes: sem biblioteca, tudo em vanilla JS/CSS (o site é estático).
