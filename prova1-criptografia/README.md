# Implementação Web de Algoritmos Criptográficos (DES e RSA)

Este projeto apresenta a implementação manual e didática de dois dos mais importantes algoritmos da história da criptografia: o **DES (Data Encryption Standard)** para criptografia simétrica e o **RSA (Rivest-Shamir-Adleman)** para criptografia assimétrica. 

Nenhuma biblioteca criptográfica externa foi utilizada para os cálculos centrais (apenas a API criptográfica nativa do navegador para a geração do Vetor de Inicialização aleatório no DES).

---

## 🛠️ Instruções de Compilação e Execução

Este projeto foi construído inteiramente com tecnologias web front-end nativas (HTML, JavaScript e Tailwind CSS). Portanto, ele **não requer compilação**, instalação de pacotes (como npm/node) ou configuração de servidores de backend.

### Como executar:
1. Faça o clone ou o download deste repositório para o seu computador.
2. Navegue até a pasta raiz do projeto (`prova1-criptografia`).
3. Dê um duplo clique no arquivo `index.html`. 
4. O projeto será aberto imediatamente no seu navegador web padrão (Chrome, Edge, Firefox, Safari).

### Estrutura de Pastas
- `index.html`: Interface visual do usuário.
- `js/des/`: Contém a lógica modularizada do DES (Tabelas, Core, Utils, CBC e UI).
- `js/rsa/`: Contém a lógica modularizada do RSA (Matemática, Core e UI).

---

## 🧠 Fundamentação Teórica e Matemática

### 1. DES (Data Encryption Standard)
O DES é uma cifra de bloco simétrica. Isso significa que ele utiliza a mesma chave tanto para cifrar quanto para decifrar a informação, dividindo os dados em blocos de tamanho fixo.

**Fundamentos Matemáticos e Arquitetura:**
- **Tamanho do Bloco e da Chave:** O DES processa blocos de exatos **64 bits** por vez. A chave fornecida pelo usuário também tem 64 bits (8 caracteres), porém 8 bits são descartados como paridade pela tabela `PC1`, resultando em uma chave efetiva de **56 bits**.
- **Rede de Feistel:** O coração do DES é a Função de Feistel. O bloco de 64 bits é dividido em duas metades de 32 bits: Esquerda (L) e Direita (R). Ao longo de 16 rodadas (rounds), a metade direita sofre expansão, XOR com a subchave da rodada, e substituição nas Caixas S, sendo finalmente somada com XOR à metade esquerda.
- **S-Boxes (A Mágica Não-Linear):** A segurança do algoritmo repousa nas Caixas de Substituição (S-Boxes). Elas recebem blocos de 6 bits e os comprimem em 4 bits usando uma matriz pré-definida. Esses valores foram escolhidos cirurgicamente pela IBM/NSA nos anos 70 para resistir a uma técnica chamada *Criptoanálise Diferencial*.
- **Escalonamento de Chaves (Key Schedule):** Através de sucessivos deslocamentos circulares para a esquerda (*Left Shifts*) e da tabela `PC2`, a chave original de 56 bits gera 16 subchaves únicas de 48 bits, uma para cada rodada de Feistel.

**Implementação em Arquivos Reais:**
- **Modo CBC (Cipher Block Chaining):** O DES cru processa apenas 8 bytes. Para encriptar imagens ou PDFs, implementamos o CBC. Cada novo bloco limpo sofre um XOR com o bloco criptografado anterior antes de ser processado pelo DES. O primeiro bloco usa um **Vetor de Inicialização (IV)** aleatório de 8 bytes, que é salvo no início do arquivo final.
- **Preenchimento PKCS#7:** Arquivos não costumam ter tamanhos exatos múltiplos de 8. Se faltarem 3 bytes para fechar um bloco, injetamos três bytes com o valor numérico `03`. Na hora de decifrar, lemos esse último byte para validar e remover o preenchimento, garantindo que o arquivo não corrompa.

---

### 2. RSA (Rivest-Shamir-Adleman)
O RSA é um criptossistema assimétrico baseado no rigor da Teoria dos Números. Ele usa um par de chaves: uma Pública (para trancar) e uma Privada (para destrancar). 

**Fundamentos Matemáticos e Arquitetura:**
O algoritmo baseia-se na dificuldade computacional de fatorar o produto de dois números primos muito grandes.

1. **Geração dos Primos:** Escolhemos aleatoriamente dois números primos (chamados **p** e **q**).
2. **Cálculo do Módulo (N):** O limite da nossa "aritmética de relógio" é calculado por:  
   $N = p \times q$
3. **Função Totiente de Euler ($\phi$):** Indica a quantidade de números inteiros menores que $N$ e que são co-primos a ele.  
   $\phi(N) = (p - 1) \times (q - 1)$
4. **Expoente Público (E):** Um número aleatório maior que 1 e menor que $\phi$, tal que $MDC(E, \phi) = 1$. O par **(E, N)** forma a **Chave Pública**.
5. **Expoente Privado (D):** Calculado usando o **Algoritmo de Euclides Estendido**. Ele é o inverso modular de $E$ na base $\phi$, ou seja:  
   $(D \times E) \equiv 1 \pmod{\phi(N)}$  
   O par **(D, N)** forma a **Chave Privada**.

**A Matemática de Cifrar e Decifrar:**
- **Cifrar (Chave Pública):** A mensagem (M) é transformada em um número e elevada ao expoente público dentro do limite modular:  
  $C = M^E \pmod N$
- **Decifrar (Chave Privada):** O número cifrado (C) é elevado ao expoente privado:  
  $M = C^D \pmod N$

**Desafios da Implementação:**
No JavaScript, operações de potência com números primos geram números absurdamente imensos (centenas de dígitos), estourando o limite da linguagem. Para resolver isso:
- Utilizamos o tipo nativo **`BigInt`**.
- Implementamos o algoritmo de **Exponenciação Modular** (*Square and Multiply*). Ele calcula potências sem precisar elevar o número fisicamente à sua totalidade antes de tirar o módulo, reduzindo drasticamente o processador exigido e impedindo que a aba do navegador trave.
