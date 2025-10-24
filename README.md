# RER-DPG - Core-Frontend

## Sobre o Módulo

O **Core-Frontend** é a interface web moderna do RER-DPG, desenvolvida em Vue.js 3 com Vite. Oferece uma experiência de usuário responsiva e intuitiva para o cadastro e visualização de dados ambientais rurais, integrando-se perfeitamente com o componente de mapa e os serviços de backend.

**Principais características:**

- 🌐 Interface web moderna com Vue.js 3
- ⚡ Build otimizado com Vite
- 🗺️ Integração com componente de mapa interativo
- 🔄 Integração completa com APIs do backend
- 🎨 Interface customizável e acessível
- 🔧 Geração automática de configurações

---

## Pré-requisitos

- **Docker** versão 24+ ([instalação](https://docs.docker.com/engine/install/))
- **Docker Compose** versão 2.20 ou superior ([instalação](https://docs.docker.com/compose/install/linux/#install-using-the-repository))
- **Node.js** versão 18+ (para desenvolvimento local)
- **Git** ([instalação](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git))

---

## Instalação e Execução

### Execução Integrada

Este módulo é executado automaticamente como parte do sistema RER-DPG principal. Para executar o sistema completo:

1. **No diretório principal do projeto:**
   ```bash
   ./start.sh
   ```

### Desenvolvimento Local

#### Configuração de Acesso ao Repositório Privado

Este projeto possui uma dependência privada (`dpg-mapa`) hospedada em um repositório Git. Para que o comando `npm install` funcione, você precisa configurar seu Git local para autenticar-se nesse repositório.

Execute o seguinte comando uma única vez em sua máquina, substituindo `<SEU_USUARIO>` e `<SEU_TOKEN>` por suas credenciais de acesso:

```bash
git config --global url."https://<SEU_USUARIO>:<SEU_TOKEN>@inovacao.dataprev.gov.br".insteadOf "https://inovacao.dataprev.gov.br"
```

Após executar este comando, o Git irá automaticamente usar suas credenciais ao buscar dependências do `inovacao.dataprev.gov.br`.

#### Instalação de dependências

```bash
npm install
```

#### Desenvolvimento com Hot-Reload

```bash
npm run dev
```

#### Build de Produção

```bash
npm run build
```

### Execução com Docker

```bash
docker-compose up -d
```

O serviço estará disponível na porta 5000.

---

## Acesso aos Serviços

Após a execução, o frontend estará disponível:

- **Frontend Principal:** http://localhost/<BASE_URL>

> A variável `<BASE_URL>` é definida nas configurações do ambiente.

---

## Funcionalidades

### Interface Principal

- **Cadastro de Imóveis:** Interface completa para registro de propriedades rurais
- **Visualização de Mapas:** Integração com componente de mapa interativo
- **Gerenciamento de Dados:** CRUD para entidades do sistema
- **Autenticação:** Integração com sistema de autenticação Keycloak

### Geração de Configurações

O sistema possui um script que coleta automaticamente configurações durante o build:

```bash
./scripts/generate-config.sh
```

Este script consolida informações de:
- Arquivos `.env`
- `package.json`
- Configurações do mapa
- Outras configurações relevantes

### Tecnologias

- Vue.js 3 (Composition API)
- Vite (Build tool)
- TypeScript
- Tailwind CSS
- Vue Router
- Axios (HTTP client)

---

## Estrutura do Projeto

```
Core-Frontend/
├── public/
│   ├── images/                 # Imagens estáticas
│   └── favicon.ico
├── scripts/
│   └── generate-config.sh      # Script de geração de configurações
├── src/
│   ├── adapters/               # Adaptadores de dados
│   ├── assets/                 # Assets estáticos
│   ├── components/             # Componentes Vue reutilizáveis
│   ├── config/                 # Arquivos de configuração
│   ├── context/                # Contextos da aplicação
│   ├── interfaces/             # Interfaces TypeScript
│   ├── lib/                    # Bibliotecas auxiliares
│   ├── router/                 # Configuração de rotas
│   ├── services/               # Serviços de API
│   ├── states/                 # Estados globais
│   ├── types/                  # Tipos TypeScript
│   ├── utils/                  # Utilitários
│   ├── views/                  # Páginas/Views
│   ├── App.vue                 # Componente raiz
│   └── main.ts                 # Ponto de entrada
├── tests/
│   └── unit/                   # Testes unitários
├── .env                        # Variáveis de ambiente
├── .env.development            # Variáveis de desenvolvimento
├── components.json             # Configuração de componentes
├── docker-compose.yaml         # Orquestração Docker
├── Dockerfile                  # Imagem Docker
├── nginx.conf                  # Configuração Nginx
├── package.json                # Dependências e scripts
├── tailwind.config.js          # Configuração Tailwind
├── tsconfig.json               # Configuração TypeScript
└── vite.config.ts              # Configuração Vite
```

---

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Testes unitários
npm run test

# Linting
npm run lint

# Formatação de código
npm run format
```

---

## Configurações

### Variáveis de Ambiente

Principais variáveis configuráveis no arquivo `.env`:

- `VITE_BASE_URL` - Context-Path do Frontend
- `VITE_DPG_URL` - URL do backend

### Integração com Mapa

O frontend integra-se com o componente `Map-Component` para funcionalidades de mapa:

```vue
<template>
  <MapaDpg
    :layers="layers"
    :options="options"
    @onDrawing="handleDrawing"
  />
</template>
```

---

## Gerenciamento de Containers

### Verificar Status

```bash
docker-compose ps
```

### Parar Serviços

```bash
docker-compose down
```

### Logs

```bash
docker-compose logs -f
```

---

## Licença

Este projeto é distribuído sob a [Licença MIT](https://opensource.org/license/mit).

---

## Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

**Desenvolvido pela Superintendência de Inteligência Artificial e Inovação da Dataprev**