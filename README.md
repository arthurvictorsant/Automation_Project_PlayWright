# AutomationExercise - Playwright Automation

Projeto de automação de testes E2E do site [AutomationExercise](https://automationexercise.com) utilizando Playwright com TypeScript e o padrão Page Object Model (POM).

## 🚀 Tecnologias

- **[Playwright](https://playwright.dev/)** - Framework de automação E2E
- **[TypeScript](https://www.typescriptlang.org/)** - Linguagem de programação
- **Node.js** - Runtime JavaScript
- **Page Object Model** - Padrão de design para organização de testes

## 📁 Estrutura do Projeto

```
automation-exercise/
├── src/
│   ├── pages/              # Page Objects
│   │   ├── BasePage.ts     # Classe base com métodos comuns
│   │   ├── HomePage.ts     # Página inicial
│   │   ├── LoginPage.ts    # Página de login/signup
│   │   ├── ProductsPage.ts # Página de produtos
│   │   └── CartPage.ts     # Página do carrinho
│   └── utils/              # Utilitários
│       └── authHelper.ts   # Helper para autenticação
├── tests/                  # Arquivos de teste
│   ├── home.spec.ts
│   ├── login.spec.ts
│   ├── products.spec.ts
│   └── cart.spec.ts
├── playwright.config.ts    # Configuração do Playwright
├── tsconfig.json          # Configuração do TypeScript
└── package.json
```

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd automation-exercise
```

2. Instale as dependências:
```bash
npm install
```

3. Instale os browsers do Playwright:
```bash
npx playwright install
```

## ▶️ Executando os Testes

### Comandos Básicos

```bash
# Rodar todos os testes
npm test

# Rodar todos os testes em modo headed (com interface gráfica)
npm run test:headed

# Rodar testes em modo UI (interface interativa)
npm run test:ui

# Rodar testes em modo debug
npm run test:debug

# Ver relatório dos testes
npm run report
```

### Comandos Específicos

```bash
# Rodar testes de uma suite específica
npx playwright test home.spec.ts
npx playwright test login.spec.ts
npx playwright test products.spec.ts
npx playwright test cart.spec.ts

# Rodar um teste específico por nome
npx playwright test -g "Should login with valid credentials"

# Rodar testes em um browser específico
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Rodar testes com trace
npx playwright test --trace on
```

## 📄 Page Objects Criados

### BasePage
Classe base contendo métodos comuns reutilizáveis:
- `goto()` - Navegação
- `click()` - Clique em elementos
- `fill()` - Preencher campos
- `getText()` - Obter texto
- `isVisible()` - Verificar visibilidade
- `waitForElement()` - Aguardar elementos
- E outros métodos auxiliares

### HomePage
Página inicial do site com funcionalidades:
- Navegação para outras páginas (Products, Cart, Login)
- Verificação de usuário logado
- Logout
- Subscribe newsletter
- Delete account

### LoginPage
Página de login e signup:
- Login com email e senha
- Signup com nome e email
- Validação de mensagens de erro

### ProductsPage
Página de listagem de produtos:
- Busca de produtos
- Listagem de produtos
- Adicionar produtos ao carrinho
- Ver detalhes de produtos
- Adicionar múltiplos produtos
- Navegação para carrinho

### CartPage
Página do carrinho de compras:
- Visualizar produtos no carrinho
- Obter informações de produtos (nome, preço, quantidade, total)
- Remover produtos (por índice ou nome)
- Remover todos os produtos
- Calcular total
- Proceed to checkout
- Verificar se carrinho está vazio

## 🔐 Autenticação

O projeto utiliza um helper de autenticação (`AuthHelper`) para facilitar o login nos testes:

```typescript
import { AuthHelper } from '../src/utils/authHelper';

// Login simples
await AuthHelper.login(page);

// Login com credenciais específicas
await AuthHelper.login(page, 'custom@email.com', 'password123');

// Login e navegar para produtos
await AuthHelper.loginAndGoToProducts(page);
```

## 📝 Exemplo de Teste

```typescript
import { test, expect } from '@playwright/test';
import { ProductsPage } from '../src/pages/ProductsPage';
import { CartPage } from '../src/pages/CartPage';
import { AuthHelper } from '../src/utils/authHelper';

test.describe('Cart Tests', () => {
  let productsPage: ProductsPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    
    await AuthHelper.loginAndGoToProducts(page);
  });

  test('Should add product to cart', async () => {
    await productsPage.addProductToCartByIndex(0);
    await productsPage.goToCartFromModal();

    const count = await cartPage.getCartItemsCount();
    expect(count).toBe(1);
  });
});
```

## 🎯 Padrões e Boas Práticas

### Page Object Model (POM)
- Cada página do site tem sua própria classe
- Locators são declarados como `readonly` no topo da classe
- Métodos são organizados por categoria (Navigation, Actions, Validations)
- Herança da `BasePage` para reutilização de código

### Nomenclatura
- **Page Objects**: `NomePage.ts` (ex: `HomePage.ts`)
- **Testes**: `nome.spec.ts` (ex: `home.spec.ts`)
- **Métodos de ação**: `doSomething()` (ex: `addToCart()`)
- **Métodos de navegação**: `goToSomewhere()` (ex: `goToProducts()`)
- **Métodos de validação**: `isSomething()` ou `getSomething()` (ex: `isVisible()`)

### Locators
- Preferência por `getByRole()` para melhor acessibilidade
- Uso de `data-qa` attributes quando disponível
- Fallback para CSS selectors quando necessário
- Locators específicos evitam "strict mode violations"

### Testes
- Padrão AAA (Arrange, Act, Assert)
- Uso de `beforeEach` para setup comum
- Testes independentes e isolados
- Nomes descritivos que explicam o comportamento esperado

## 🛠️ Configuração

### playwright.config.ts
- Configurado para rodar em Chromium, Firefox e WebKit
- Screenshots apenas em falhas
- Vídeos retidos apenas em falhas
- Trace em primeira retry
- Reporters: HTML e List

### tsconfig.json
- Target: ES2020
- Strict mode habilitado
- Module: CommonJS
- Tipos do Playwright incluídos

## 📊 Relatórios

Após executar os testes, você pode visualizar o relatório HTML:

```bash
npm run report
```

O relatório inclui:
- Status de cada teste (passou/falhou)
- Screenshots de falhas
- Traces para debug
- Tempo de execução
- Logs detalhados

## 🐛 Debug

Para debugar testes, use uma das opções:

```bash
# Debug mode do Playwright
npx playwright test --debug

# UI Mode (recomendado)
npx playwright test --ui

# Codegen para gerar locators
npx playwright codegen https://automationexercise.com
```

## 📚 Recursos Úteis

- [Documentação do Playwright](https://playwright.dev/docs/intro)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)

## 🤝 Contribuindo

1. Crie um branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
2. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
3. Push para o branch (`git push origin feature/NovaFuncionalidade`)
4. Abra um Pull Request

## ✅ Status do Projeto

- [x] BasePage criada
- [x] HomePage implementada e testada
- [x] LoginPage implementada e testada
- [x] ProductsPage implementada e testada
- [x] CartPage implementada e testada
- [x] AuthHelper criado
- [ ] SignupPage
- [ ] CheckoutPage
- [ ] ContactUsPage
- [ ] ProductDetailPage

## 📄 Licença

Este projeto foi criado para fins educacionais.

---

**Desenvolvido com ❤️ usando Playwright + TypeScript**
