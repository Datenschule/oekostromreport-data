document.addEventListener("DOMContentLoaded", function () {
  const EventBus = new Vue();

  Vue.component('v-search', {
    props: [],
    template: `
           <label>Suche deinen Anbieter
             <input type="text"
                    placeholder="zB Anbietername, Website oder Stadt"
                    @input="$emit('typing', $event.target.value)">
           </label>`,
    methods: {},
    computed: {}
  });

  Vue.component('v-item', {
    props: ['item', 'criteria'],
    template: `
           <li>
             <a @click="select(item)">
             <h4>{{ item['Firmenname'] }}</h4>
               <p v-if="criteria[item['RoWo-Kriterien']]">{{ criteria[item['RoWo-Kriterien']]['cat']}}</p>
             </a>
           </li>`,
    methods: {
      select(item) {
        EventBus.$emit('select-item', this.item);
      }
    }
  });

  Vue.component('v-list', {
    props: ['list', 'criteria'],
    template: `<ul>
           <v-item v-for="item in list"
                   :key="item.index"
                   :item="item"
                   :criteria="criteria"></v-item>
         </ul>`,
  });

  Vue.component('v-profile', {
    props: ['item', 'criteria'],
    template: `
           <div v-if="item">
             <h2>{{this.item['Firmenname']}}</h2>
               <template v-if="criteria[item['RoWo-Kriterien']]">
                 <h3>{{ criteria[item['RoWo-Kriterien']]['cat']}}</h3>
                 <p><strong>{{ criteria[item['RoWo-Kriterien']]['note']}}</strong></p>
                 <p>{{ criteria[item['RoWo-Kriterien']]['text']}}</p>
                 <a :href="criteria[item['RoWo-Kriterien']]['link']">Mehr über dieses Kriterium</a>
               </template>
               <h3>Über diesen Anbieter</h3>
               <p>{{ item['Firmenname']}}</p>
               <p v-if="item['Stadt']">{{ item['Adresse']}}, {{ item['PLZ']}} {{ item['Stadt']}}</p>
               <p  v-if="item['URL']"><a :href="item['URL']">{{ item['URL']}}</a></p>
               <h3>Über den Strom des Anbieters</h3>
               <p>Regionaler| Überregionaler Stromanbieter <a href="#">Warum sind regionale Anbieter wichtig?</a></p>
               <p>Stromkennzeichnung: <a :href="item['Kennzeichnung']">{{ item['Kennzeichnung']}}</a> <a href="#">Was steckt hinter der Stromkennzeichnung?</a></p>
               <p>Ökostromlabels für ein oder mehr Stromprodukte <a href="#">Was sind Ökostromlabel?</a></p>
               <hr>
               <p>Link für diesen Abieter <input readonly type="text" :value="makeHref"></p>
           </div>`,
    computed: {
      makeHref() {
        return `${window.location}?anbieter=${encodeURI(this.item['Firmenname'])}`;
      }
    }
  });

  var app = new Vue({
    el: '#app',
    data: {
      original: [],
      providers: [],
      search: '',
      results: [],
      searchIndex: null,
      criteria: {},
      selectedProvider: {},
      state: 'search' // or profile
    },
    template: `
           <div class="v-search">
             <template v-if="state == 'search'">
               <template v-if="searchIndex">
                 <v-search v-on:typing="this.searching"></v-search>
                 <p v-if="this.results != 0">Anzahl Ergebnisse für "{{this.search}}":  {{this.results.length}}</p>
               </template>
               <p v-else>Anbieterdaten werden geladen</p>
               <v-list :list="this.results" :criteria="this.criteria"></v-list>
             </template>
             <template v-else>
               <button type="button" @click="toSearch">◂ Zu den Suchergebnissen</button>
               <v-profile v-if=selectedProvider
                          :item="selectedProvider"
                          :criteria="this.criteria"></v-profile>
              <p v-else>Anbieter nicht gefunden</p>
             </template>
           </div>`,
    mounted: function() {
      let baseUrl = window.baseurl || '';
      const url = `${baseUrl}/assets/data/indexanddata.json`;

      EventBus.$on('select-item', item => {
        this.selectedProvider = item;
        this.state = 'profile';
      });

      Promise.all([
        fetch(url).then((response)=>{
          return response.json();
        }).then((data)=>{
          this.original = data;
          this.providers = this.original.store;
          // lunr index is prebuild in scripts/build_index.js
          this.searchIndex = lunr.Index.load(data.idx);
        }),
        fetch(`${baseUrl}/assets/data/criteria.csv`)
          .then(response => {
            return response.text();
          }).then((data) => {
            let criteria = data.split('\n').slice(1).map(x => x.split(';'));
            criteria.forEach((v, i) => {
              this.criteria[v[0]] = {};
              this.criteria[v[0]]['cat'] = v[1];
              this.criteria[v[0]]['note'] = v[2];
              this.criteria[v[0]]['text'] = v[3];
              this.criteria[v[0]]['link'] = v[4];
            });
          })]).then(() => {
            let params = window.location.search.split("?anbieter=");
            if (params.length != -1 && params.length > 1) {

              let results = Object.values(this.providers)
                  .filter((x, i) => encodeURI(x['Firmenname']) === params[1]);
              if (results.length < 0) {
                console.log('Nothing found, try search');
                this.state = 'search';
              } else {
                this.selectedProvider = results[0];
                this.state = 'profile';
              }
            } else {
              this.state = 'search';
            }
          });
    },
    methods: {
      searching(term) {
        this.search = term;
        if (term.length > 2) {
          let results = this.searchIndex.search('*'+term +'*');
          this.results = results.map(v => {
            let indexAsInt = parseInt(v.ref, 10);
            return this.providers[indexAsInt];
          });
        } else {
          this.results = [];
        }
      },
      toSearch() {
        this.state = 'search';
      }
    }
  });
});
