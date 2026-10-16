# cens/lab — Repartiment de diputats de València

Aplicació web estàtica i adaptable per a simular el repartiment d'escons de la província de València al Congrés dels Diputats.

## Funcionalitats

- Repartiment d'escons mitjançant la fórmula **D'Hondt**.
- Edició del nom de cada candidatura i del nombre de vots.
- Afegir o eliminar candidatures.
- Configuració del nombre d'escons i del llindar electoral.
- Resultats en directe, percentatges de vot, escons i representació visual.
- Interfície adaptable a ordinador i mòbil.
- No necessita servidor ni instal·lació de dependències.

## Com s'utilitza

1. Obri `index.html` en un navegador.
2. Canvia els noms i els vots dels partits.
3. Si cal, modifica el nombre d'escons i el llindar.
4. Els resultats es recalculen automàticament. «Restaurar exemple» recupera les dades fictícies inicials.

## Algorisme

Primer es calcula el percentatge de vots de cada candidatura respecte del total introduït. Les candidatures per davall del llindar configurat queden excloses. Per a les candidatures elegibles, es generen els quocients `vots / 1`, `vots / 2`, `vots / 3`… i s'assignen els escons als quocients més alts fins a completar el nombre d'escons configurat.

## Notes importants

- Les dades que apareixen inicialment són **fictícies** i només serveixen per a mostrar el funcionament.
- El nombre inicial d'escons és 16, editable per l'usuari.
- El llindar del 3% és el valor per defecte de la simulació. Per a una simulació electoral oficial, comprova les normes vigents aplicables a la convocatòria concreta.
- És una eina educativa, no una previsió ni un resultat electoral oficial.
- Google Fonts necessita connexió a internet; la resta de l'aplicació funciona localment.

## Fitxers

- `index.html`: estructura i contingut.
- `style.css`: disseny i adaptació a diferents pantalles.
- `app.js`: dades, càlcul D'Hondt i actualització de resultats.
- `README.md`: documentació.
