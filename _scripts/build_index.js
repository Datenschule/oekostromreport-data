var lunr = require('lunr'),
    stdin = process.stdin,
    stdout = process.stdout,
    buffer = [],
    documents = {}

stdin.resume()
stdin.setEncoding('utf8')

stdin.on('data', function (data) {
  buffer.push(data)
})

stdin.on('end', function () {
  documents = JSON.parse(buffer.join(''))

  var idx = lunr(function () {
    this.ref('index');
    this.field('Firmenname');
    this.field('URL');
    this.field('Stadt');

    documents.forEach((doc, i) => {
      doc.index = i;
      if (doc['RoWo-Kriterien'] == "0") {
        doc['RoWo-Kriterien'] = "Z"
      }
      this.add(doc)
    }, this)
  })

  stdout.write(JSON.stringify({idx: idx, store: documents}))
})
