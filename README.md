# ldf_planejados

Projeto de site em Framer, com infraestrutura de agentes para design e revisão.

## Stack de agentes

| Ferramenta | Papel | Escopo |
|---|---|---|
| [@framer/agent](https://www.npmjs.com/package/@framer/agent) | Controle programático do projeto Framer | global |
| [Impeccable](https://github.com/pbakaus/impeccable) | Orientação de design, 23 comandos, 59 detectores | projeto |
| [Caveman](https://github.com/JuliusBrussee/caveman) | Proxy de compressão de input | global |
| [taste-skill](https://github.com/Leonxlnx/taste-skill) | `brandkit` + `full-output-enforcement` | projeto |

## Restaurar o ambiente em outra máquina

As skills não são versionadas (ver `.gitignore`). Para reinstalar:

```bash
# Framer
npx @framer/agent@latest setup

# Impeccable (escopo de projeto, com hooks)
npx impeccable install --providers=claude --scope=project

# brandkit + full-output-enforcement (a partir do skills-lock.json)
npx skills add https://github.com/Leonxlnx/taste-skill \
  --skill brandkit --skill full-output-enforcement \
  --agent claude-code --copy -y

# Caveman (CLI + binários)
npm install -g @caveman-ai/cli && caveman setup --install
```

Requer Node.js 24+.

## Notas

- O proxy do Caveman só age em sessões abertas com `caveman claude`, não com `claude` direto.
- `caveman setup --agent-native claude` falha nesta máquina (postflight indisponível).
