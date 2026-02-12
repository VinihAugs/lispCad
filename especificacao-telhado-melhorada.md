# Especificação Técnica: Distribuição de Telhas Romanas no AutoCAD

## Objetivo
Criar uma rotina AutoLISP que distribui telhas romanas em um telhado, garantindo performance, precisão geométrica e escalabilidade.

---

## 1. Dados de Entrada

### Dimensões da Telha
- **Largura (eixo X):** 18 cm
- **Comprimento (eixo Y):** 15 cm

### Parâmetros do Usuário
1. **P1** (Ponto Inicial): Primeiro ponto que define a base do telhado
2. **P2** (Ponto Final): Segundo ponto que define a largura total do telhado
3. **N** (Número de Fileiras): Quantidade de fileiras de telhas na profundidade

### Representação no AutoCAD
- Cada telha será criada como uma **LWPOLYLINE fechada** (4 vértices)
- Isso otimiza o banco de dados do DWG

---

## 2. Processamento

### Passo 1: Captura e Cálculo dos Dados Base

1. **Obter pontos do usuário:**
   - Solicitar `P1` e `P2` usando `getpoint`

2. **Calcular distância total:**
   - Distância entre P1 e P2 usando `distance`
   - Esta é a largura total do telhado

3. **Calcular ângulo de inclinação:**
   - Usar `angle` para obter o ângulo entre P1 e P2
   - Permite desenhar o telhado em qualquer direção (não apenas horizontal)

4. **Calcular número de colunas:**
   - Quantidade de telhas na largura: `Colunas = Inteiro(Distância / 0.18)`
   - Opcional: ajustar espaçamento para preencher exatamente a distância

### Passo 2: Estrutura de Repetição

A rotina usa dois loops aninhados:

- **Loop Externo:** Itera as fileiras (de 0 até N-1)
- **Loop Interno:** Itera as colunas (de 0 até Colunas-1)

### Passo 3: Cálculo da Posição de Cada Telha

Para cada telha na posição (fileira, coluna):

1. **Calcular deslocamentos locais:**
   - Deslocamento X: `DistX = Coluna × 0.18`
   - Deslocamento Y: `DistY = Fileira × 0.15`

2. **Aplicar rotação:**
   - Rotacionar os deslocamentos pelo ângulo calculado
   - Isso garante que o telhado funcione em qualquer direção

3. **Calcular posição absoluta:**
   - Somar os deslocamentos rotacionados ao ponto P1

4. **Definir os 4 vértices da telha:**
   - V1 = Ponto base calculado
   - V2 = V1 + (0.18 no ângulo da base)
   - V3 = V2 + (0.15 no ângulo perpendicular)
   - V4 = V1 + (0.15 no ângulo perpendicular)

---

## 3. Criação das Entidades

### Método: `entmake` com LWPOLYLINE

Usar `entmake` em vez de comandos como `LINE` ou `RECTANG` porque:
- É mais rápido
- Ignora configurações de snap do usuário
- Processamento direto no banco de dados

### Códigos DXF Necessários

```
0   → "LWPOLYLINE" (tipo de entidade)
100 → "AcDbEntity" (marcador de subclasse)
100 → "AcDbPolyline" (marcador de subclasse)
90  → 4 (número de vértices)
70  → 1 (flag de fechamento)
10  → Coordenadas X,Y de cada vértice (4 pares)
8   → "ARQ-TELHADO" (nome da layer)
```

---

## 4. Algoritmo Resumido

```
Para cada Fileira de 0 até (N-1):
    Para cada Coluna de 0 até (Colunas-1):
        1. Calcular ponto base local (Coluna × 0.18, Fileira × 0.15)
        2. Rotacionar pelo ângulo entre P1 e P2
        3. Transladar para posição absoluta (somar com P1)
        4. Calcular 4 vértices da telha
        5. Criar LWPOLYLINE usando entmake
```

---

## 5. Considerações Importantes

### Tratamento de Erros
- Implementar handler `*error*` para restaurar:
  - Estado do `OSNAP`
  - Variáveis de sistema do AutoCAD
- Garantir que o sistema volte ao normal se o usuário cancelar (ESC)

### Performance
- `entmake` é preferível a `command` porque:
  - Processamento instantâneo
  - Não depende de snap do usuário
  - Essencial para centenas de fileiras

### Sistema de Coordenadas
- Converter pontos de UCS (User Coordinate System) para WCS (World Coordinate System)
- Garante que o desenho não fique distorcido em:
  - Vistas 3D
  - UCS rotacionados

---

## Resultado Esperado

Uma rotina robusta, rápida e matematicamente precisa que distribui telhas romanas em qualquer direção e orientação no AutoCAD.

