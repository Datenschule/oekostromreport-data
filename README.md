# Prototyp für clientseitige Suche

Mit VueJS und Lunr


## Scripts

`assets/providers-<>.csv` wird generiert aus dem Arbeitsspeadsheet via OpenRefine.

Dependencies installieren nicht vergessen! `$ yarn install`

`$ yarn run everything` wandelt das csv in json um und erstellt den lunr Suchindex.

`$ yarn run cp2docs` kopiert die relevanten Dateien in den `docs` Ordner für GitHub Pages.
