# Frontend

## Stack
- Vue.js 3, TypeScript
- Vite (build tool)
- pnpm (package manager)
- Gov.br Design System
- Tailwind CSS

## Comandos
```bash
# Build
pnpm build
# Test
pnpm test
# Run local
pnpm dev
```

## Estrutura
```
src/               # código fonte
src/components/    # componentes Vue
src/views/         # páginas
tests/             # testes
public/            # assets estáticos
Dockerfile         # container
```

## Convenções
- Vue: PascalCase components, camelCase props
- TypeScript strict mode
- Commits: conventional commits (feat/fix/chore)
- Branches: develop → release/dev → release/qa → release/prd → main
