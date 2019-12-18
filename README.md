# Oekostrom Proto


## Setup

Diese Seite ist basiert auf [Jekyll](https://jekyllrb.com/) um schnell ein paar Templates und eine Prototyp-Website ausgeben zu können. Die Seite kann mit `$ jekyll build` gebaut oder mit `$ jekyll serve` als lokaler Dev-Server genutzt werden.

Die wichtigsten Daten liegen in ``assets/data-src`. Durch Node-Scripte werden diese umgewandelt und in `assets/data` abgelegt. Die einzelnen Scripte sind in `package.json` definiert und können entweder einzeln oder gebündelt mit npm oder yarn ausgeführt werden. zB `$ yarn run everything`.

An JavaScript Dateien müssen Lunr (Suche), D3 (Diagramme) und Vue (Rendering) als Dependencies eingebunden werden, zusammen mit den ausführenen Scripten, die die Suche und die Diagramme definieren.
Sie befinden sich alle in `assets/js`. @Todo script um diese zu in 1 Produktionsscript zu mergen

Einige Styles liegen, nachdem die Seite einmal gebaut wurde, in `_site/css/main.css`.


## Suche

Die Suche benötigt einen Kontainer mit ID "app" und die Pfade der Anbieter.json und der Kriterien.csv


``` html
<div id="app"
     data-providerdata="/assets/data/indexanddata.json"
     data-criteriadata="/assets/data/criteria.csv"></div>
```
Beide Dateien befinden sich in `assets/data/` und können direkt genutzt werden.

Ändern sich die Grunddaten in `assets/data-src`, können sie mit `$ yarn run everything` jederzeit neu generiert werden.

Die Suche ist in `assets/js/search.js` gebaut und braucht `assets/lunr.js` und `assets/vue.min.js`.

## Diagramme

Es gibt zwei Diagramme: Tortendiagramme für Strommixe und ein Balkendiagramm für Kraftwerksdaten.
Beide Diagramme sind in `assets/chart.js` beschrieben und brauchen `assets/d3.min.js` als Abhängigkeit.

### Tortendiagramm

Das Tortendiagramm für den Strommix benötigt zwei Elemente, einen Container in den das Diagramm gesetzt wird, und ein Element, dass die Daten in data-Attributen definiert. (Diese data-Attribute werden auch im CSS verwendet.

``` html
<div class="chartcontainer" id="chart1"></div>

<div data-piechart="chart1">
    <p data-water="53.93">53,93% Wasser</p>
    <p data-wind="46.57">46,57% Wind</p>
    <p data-solar="1.12">1,50% Solar</p>
</div>
```
Wichtig ist, dass die ID des Containers mit dem Wert im `data-piechart`-Attribut des Datenelements übereinstimmt.

### Balkendiagramm

Das Bakendiagramm visualsiert Anzahl, Art und Alter der Kraftwerke, für die der Anbieter Herkunftsnachweise gekauft hat.

``` html
<div id="barchart"
     data-barchart="barchart"
     data-powerdata="/assets/data/powerplants.json"
     class="chart"></div>
```
Wichtig ist, dass das  `data-barchart`-Attribut gesetzt ist, danach sucht das Script. Die ID ist nur wichtig, falls mehrere Diagramme auf der Seite erscheinen sollen (Zur Zeit nicht geplant). Das `data-powerdata`-Attribut Zeit zu einem JSON mit Kraftwerksdaten des jeweiligen Anbieters.

Zur Zeit bdefindet sich in `assets/data/powerplants.json` eine Testdatei mit den schematischen Struktur.
