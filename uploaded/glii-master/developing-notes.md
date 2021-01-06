
### Reminders about how to run the tests:

npm install
npm run test



### Reminders about how to build the docs:

Leafdoc API and Leafdoc UML class diagram:

npm install
npm run docs


Turn diagram .dot files (graphviz, see https://graphviz.org/) into images:

apt-get install graphviz
dot -Tpng -O foo.dot


Turn primer markdown into HTML:

apt-get install cmark
cmark --unsafe primer.md > primer.html




