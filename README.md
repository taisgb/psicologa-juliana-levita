# Landing Page - Psicóloga Juliana R. Levita

Este é o repositório do projeto da landing page para a psicóloga clínica Juliana R. Levita, especialista em Terapia Cognitivo-Comportamental (TCC). O site foi desenvolvido para ser moderno, responsivo, rápido e otimizado para SEO.

## 🚀 Visão Geral do Projeto

O objetivo desta landing page é apresentar os serviços da psicóloga Juliana R. Levita de forma profissional e acolhedora, fornecendo informações claras sobre sua abordagem terapêutica, respondendo a dúvidas comuns e facilitando o agendamento de consultas através de um Call to Action (CTA) direto para o WhatsApp.

### ✨ Principais Funcionalidades

* **Design Responsivo:** O layout se adapta perfeitamente a desktops, tablets e celulares.
* **Tema Claro e Escuro (Dark Mode):** Permite que o usuário escolha o tema visual de sua preferência, que é salva no navegador.
* **Otimização para SEO:** Estrutura semântica, meta tags detalhadas e dados estruturados (JSON-LD) para melhor posicionamento no Google.
* **Animações Sutis:** Utiliza a biblioteca Animate on Scroll (AOS) para criar animações de entrada elegantes conforme o usuário rola a página.
* **Carrossel de Depoimentos:** Exibe as avaliações de pacientes de forma dinâmica e interativa, utilizando a biblioteca Slick Carousel.
* **Performance:** Foco em alta performance com otimização de imagens (WebP), carregamento assíncrono de scripts e CSS, e minificação de arquivos.
* **Acessibilidade (A11y):** Implementação de boas práticas de acessibilidade, como atributos ARIA, contraste de cores e navegação por teclado.

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando tecnologias web fundamentais, sem a necessidade de frameworks complexos, garantindo leveza e performance.

* **HTML5:** Para a estrutura semântica do conteúdo.
* **CSS3:** Para estilização, layout (Flexbox e Grid), animações e responsividade.
* **JavaScript (ES6+):** Para interatividade, manipulação do DOM e funcionalidades como o modo escuro e o menu mobile.
* **Bibliotecas Externas:**
    * **AOS (Animate on Scroll):** Para as animações de rolagem.
    * **jQuery:** Dependência para o Slick Carousel.
    * **Slick Carousel:** Para o carrossel de depoimentos.
    * **SVG Icons:** Ícones leves e escaláveis para uma interface limpa.

## 📁 Estrutura de Arquivos

O projeto está organizado da seguinte forma:

|-- index.html              # Arquivo principal da página
|-- README.md               # Este arquivo
|
|-- css/
|   |-- styles.css          # Folha de estilos principal (versão para desenvolvimento)
|   |-- styles.min.css      # Folha de estilos minificada (versão para produção)
|
|-- js/
|   |-- main.js             # Script principal com a lógica do site
|   |-- depoimentos.js      # Script de inicialização do carrossel
|
|-- img/
|   |-- logo.svg            # Logo principal do site
|   |-- juliana_hero.webp    # Imagem da psicóloga para a seção Hero
|   |-- juliana_sobre.webp   # Imagem da psicóloga para a seção Sobre
|   |-- bg-textura.webp      # Imagem de textura para o fundo
|   |-- favicon.ico         # Ícone para a aba do navegador
|   |-- ... (outras imagens)

## 🚀 Como Executar Localmente

Para visualizar e editar o projeto no seu computador, siga os passos:

1.  **Clone ou baixe o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/psicologa-juliana-levita.git](https://github.com/seu-usuario/psicologa-juliana-levita.git)
    ```

2.  **Navegue até a pasta do projeto:**
    ```bash
    cd psicologa-juliana-levita
    ```

3.  **Abra o arquivo `index.html`:**
    * A forma mais recomendada é utilizar uma extensão como o **Live Server** no Visual Studio Code. Basta clicar com o botão direito no arquivo `index.html` e selecionar "Open with Live Server".
    * Alternativamente, você pode abrir o arquivo `index.html` diretamente em qualquer navegador.

## ⚙️ Configuração e Customização

* **Informações de Contato:** Para alterar o número de WhatsApp, e-mail ou links de redes sociais, edite diretamente o arquivo `index.html` nas seções de Contato e Rodapé.
* **Textos e Imagens:** Todo o conteúdo textual e os caminhos das imagens podem ser alterados no `index.html`.
* **Cores e Fontes:** As cores principais, fontes e espaçamentos do site são controlados por variáveis CSS no topo do arquivo `css/styles.css`. Alterar uma variável (ex: `--color-brand-blue`) aplicará a mudança em todo o site.

---

Desenvolvido com foco em performance e experiência do usuário.