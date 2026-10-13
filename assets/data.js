// Content for the Just Business site. Facts come from justbusiness.is and wearenotforsale.org.
// Photography is placeholder (Unsplash) until real portfolio imagery is supplied.
window.JB = (function(){
  const img = (id, w) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w || 1600}&q=72`;

  const HUB = {name:'San Francisco', note:'Just Business', at:[-122.42, 37.77], k:'hub'};

  const ventures = [
    {
      slug:'hydra-energy', name:'Hydra Energy', short:'HY', theme:'planet', sector:'Clean transport', place:'Vancouver, Canada', at:[-123.1, 49.28],
      outcome:'Hydrogen trucks, without replacing the fleet.',
      line:'Converting existing heavy-duty trucks to run on hydrogen.',
      business:'Hydra Energy converts heavy-duty diesel trucks that fleets already own so they can run on hydrogen. Fleets cut fuel emissions without scrapping the trucks they rely on.',
      impact:'Heavy trucking is one of the hardest parts of transport to decarbonise. Converting existing vehicles brings cleaner freight on the road now, not a decade from now.',
      facts:[['CAD$15M','Raised to convert heavy-duty trucks to hydrogen','May 2021'],['First','Hydrogen-converted heavy-duty truck delivered to a paying fleet customer','Oct 2021'],['Chemtrade','Partnership to provide commercial truck fleets','Feb 2021']],
      image:img('photo-1768207750854-fb0cbd9c19f0'), imageAlt:'A truck crossing a desert road beneath power lines at dusk'
    },
    {
      slug:'abtc', name:'American Battery Technology', short:'AB', theme:'planet', sector:'Battery recycling', place:'Nevada, USA', at:[-119.81, 39.53],
      outcome:'Battery metals, back in the supply chain.',
      line:'Returning critical battery metals to the supply chain.',
      business:'American Battery Technology Company (ABTC) recycles lithium-ion batteries and recovers the critical metals inside them, so they can go back into new batteries.',
      impact:'Every recovered metal is one that doesn’t have to be mined, and one less battery headed for landfill, as demand for electric vehicles and storage keeps rising.',
      facts:[['$4.5M','Grant from the U.S. Department of Energy Advanced Manufacturing Office','Jan 2021']],
      image:img('photo-1742899273038-67ff67477663'), imageAlt:'Rows of batteries with red and blue terminals'
    },
    {
      slug:'rebbl', name:'REBBL', short:'RB', theme:'freedom', sector:'Beverages', place:'California, USA', at:[-122.29, 37.83],
      outcome:'A drinks supply chain that fights exploitation.',
      line:'Plant-based drinks with a supply chain built to fight exploitation.',
      business:'REBBL makes plant-based beverages and sells them through mainstream retail.',
      impact:'REBBL was built to prove a consumer brand can fight human trafficking through how it sources and how it shares its success, rather than adding to the problem.',
      facts:[['Featured','“Fighting human trafficking through a drinks company”','Mar 2021']],
      image:img('photo-1603569283847-aa295f0d016a'), imageAlt:'Fresh juices in glass bottles with produce on a table'
    },
    {
      slug:'dignita', name:'Dignita', short:'DG', theme:'freedom', sector:'Hospitality', place:'Amsterdam, Netherlands', at:[4.9, 52.37],
      outcome:'Kitchen careers for survivors of trafficking.',
      line:'Brunch cafés opening careers to survivors of trafficking.',
      business:'Dignita runs brunch cafés in Amsterdam: real restaurants, with real customers and a real menu.',
      impact:'Behind the counter, survivors of human trafficking get training, income and a route into a career in hospitality.',
      facts:[['Amsterdam','Brunch cafés with a training programme for survivors','Ongoing']],
      image:img('photo-1622021142947-da7dedc7c39a'), imageAlt:'A chef chopping vegetables in a professional kitchen'
    },
    {
      slug:'krunam', name:'Krunam', short:'KR', theme:'freedom', sector:'AI · Online safety', place:'United Kingdom', at:[-1.5, 52.6],
      outcome:'AI that finds abuse material at scale.',
      line:'AI that identifies child sexual abuse material at scale.',
      business:'Krunam builds AI classification technology that identifies child sexual exploitation and abuse (CSEA) material.',
      impact:'Investigators and platforms can find and act on abuse material faster, and people spend less time exposed to it.',
      facts:[['Launched','By Just Business and Vigil AI UK','Dec 2020']],
      image:img('photo-1695668548342-c0c1ad479aee'), imageAlt:'A rack of servers in a server room'
    }
  ];

  const nfsProjects = [
    {name:'Tanzania', note:'Mangrove restoration', at:[38.98, -5.43], k:'nfs', text:'Along the coast of Pangani, women-led teams are restoring degraded mangrove forests, rebuilding coastal biodiversity and community resilience.'},
    {name:'Argentina', note:'Native forest seeds', at:[-64.9, -23.3], k:'nfs', text:'Collecting native seeds, such as jacaranda from the Yungas forests, as the first step in growing trees for forest restoration.'},
    {name:'Bolivia', note:'Windbreak planting', at:[-63.18, -17.78], k:'nfs', text:'Hundreds of seedlings, carefully transported to form a critical new windbreak.'},
    {name:'California', note:'Sequoia replanting', at:[-118.7, 36.5], k:'nfs', text:'Planting sequoia seedlings by hand in groves burned by severe wildfires.'}
  ];

  const news = [
    {date:'2021-10-20', title:'Canada’s Hydra Energy first company to deliver a hydrogen-converted, heavy-duty vehicle to a paying fleet customer', tag:'Planet', v:'hydra-energy'},
    {date:'2021-05-27', title:'Hydra Energy secures CAD$15 million to convert existing heavy-duty trucks to run on green hydrogen', tag:'Funding', v:'hydra-energy'},
    {date:'2021-04-12', title:'What makes them tip', tag:'Ideas'},
    {date:'2021-04-06', title:'David Batstone: Impact stories. How to bring purpose to your company and take your story to the world', tag:'Ideas'},
    {date:'2021-04-01', title:'Interview with Menka Sethi from American Battery Technology (ABTC)', tag:'Interview', v:'abtc'},
    {date:'2021-03-11', title:'Fighting human trafficking through a drinks company', tag:'Freedom', v:'rebbl'},
    {date:'2021-02-23', title:'Hydra Energy partners with Chemtrade to provide commercial truck fleets', tag:'Planet', v:'hydra-energy'},
    {date:'2021-02-23', title:'This California investor predicts a 10-year “good economy” revolution that shoves the sharing economy aside', tag:'Ideas'},
    {date:'2021-02-19', title:'Why all the hoopla about hydrogen?', tag:'Planet', v:'hydra-energy'},
    {date:'2021-01-28', title:'American Battery Metals company selected for $4.5 million grant by U.S. Department of Energy Advanced Manufacturing Office', tag:'Funding', v:'abtc'},
    {date:'2020-12-17', title:'Just Business & Vigil AI UK launch Krunam, a CSEA AI company', tag:'Launch', v:'krunam'}
  ];

  const fmt = d => new Date(d + 'T12:00:00').toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'});
  const places = () => [...nfsProjects, ...ventures.map(v => ({name:v.name, note:v.place, at:v.at, k:'jb', slug:v.slug}))];

  return {HUB, ventures, nfsProjects, news, fmt, places, img, NEWS_URL:'https://www.justbusiness.is/news', NFS_URL:'https://wearenotforsale.org/'};
})();
